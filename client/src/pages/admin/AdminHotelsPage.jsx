import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../api/apiClient";
import { UI_TEXT } from "../../constants/uiText";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import AdminEntityCard from "../../components/admin/AdminEntityCard";
import HotelForm from "../../components/admin/HotelForm";
import ConfirmModal from "../../components/ConfirmModal";

import { PageTitle, MessageText, ErrorText, LocationIcon, StarRating } from "../../styles/SharedUI";

import {
  Container,
  TopBar,
  ManagementGrid,
  ActionButton,
  SecondaryButton,
  DeleteButton,
} from "../../styles/AdminPagesStyle";

const emptyHotelForm = {
  name: "",
  country: "",
  city: "",
  stars: "1",
  description: "",
  imageUrl: "",
};

const AdminHotelsPage = () => {
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [hotelForm, setHotelForm] = useState(emptyHotelForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoadingHotels, setIsLoadingHotels] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingHotelId, setEditingHotelId] = useState(null);
  const [hotelToDelete, setHotelToDelete] = useState(null);
  const [confirmAction, setConfirmAction] = useState("");

  useEffect(() => {
    const loadInitialHotels = async () => {
      try {
        const data = await apiClient("/hotels");
        setHotels(data.filter((hotel) => !hotel.isDeleted));
      } catch (err) {
        setError(ERROR_MESSAGES[err.error] || UI_TEXT.SOMETHING_WENT_WRONG);
      } finally {
        setIsLoadingHotels(false);
      }
    };

    loadInitialHotels();
  }, []);

  const refreshHotels = async () => {
    const data = await apiClient("/hotels");
    setHotels(data.filter((hotel) => !hotel.isDeleted));
  };

  const handleOpenAddForm = () => {
    setEditingHotelId(null);
    setHotelToDelete(null);
    setHotelForm(emptyHotelForm);
    setIsFormOpen(true);
    setError("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setHotelForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditHotel = (hotel) => {
    setEditingHotelId(hotel.id);
    setHotelToDelete(null);

    setHotelForm({
      name: hotel.name || "",
      country: hotel.country || "",
      city: hotel.city || "",
      stars: String(hotel.stars || "1"),
      description: hotel.description || "",
      imageUrl: hotel.imageUrl || "",
    });

    setIsFormOpen(true);
    setError("");
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    setConfirmAction(editingHotelId ? "edit" : "create");
    setIsConfirmOpen(true);
  };

  const handleCreateHotel = async () => {
    try {
      setIsSaving(true);
      setError("");

      await apiClient("/hotels", {
        method: "POST",
        body: JSON.stringify({
          ...hotelForm,
          stars: Number(hotelForm.stars),
        }),
      });

      setIsConfirmOpen(false);
      setIsFormOpen(false);
      setHotelForm(emptyHotelForm);
      setEditingHotelId(null);
      setConfirmAction("");

      await refreshHotels();
    } catch (err) {
      setError(ERROR_MESSAGES[err.error] || UI_TEXT.SOMETHING_WENT_WRONG);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateHotel = async () => {
    try {
      setIsSaving(true);
      setError("");

      await apiClient(`/hotels/${editingHotelId}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...hotelForm,
          stars: Number(hotelForm.stars),
        }),
      });

      setIsConfirmOpen(false);
      setIsFormOpen(false);
      setHotelForm(emptyHotelForm);
      setEditingHotelId(null);
      setConfirmAction("");

      await refreshHotels();
    } catch (err) {
      setError(ERROR_MESSAGES[err.error] || UI_TEXT.SOMETHING_WENT_WRONG);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenDeleteConfirm = (hotel) => {
    setHotelToDelete(hotel);
    setEditingHotelId(null);
    setConfirmAction("delete");
    setIsConfirmOpen(true);
    setError("");
  };

  const handleDeleteHotel = async () => {
    try {
      setIsSaving(true);
      setError("");

      await apiClient(`/hotels/${hotelToDelete.id}/delete`, {
        method: "PATCH",
      });

      setIsConfirmOpen(false);
      setHotelToDelete(null);
      setConfirmAction("");

      await refreshHotels();
    } catch (err) {
      setError(ERROR_MESSAGES[err.error] || UI_TEXT.SOMETHING_WENT_WRONG);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmAction = () => {
    if (confirmAction === "delete") {
      handleDeleteHotel();
      return;
    }

    if (confirmAction === "edit") {
      handleUpdateHotel();
      return;
    }

    handleCreateHotel();
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setHotelForm(emptyHotelForm);
    setEditingHotelId(null);
    setError("");
  };

  const handleCancelConfirm = () => {
    setIsConfirmOpen(false);
    setHotelToDelete(null);
    setConfirmAction("");
  };

  const getConfirmTitle = () => {
    if (confirmAction === "delete") {
      return UI_TEXT.CONFIRM_DELETE_HOTEL_TITLE;
    }

    if (confirmAction === "edit") {
      return UI_TEXT.CONFIRM_EDIT_HOTEL_TITLE;
    }

    return UI_TEXT.CONFIRM_CREATE_HOTEL_TITLE;
  };

  const getConfirmMessage = () => {
    if (confirmAction === "delete") {
      return UI_TEXT.CONFIRM_DELETE_HOTEL_MESSAGE;
    }

    if (confirmAction === "edit") {
      return UI_TEXT.CONFIRM_EDIT_HOTEL_MESSAGE;
    }

    return UI_TEXT.CONFIRM_CREATE_HOTEL_MESSAGE;
  };

  const getConfirmText = () => {
    if (confirmAction === "delete") {
      return UI_TEXT.DELETE;
    }

    return UI_TEXT.SAVE;
  };

  if (isLoadingHotels) {
    return (
      <Container>
        <MessageText>{UI_TEXT.LOADING_HOTELS}</MessageText>
      </Container>
    );
  }

  return (
    <Container>
      <TopBar>
        <SecondaryButton type="button" onClick={() => navigate("/admin")}>
          {UI_TEXT.BACK}
        </SecondaryButton>

        <PageTitle>{UI_TEXT.ADMIN_HOTELS_TITLE}</PageTitle>

        <ActionButton type="button" onClick={handleOpenAddForm}>
          {UI_TEXT.ADMIN_ADD_HOTEL}
        </ActionButton>
      </TopBar>

      {isFormOpen && (
        <HotelForm
          hotel={hotelForm}
          onChange={handleFormChange}
          onSubmit={handleSubmitForm}
          onCancel={handleCancelForm}
          submitText={UI_TEXT.SAVE}
          isLoading={isSaving}
        />
      )}

      {error && <ErrorText>{error}</ErrorText>}

      {!error && hotels.length === 0 && (
        <MessageText>{UI_TEXT.NO_HOTELS_FOUND}</MessageText>
      )}

      <ManagementGrid>
        {hotels.map((hotel) => (
          <AdminEntityCard
            key={hotel.id}
            title={hotel.name}
            details={[
              { value: <StarRating>{"★".repeat(hotel.stars)}{"☆".repeat(5 - hotel.stars)}</StarRating> },
              { value: <><LocationIcon src="/illustrations/icons/location.svg" alt="" />{hotel.city}, {hotel.country}</> },
              { value: hotel.description || UI_TEXT.NO_DESCRIPTION },
            ]}
            actions={[
              {
                label: UI_TEXT.ADMIN_MANAGE_ROOMS,
                Component: ActionButton,
                onClick: () => navigate(`/admin/hotels/${hotel.id}/rooms`),
              },
              {
                label: UI_TEXT.ADMIN_EDIT_HOTEL,
                Component: SecondaryButton,
                onClick: () => handleEditHotel(hotel),
              },
              {
                label: UI_TEXT.ADMIN_DELETE_HOTEL,
                Component: DeleteButton,
                onClick: () => handleOpenDeleteConfirm(hotel),
              },
            ]}
          />
        ))}
      </ManagementGrid>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title={getConfirmTitle()}
        message={getConfirmMessage()}
        confirmText={getConfirmText()}
        cancelText={UI_TEXT.CANCEL}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelConfirm}
        isLoading={isSaving}
      />
    </Container>
  );
};

export default AdminHotelsPage;