import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import { formatCurrency } from "../utils/formatCurrency";
import { UI_TEXT } from "../constants/uiText";
import { ERROR_MESSAGES } from "../constants/errorMessages";


import {
  Container,
  BackButton,
  ActionButton,
  MessageText,
  ErrorText,
  AtlasCard,
  SectionTitle,
} from "../styles/SharedUI";

import {
  HotelHeader,
  HotelTitle,
  HotelLocation,
  StarsText,
  Description,
  RoomsGrid,
  RoomTitle,
  RoomDetail,
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
    return (
      <Container>
        <MessageText>{UI_TEXT.LOADING}</MessageText>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorText>{error}</ErrorText>
      </Container>
    );
  }

  if (!hotel) {
    return (
      <Container>
        <MessageText>{UI_TEXT.NO_RESULTS}</MessageText>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton onClick={() => navigate("/hotels")}>
        {UI_TEXT.BACK}
      </BackButton>

      <HotelHeader style={{ padding: 0, overflow: 'hidden' }}>
        {hotel.imageUrl && (
          <img 
            src={hotel.imageUrl} 
            alt={hotel.name} 
            style={{
              width: '100%',
              maxHeight: '350px',       
              aspectRatio: '21 / 9',   
              objectFit: 'cover',       
              borderBottom: '1px solid #D1C7BD', 
              display: 'block'
            }}
          />
        )}

        <div style={{ padding: '2rem' }}>
          <HotelTitle>{hotel.name}</HotelTitle>
          <HotelLocation>
            {hotel.city}, {hotel.country}
          </HotelLocation>
          <StarsText>{"⭐".repeat(hotel.stars)}</StarsText>
          <Description>
            {hotel.description || UI_TEXT.NO_DESCRIPTION}
          </Description>
        </div>
      </HotelHeader>

      <SectionTitle>{UI_TEXT.VIEW_ROOMS}</SectionTitle>

      {hotel.rooms.length === 0 ? (
        <MessageText>{UI_TEXT.NO_ROOMS_IN_HOTEL}</MessageText>
      ) : (
        <RoomsGrid>
          {hotel.rooms.map((room) => (
            <AtlasCard key={room.id}>
              
              {room.imageUrl && (
                <img src={room.imageUrl} alt={room.name} />
              )}

              <div>
                <RoomTitle>{room.name}</RoomTitle>

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
              </div>

              <ActionButton onClick={() => navigate(`/rooms/${room.id}`)}>
                {UI_TEXT.SELECT_ROOM}
              </ActionButton>

            </AtlasCard>
          ))}
        </RoomsGrid>
      )}
    </Container>
  );
};

export default HotelDetailsPage;