import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import { formatCurrency } from "../utils/formatCurrency";
import { UI_TEXT } from "../constants/uiText";
import { ERROR_MESSAGES } from "../constants/errorMessages";

import { BackButton, ActionButton, SecondaryButton, SignatureButton, PageTitle, MessageText, ErrorText, InputGroup, Label, Input, DetailCard, ModalOverlay } from "../styles/SharedUI";

import {
  Container,
  RoomName,
  DetailText,
  Form,
  PriceBox,
  ModalCard,
  ModalTitle,
  ModalSubtitle,
  ModalDetails,
  ModalActions,
} from "../styles/BookingPageStyle";

const BookingPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    guests: "1",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const loadRoom = async () => {
      try {
        const data = await apiClient(`/hotels/rooms/${roomId}`);
        setRoom(data);
      } catch (err) {
        setError(ERROR_MESSAGES[err.error] || UI_TEXT.SOMETHING_WENT_WRONG);
      } finally {
        setIsLoading(false);
      }
    };

    loadRoom();
  }, [roomId]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));

    setError("");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("he-IL");
  };

  const calculateNights = () => {
    if (!formData.startDate || !formData.endDate) {
      return 0;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    const diffTime = end - start;
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return nights > 0 ? nights : 0;
  };

  const nights = calculateNights();

  const finalPrice = room && nights > 0 ? nights * room.price * 1.18 : 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!room) {
      setError(UI_TEXT.ROOM_NOT_FOUND);
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setError(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
      return;
    }

    if (formData.startDate < today || formData.endDate < today) {
      setError(ERROR_MESSAGES.PAST_BOOKING_DATE);
      return;
    }

    if (nights <= 0) {
      setError(ERROR_MESSAGES.END_DATE_BEFORE_START_DATE);
      return;
    }

    if (!formData.guests) {
      setError(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
      return;
    }

    if (Number(formData.guests) < 1) {
      setError(ERROR_MESSAGES.INVALID_USER_INPUT);
      return;
    }

    if (Number(formData.guests) > room.maxGuests) {
      setError(ERROR_MESSAGES.TOO_MANY_GUESTS);
      return;
    }

    setError("");
    setIsReviewModalOpen(true);
  };

  const handleFinalConfirm = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      const result = await apiClient("/hotels/reserve", {
        method: "POST",
        body: JSON.stringify({
          roomId: room.id,
          hotelId: room.hotelId,
          startDate: formData.startDate,
          endDate: formData.endDate,
          guests: Number(formData.guests),
        }),
      });

      navigate(`/reservations/${result.reservation.id}`);
    } catch (err) {
      setError(ERROR_MESSAGES[err.error] || UI_TEXT.SOMETHING_WENT_WRONG);
      setIsReviewModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <MessageText>{UI_TEXT.LOADING_HOTEL_DETAILS}</MessageText>;
  }

  if (!room && error) {
    return <ErrorText>{error}</ErrorText>;
  }

  if (!room) {
    return <MessageText>{UI_TEXT.ROOM_NOT_FOUND}</MessageText>;
  }

  return (
    <Container>
      <BackButton onClick={() => navigate(`/rooms/${room.id}`)}>
        {UI_TEXT.BACK}
      </BackButton>

      <DetailCard>
        <PageTitle>{UI_TEXT.RESERVATION_DETAILS}</PageTitle>

        <RoomName>{room.name}</RoomName>

        {room.hotel?.name && <DetailText>{room.hotel.name}</DetailText>}

        <DetailText>
          {UI_TEXT.PRICE_PER_NIGHT}: {formatCurrency(room.price)}
        </DetailText>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="startDate">{UI_TEXT.CHECK_IN_LABEL}</Label>
            <Input
              type="date"
              id="startDate"
              min={today}
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="endDate">{UI_TEXT.CHECK_OUT_LABEL}</Label>
            <Input
              type="date"
              id="endDate"
              min={formData.startDate || today}
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="guests">{UI_TEXT.ACCOMMODATION_CAPACITY_LABEL}</Label>
            <Input
              type="number"
              id="guests"
              min="1"
              max={room.maxGuests}
              value={formData.guests}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <PriceBox>
            <DetailText>
              {UI_TEXT.NIGHTS}: {nights}
            </DetailText>

            <DetailText>
              {UI_TEXT.TOTAL_PRICE_INCLUDING_VAT}: {formatCurrency(finalPrice)}
            </DetailText>
          </PriceBox>

          {error && <ErrorText>{error}</ErrorText>}

          <ActionButton type="submit" disabled={isSubmitting}>
            {UI_TEXT.CONFIRM_BOOKING}
          </ActionButton>
        </Form>
      </DetailCard>

      {isReviewModalOpen && (
        <ModalOverlay>
          <ModalCard>
            <ModalTitle>{UI_TEXT.BOOKING_REVIEW_TITLE}</ModalTitle>
            <ModalSubtitle>{UI_TEXT.BOOKING_REVIEW_SUBTITLE}</ModalSubtitle>

            <ModalDetails>
              <DetailText>
                {UI_TEXT.BOOKING_REVIEW_HOTEL}: {room.hotel?.name}
              </DetailText>

              <DetailText>
                {UI_TEXT.BOOKING_REVIEW_ROOM}: {room.name}
              </DetailText>

              <DetailText>
                {UI_TEXT.BOOKING_REVIEW_DATES}: {formatDate(formData.startDate)} -{" "}
                {formatDate(formData.endDate)}
              </DetailText>

              <DetailText>
                {UI_TEXT.NIGHTS}: {nights}
              </DetailText>

              <DetailText>
                {UI_TEXT.ACCOMMODATION_CAPACITY_LABEL}: {formData.guests}
              </DetailText>

              <DetailText>
                {UI_TEXT.TOTAL_PRICE_INCLUDING_VAT}: {formatCurrency(finalPrice)}
              </DetailText>
            </ModalDetails>

            <ModalActions>
              <SecondaryButton
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                disabled={isSubmitting}
              >
                {UI_TEXT.BACK_TO_EDITING}
              </SecondaryButton>

              <SignatureButton
                type="button"
                onClick={handleFinalConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? UI_TEXT.LOADING : UI_TEXT.BOOKING_REVIEW_FINAL_CONFIRM}
              </SignatureButton>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default BookingPage;