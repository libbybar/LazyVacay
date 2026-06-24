import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import { UI_TEXT } from "../constants/uiText";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import {
  Container,
  BackButton,
  HotelHeader,
  HotelTitle,
  HotelLocation,
  StarsText,
  Description,
  SectionTitle,
  RoomsGrid,
  RoomCard,
  RoomTitle,
  RoomDetail,
  ActionButton,
  MessageText,
} from "../styles/HotelDetailsPageStyle";

const HotelDetailsPage = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHotelDetails = async () => {
      try {
        const data = await apiClient(`/hotels/${hotelId}`);
        setHotel(data);
      } catch (err) {
        setError(ERROR_MESSAGES[err.error] || UI_TEXT.SOMETHING_WENT_WRONG);
      } finally {
        setIsLoading(false);
      }
    };

    loadHotelDetails();
  }, [hotelId]);

  if (isLoading) {
    return <MessageText>{UI_TEXT.LOADING_HOTEL_DETAILS}</MessageText>;
  }

  if (error) {
    return <MessageText>{error}</MessageText>;
  }

  if (!hotel) {
    return <MessageText>{UI_TEXT.HOTEL_NOT_FOUND}</MessageText>;
  }

  return (
    <Container>
      <BackButton onClick={() => navigate("/hotels")}>
        {UI_TEXT.BACK}
      </BackButton>

      <HotelHeader>
        <HotelTitle>{hotel.name}</HotelTitle>

        <HotelLocation>
          {hotel.city}, {hotel.country}
        </HotelLocation>

        <StarsText>{"⭐".repeat(hotel.stars)}</StarsText>

        <Description>
          {hotel.description || UI_TEXT.NO_DESCRIPTION}
        </Description>
      </HotelHeader>

      <SectionTitle>{UI_TEXT.VIEW_ROOMS}</SectionTitle>

      {hotel.rooms.length === 0 ? (
        <MessageText>{UI_TEXT.NO_ROOMS_IN_HOTEL}</MessageText>
      ) : (
        <RoomsGrid>
          {hotel.rooms.map((room) => (
            <RoomCard key={room.id}>
              <div>
                <RoomTitle>{room.name}</RoomTitle>

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
              </div>

              <ActionButton onClick={() => navigate(`/rooms/${room.id}`)}>
                {UI_TEXT.SELECT_ROOM}
              </ActionButton>
            </RoomCard>
          ))}
        </RoomsGrid>
      )}
    </Container>
  );
};

export default HotelDetailsPage;