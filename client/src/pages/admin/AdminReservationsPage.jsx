import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../api/apiClient";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { UI_TEXT } from "../../constants/uiText";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import AdminEntityCard from "../../components/admin/AdminEntityCard";
import ConfirmModal from "../../components/ConfirmModal";

import { PageTitle, MessageText, ErrorText } from "../../styles/SharedUI";

import {
  Container,
  TopBar,
  ManagementGrid,
  ActionButton,
  SecondaryButton,
  FormCard,
  FormGrid,
  InputGroup,
  Label,
  Input,
  Select,
} from "../../styles/AdminPagesStyle";

const formatDateForInput = (dateValue) => {
  if (!dateValue) return "";

  return new Date(dateValue).toISOString().split("T")[0];
};

const emptyReservationForm = {
  startDate: "",
  endDate: "",
  status: "PENDING",
};

const AdminReservationsPage = () => {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [reservationForm, setReservationForm] = useState(emptyReservationForm);
  const [editingReservationId, setEditingReservationId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const data = await apiClient("/reservations");
        setReservations(data);
      } catch (err) {
        setError(ERROR_MESSAGES[err.error] || UI_TEXT.SOMETHING_WENT_WRONG);
      } finally {
        setIsLoadingReservations(false);
      }
    };

    loadReservations();
  }, []);

  const refreshReservations = async () => {
    const data = await apiClient("/reservations");
    setReservations(data);
  };

  const handleEditReservation = (reservation) => {
    setEditingReservationId(reservation.id);

    setReservationForm({
      startDate: formatDateForInput(reservation.startDate),
      endDate: formatDateForInput(reservation.endDate),
      status: reservation.status || "PENDING",
    });

    setIsFormOpen(true);
    setError("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setReservationForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const handleUpdateReservation = async () => {
    try {
      setIsSaving(true);
      setError("");

      await apiClient(`/reservations/${editingReservationId}`, {
        method: "PATCH",
        body: JSON.stringify(reservationForm),
      });

      setIsConfirmOpen(false);
      setIsFormOpen(false);
      setEditingReservationId(null);
      setReservationForm(emptyReservationForm);

      await refreshReservations();
    } catch (err) {
      setError(ERROR_MESSAGES[err.error] || UI_TEXT.SOMETHING_WENT_WRONG);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingReservationId(null);
    setReservationForm(emptyReservationForm);
    setError("");
  };

  const handleCancelConfirm = () => {
    setIsConfirmOpen(false);
  };

  const filteredReservations = reservations.filter((r) => {
    const q = filterText.toLowerCase();
    if (!q) return true;
    const fullName = `${r.user?.firstName ?? ""} ${r.user?.lastName ?? ""}`.toLowerCase();
    return (
      fullName.includes(q) ||
      (r.user?.email ?? "").toLowerCase().includes(q) ||
      (r.hotel?.name ?? "").toLowerCase().includes(q) ||
      (r.room?.name ?? "").toLowerCase().includes(q) ||
      (r.bookingNumber ?? r.id ?? "").toString().toLowerCase().includes(q)
    );
  });

  if (isLoadingReservations) {
    return (
      <Container>
        <MessageText>{UI_TEXT.LOADING_RESERVATIONS}</MessageText>
      </Container>
    );
  }

  return (
    <Container>
      <TopBar>
        <SecondaryButton type="button" onClick={() => navigate("/admin")}>
          {UI_TEXT.BACK}
        </SecondaryButton>

        <PageTitle>{UI_TEXT.ADMIN_RESERVATIONS_TITLE}</PageTitle>

        <div />
      </TopBar>

      {isFormOpen && (
        <FormCard onSubmit={handleSubmitForm}>
          <FormGrid>
            <InputGroup>
              <Label htmlFor="startDate">{UI_TEXT.CHECK_IN_LABEL}</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={reservationForm.startDate}
                onChange={handleFormChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="endDate">{UI_TEXT.CHECK_OUT_LABEL}</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={reservationForm.endDate}
                onChange={handleFormChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="status">{UI_TEXT.RESERVATION_STATUS}</Label>
              <Select
                id="status"
                name="status"
                value={reservationForm.status}
                onChange={handleFormChange}
              >
                <option value="PENDING">{UI_TEXT.STATUS_PENDING}</option>
                <option value="CONFIRMED">{UI_TEXT.STATUS_CONFIRMED}</option>
                <option value="CANCELLED">{UI_TEXT.STATUS_CANCELLED}</option>
              </Select>
            </InputGroup>
          </FormGrid>

          <ActionButton type="submit" disabled={isSaving}>
            {UI_TEXT.SAVE}
          </ActionButton>

          <SecondaryButton type="button" onClick={handleCancelForm}>
            {UI_TEXT.CANCEL}
          </SecondaryButton>
        </FormCard>
      )}

      {error && <ErrorText>{error}</ErrorText>}

      {!error && reservations.length === 0 && (
        <MessageText>{UI_TEXT.ADMIN_NO_RESERVATIONS}</MessageText>
      )}

      {reservations.length > 0 && (
        <InputGroup style={{ marginBottom: "1.5rem" }}>
          <Input
            type="text"
            placeholder={UI_TEXT.ADMIN_SEARCH_RESERVATIONS}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          {filterText && (
            <SecondaryButton type="button" onClick={() => setFilterText("")} style={{ marginTop: "0.5rem" }}>
              {UI_TEXT.CLEAR_SEARCH}
            </SecondaryButton>
          )}
        </InputGroup>
      )}

      <ManagementGrid>
        {filteredReservations.map((reservation) => (
          <AdminEntityCard
            key={reservation.id}
            title={`${UI_TEXT.BOOKING_NUMBER}: ${
              reservation.bookingNumber || reservation.id
            }`}
            details={[
              {
                value: `${UI_TEXT.RESERVATION_HOTEL}: ${
                  reservation.hotel?.name || UI_TEXT.NO_DESCRIPTION
                }`,
              },
              {
                value: `${UI_TEXT.RESERVATION_ROOM}: ${
                  reservation.room?.name || UI_TEXT.NO_DESCRIPTION
                }`,
              },
              {
                value: `${UI_TEXT.GUEST_NAME}: ${
                  reservation.user
                    ? `${reservation.user.firstName} ${reservation.user.lastName}`
                    : UI_TEXT.NO_DESCRIPTION
                }`,
              },
              {
                value: `${UI_TEXT.RESERVATION_EMAIL}: ${
                  reservation.user?.email || UI_TEXT.NO_DESCRIPTION
                }`,
              },
              {
                value: `${UI_TEXT.RESERVATION_DATES}: ${formatDate(
                  reservation.startDate
                )} - ${formatDate(reservation.endDate)}`,
              },
              {
                value: `${UI_TEXT.RESERVATION_STATUS}: ${reservation.status}`,
              },
              {
                value: `${UI_TEXT.PRICE}: ${formatCurrency(reservation.price)}`,
              },
            ]}
            actions={[
              {
                label: UI_TEXT.ADMIN_EDIT_RESERVATION,
                Component: SecondaryButton,
                onClick: () => handleEditReservation(reservation),
              },
            ]}
          />
          ))}
      </ManagementGrid>

      {filterText && filteredReservations.length === 0 && (
        <MessageText>{UI_TEXT.ADMIN_NO_SEARCH_RESULTS}</MessageText>
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title={UI_TEXT.CONFIRM_EDIT_RESERVATION_TITLE}
        message={UI_TEXT.CONFIRM_EDIT_RESERVATION_MESSAGE}
        confirmText={UI_TEXT.SAVE}
        cancelText={UI_TEXT.CANCEL}
        onConfirm={handleUpdateReservation}
        onCancel={handleCancelConfirm}
        isLoading={isSaving}
      />
    </Container>
  );
};

export default AdminReservationsPage;