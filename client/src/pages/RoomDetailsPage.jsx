import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import { formatCurrency } from "../utils/formatCurrency";
import { UI_TEXT } from "../constants/uiText";
import { ERROR_MESSAGES } from "../constants/errorMessages";

import { BackButton, MessageText, ErrorText, DetailCard } from "../styles/SharedUI";

import {
  Container,
  RoomTitle,
  HotelName,
  RoomDetail,
  Description,
  ActionButton,
} from "../styles/RoomDetailsPageStyle";

const RoomDetailsPage = () => {

  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRoomDetails = async () => {
      try {
        const data = await apiClient(`/hotels/rooms/${roomId}`);
        setRoom(data);
      } catch (err) {
        setError(
          ERROR_MESSAGES[err.error] || UI_TEXT.SOMETHING_WENT_WRONG
        );

        console.error("Room loading failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRoomDetails();
  }, [roomId]);


  if (isLoading) {
    return <MessageText>{UI_TEXT.LOADING_ROOMS}</MessageText>;
  }

  if (error) {
    return <ErrorText>{error}</ErrorText>;
  }

  if (!room) {
    return <MessageText>{UI_TEXT.ROOM_NOT_FOUND}</MessageText>;
  }

  return (
    <Container>
      <BackButton onClick={() => navigate(`/hotels/${room.hotelId}`)}>
        {UI_TEXT.BACK}
      </BackButton>

      <DetailCard style={{ padding: 0, overflow: 'hidden' }}>

        {room.imageUrl && (
          <img
            src={room.imageUrl}
            alt={room.name}
            style={{
              width: '100%',
              maxHeight: '300px',
              aspectRatio: '21 / 9',
              objectFit: 'cover',
              borderBottom: '1px solid #D1C7BD',
              display: 'block'
            }}
          />
        )}

        <div style={{ padding: '2rem' }}>
          <RoomTitle>{room.name}</RoomTitle>

          {room.hotel?.name && (
            <HotelName>{room.hotel.name}</HotelName>
          )}

          <RoomDetail>
            {UI_TEXT.ROOM_SIZE}: {room.size} מ״ר
          </RoomDetail>

          <RoomDetail>
            {UI_TEXT.MAX_CAPACITY}: {room.maxGuests}
          </RoomDetail>

          <RoomDetail>
            {UI_TEXT.PRICE_PER_NIGHT}: {formatCurrency(room.price)}
          </RoomDetail>

          <Description>
            {room.description || UI_TEXT.NO_DESCRIPTION}
          </Description>

          <ActionButton onClick={() => navigate(`/rooms/${room.id}/booking`)}>
            {UI_TEXT.CONTINUE_BOOKING}
          </ActionButton>
        </div>
      </DetailCard>
    </Container>
  );
};

export default RoomDetailsPage;