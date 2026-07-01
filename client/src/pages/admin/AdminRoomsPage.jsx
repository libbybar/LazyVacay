import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../../api/apiClient";
import { UI_TEXT } from "../../constants/uiText";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import AdminEntityCard from "../../components/admin/AdminEntityCard";
import RoomForm from "../../components/admin/RoomForm";
import ConfirmModal from "../../components/ConfirmModal";

import { PageTitle, MessageText, ErrorText } from "../../styles/SharedUI";

import {
  Container,
  TopBar,
  ManagementGrid,
  ActionButton,
  SecondaryButton,
  DeleteButton,
} from "../../styles/AdminPagesStyle";

const emptyRoomForm = {
  name: "",
  size: "",
  maxGuests: "",
  price: "",
  description: "",
  imageUrl: "",
};

const AdminRoomsPage = () => {
  const navigate = useNavigate();
  const { hotelId } = useParams();

  const [rooms, setRooms] = useState([]);
  const [roomForms, setRoomForms] = useState([emptyRoomForm]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState("");
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [error, setError] = useState("");
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const hotel = await apiClient(`/hotels/${hotelId}`);
        setRooms((hotel.rooms || []).filter((room) => !room.isDeleted));
      } catch (err) {
        setError(ERROR_MESSAGES[err.error] || UI_TEXT.SOMETHING_WENT_WRONG);
      } finally {
        setIsLoadingRooms(false);
      }
    };

    loadRooms();
  }, [hotelId]);

  const refreshRooms = async () => {
    const hotel = await apiClient(`/hotels/${hotelId}`);

    setRooms((hotel.rooms || []).filter((room) => !room.isDeleted));
  };

  const handleOpenAddForm = () => {
    setEditingRoomId(null);
    setRoomToDelete(null);
    setRoomForms([emptyRoomForm]);
    setIsFormOpen(true);
    setError("");
  };

  const handleAddRoomRow = () => {
    setRoomForms((prevRooms) => [...prevRooms, emptyRoomForm]);
  };

  const handleRemoveRoomRow = (roomIndex) => {
    setRoomForms((prevRooms) =>
      prevRooms.filter((room, index) => index !== roomIndex)
    );
  };

  const handleRoomFormChange = (roomIndex, e) => {
    const { name, value } = e.target;

    setRoomForms((prevRooms) =>
      prevRooms.map((room, index) =>
        index === roomIndex
          ? {
              ...room,
              [name]: value,
            }
          : room
      )
    );
  };

  const handleEditRoom = (room) => {
    setEditingRoomId(room.id);
    setRoomToDelete(null);

    setRoomForms([
      {
        name: room.name || "",
        size: String(room.size || ""),
        maxGuests: String(room.maxGuests || ""),
        price: String(room.price || ""),
        description: room.description || "",
        imageUrl: room.imageUrl || "",
      },
    ]);

    setIsFormOpen(true);
    setError("");
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    setConfirmAction(editingRoomId ? "edit" : "create");
    setIsConfirmOpen(true);
  };

  const buildRoomBody = (room) => ({
    ...room,
    size: Number(room.size),
    maxGuests: Number(room.maxGuests),
    price: Number(room.price),
    hotelId,
  });

  const handleCreateRooms = async () => {
    try {
      setIsSaving(true);
      setError("");

      for (const room of roomForms) {
        await apiClient("/hotels/rooms", {
          method: "POST",
          body: JSON.stringify(buildRoomBody(room)),
        });
      }

      setIsConfirmOpen(false);
      setIsFormOpen(false);
      setRoomForms([emptyRoomForm]);
      setConfirmAction("");

      await refreshRooms();
    } catch (err) {
      setError(ERROR_MESSAGES[err.error] || UI_TEXT.SOMETHING_WENT_WRONG);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateRoom = async () => {
    try {
      setIsSaving(true);
      setError("");

      await apiClient(`/hotels/rooms/${editingRoomId}`, {
        method: "PATCH",
        body: JSON.stringify(buildRoomBody(roomForms[0])),
      });

      setIsConfirmOpen(false);
      setIsFormOpen(false);
      setRoomForms([emptyRoomForm]);
      setEditingRoomId(null);
      setConfirmAction("");

      await refreshRooms();
    } catch (err) {
      setError(ERROR_MESSAGES[err.error] || UI_TEXT.SOMETHING_WENT_WRONG);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenDeleteConfirm = (room) => {
    setRoomToDelete(room);
    setEditingRoomId(null);
    setConfirmAction("delete");
    setIsConfirmOpen(true);
    setError("");
  };

  const handleDeleteRoom = async () => {
    try {
      setIsSaving(true);
      setError("");

      await apiClient(`/hotels/rooms/${roomToDelete.id}/delete`, {
        method: "PATCH",
      });

      setIsConfirmOpen(false);
      setRoomToDelete(null);
      setConfirmAction("");

      await refreshRooms();
    } catch (err) {
      setError(ERROR_MESSAGES[err.error] || UI_TEXT.SOMETHING_WENT_WRONG);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmAction = () => {
    if (confirmAction === "delete") {
      handleDeleteRoom();
      return;
    }

    if (confirmAction === "edit") {
      handleUpdateRoom();
      return;
    }

    handleCreateRooms();
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setRoomForms([emptyRoomForm]);
    setEditingRoomId(null);
    setError("");
  };

  const handleCancelConfirm = () => {
    setIsConfirmOpen(false);
    setRoomToDelete(null);
    setConfirmAction("");
  };

  const getConfirmTitle = () => {
    if (confirmAction === "delete") return UI_TEXT.CONFIRM_DELETE_ROOM_TITLE;
    if (confirmAction === "edit") return UI_TEXT.CONFIRM_EDIT_ROOM_TITLE;
    return UI_TEXT.CONFIRM_CREATE_ROOM_TITLE;
  };

  const getConfirmMessage = () => {
    if (confirmAction === "delete") return UI_TEXT.CONFIRM_DELETE_ROOM_MESSAGE;
    if (confirmAction === "edit") return UI_TEXT.CONFIRM_EDIT_ROOM_MESSAGE;
    return UI_TEXT.CONFIRM_CREATE_ROOM_MESSAGE;
  };

  const getConfirmText = () => {
    if (confirmAction === "delete") return UI_TEXT.DELETE;
    return UI_TEXT.SAVE;
  };

  if (isLoadingRooms) {
    return (
      <Container>
        <MessageText>{UI_TEXT.LOADING_ROOMS}</MessageText>
      </Container>
    );
  }

  return (
    <Container>
      <TopBar>
        <SecondaryButton type="button" onClick={() => navigate("/admin/hotels")}>
          {UI_TEXT.BACK}
        </SecondaryButton>

        <PageTitle>{UI_TEXT.ADMIN_ROOMS_TITLE}</PageTitle>

        <ActionButton type="button" onClick={handleOpenAddForm}>
          {UI_TEXT.ADMIN_ADD_ROOM}
        </ActionButton>
      </TopBar>

      {isFormOpen && (
        <>
          <form onSubmit={handleSubmitForm}>
            {roomForms.map((room, index) => (
              <RoomForm
                key={index}
                room={room}
                roomIndex={index}
                onChange={(e) => handleRoomFormChange(index, e)}
                onSubmit={handleSubmitForm}
                onCancel={handleCancelForm}
                onRemove={() => handleRemoveRoomRow(index)}
                submitText={null}
                isLoading={isSaving}
                canRemove={!editingRoomId && roomForms.length > 1}
              />
            ))}

            {!editingRoomId && (
              <ActionButton type="button" onClick={handleAddRoomRow}>
                {UI_TEXT.ADMIN_ADD_ROOM_ROW}
              </ActionButton>
            )}

            <ActionButton type="submit" disabled={isSaving}>
              {UI_TEXT.SAVE}
            </ActionButton>
          </form>
        </>
      )}

      {error && <ErrorText>{error}</ErrorText>}

      {!error && rooms.length === 0 && (
        <MessageText>{UI_TEXT.NO_ROOMS_IN_HOTEL}</MessageText>
      )}

      <ManagementGrid>
        {rooms.map((room) => (
          <AdminEntityCard
            key={room.id}
            title={room.name}
            details={[
              { value: `${UI_TEXT.ROOM_SIZE}: ${room.size}` },
              { value: `${UI_TEXT.MAX_GUESTS}: ${room.maxGuests}` },
              { value: `${UI_TEXT.PRICE}: ${room.price}` },
              { value: room.description || UI_TEXT.NO_DESCRIPTION },
            ]}
            actions={[
              {
                label: UI_TEXT.ADMIN_EDIT_ROOM,
                Component: SecondaryButton,
                onClick: () => handleEditRoom(room),
              },
              {
                label: UI_TEXT.ADMIN_DELETE_ROOM,
                Component: DeleteButton,
                onClick: () => handleOpenDeleteConfirm(room),
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

export default AdminRoomsPage;