import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import { UI_TEXT } from "../constants/uiText";
import { ERROR_MESSAGES } from "../constants/errorMessages";

import {
  Container,
  BackButton,
  RoomCard,
  RoomTitle,
  HotelName,
  RoomDetail,
  Description,
  ActionButton,
  MessageText,
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
    return <MessageText>{error}</MessageText>;
  }

  if (!room) {
    return <MessageText>{UI_TEXT.ROOM_NOT_FOUND}</MessageText>;
  }

  return (
    <Container>
      <BackButton onClick={() => navigate(`/hotels/${room.hotelId}`)}>
        {UI_TEXT.BACK}
      </BackButton>

      <RoomCard>
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
          {UI_TEXT.PRICE_PER_NIGHT}: ₪{room.price}
        </RoomDetail>

        <Description>
          {room.description || UI_TEXT.NO_DESCRIPTION}
        </Description>

       
        <ActionButton onClick={() => navigate(`/rooms/${room.id}/booking`)}>
          {UI_TEXT.CONTINUE_BOOKING}
        </ActionButton>
      </RoomCard>
    </Container>
  );
};

export default RoomDetailsPage;