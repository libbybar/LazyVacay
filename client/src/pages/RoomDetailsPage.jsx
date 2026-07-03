import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import { formatCurrency } from "../utils/formatCurrency";
import { formatArea } from "../utils/formatArea";
import { UI_TEXT } from "../constants/uiText";
import { ERROR_MESSAGES } from "../constants/errorMessages";

import { BackButton, MessageText, ErrorText, StampCard } from "../styles/SharedUI";

import {
  Container,
  RoomHeroImage,
  RoomTitle,
  HotelName,
  StatsRow,
  StatZoneDivider,
  StatColumn,
  StatLabel,
  StatIcon,
  StatValue,
  AccessibilityBadge,
  AccessibilityIcon,
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

      <StampCard style={{ padding: 0 }}>

        {room.imageUrl && (
          <RoomHeroImage src={room.imageUrl} alt={room.name} />
        )}

        <div style={{ padding: '2rem' }}>
          <RoomTitle>{room.name}</RoomTitle>

          {room.hotel?.name && (
            <HotelName>{room.hotel.name}</HotelName>
          )}

          <StatsRow>
            <StatColumn>
              <StatLabel>{UI_TEXT.ROOM_SIZE}</StatLabel>
              <StatIcon src="/illustrations/icons/room-size.svg" alt="" />
              <StatValue>{formatArea(room.size)}</StatValue>
            </StatColumn>
            <StatZoneDivider>
              <img src="/illustrations/Separators/section-4.svg" alt="" />
            </StatZoneDivider>
            <StatColumn>
              <StatLabel>{UI_TEXT.MAX_CAPACITY}</StatLabel>
              <StatIcon src="/illustrations/icons/guests.svg" alt="" />
              <StatValue>{room.maxGuests}</StatValue>
            </StatColumn>
            <StatZoneDivider>
              <img src="/illustrations/Separators/section-4.svg" alt="" />
            </StatZoneDivider>
            <StatColumn>
              <StatLabel>{UI_TEXT.PRICE_PER_NIGHT}</StatLabel>
              <StatIcon src="/illustrations/icons/price.svg" alt="" />
              <StatValue>{formatCurrency(room.price)}</StatValue>
            </StatColumn>
          </StatsRow>

          {room.isAccessible && (
            <AccessibilityBadge>
              <AccessibilityIcon src="/illustrations/icons/accessibility.svg" alt="" />
              <span>{UI_TEXT.ACCESSIBLE_ROOM}</span>
            </AccessibilityBadge>
          )}

          <Description>
            {room.description || UI_TEXT.NO_DESCRIPTION}
          </Description>

          <ActionButton onClick={() => navigate(`/rooms/${room.id}/booking`)}>
            {UI_TEXT.CONTINUE_BOOKING}
          </ActionButton>
        </div>
      </StampCard>
    </Container>
  );
};

export default RoomDetailsPage;
