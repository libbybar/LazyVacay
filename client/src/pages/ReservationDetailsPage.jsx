import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import { UI_TEXT } from "../constants/uiText";
import { ERROR_MESSAGES } from "../constants/errorMessages";

import {
  Container,
  ConfirmationCard,
  PageTitle,
  UserBlock,
  UserName,
  UserEmail,
  DetailsBlock,
  DetailText,
  PriceText,
  ActionButton,
  MessageText,
} from "../styles/ReservationDetailsPageStyle";

const ReservationDetailsPage = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReservation = async () => {
      try {
        const data = await apiClient(`/reservations/${reservationId}`);
        setReservation(data);
      } catch (err) {
        setError(ERROR_MESSAGES[err.error] || UI_TEXT.SOMETHING_WENT_WRONG);
      } finally {
        setIsLoading(false);
      }
    };

    loadReservation();
  }, [reservationId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("he-IL");
  };

  if (isLoading) {
    return <MessageText>{UI_TEXT.LOADING_RESERVATIONS}</MessageText>;
  }

  if (error) {
    return <MessageText>{error}</MessageText>;
  }

  if (!reservation) {
    return <MessageText>{UI_TEXT.NO_RESERVATIONS}</MessageText>;
  }

  return (
    <Container>
      <ConfirmationCard>
        <PageTitle>{UI_TEXT.RESERVATION_CONFIRMED}</PageTitle>

        <UserBlock>
          <UserName>
            {reservation.user.firstName} {reservation.user.lastName}
          </UserName>

          <UserEmail>{reservation.user.email}</UserEmail>
        </UserBlock>

        <DetailsBlock>
          <DetailText>
            {UI_TEXT.HOTEL_NAME}: {reservation.hotel.name}
          </DetailText>

          <DetailText>
            {UI_TEXT.ROOM_NAME}: {reservation.room.name}
          </DetailText>

          <DetailText>
            {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
          </DetailText>

          <PriceText>
            {UI_TEXT.TOTAL_PRICE_INCLUDING_VAT}: ₪{reservation.price.toFixed(2)}
          </PriceText>
        </DetailsBlock>

        <ActionButton onClick={() => navigate("/hotels")}>
          {UI_TEXT.BACK_TO_HOTELS}
        </ActionButton>
      </ConfirmationCard>
    </Container>
  );
};

export default ReservationDetailsPage;