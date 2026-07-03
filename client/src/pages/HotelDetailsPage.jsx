import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import { formatCurrency } from "../utils/formatCurrency";
import { formatArea } from "../utils/formatArea";
import { UI_TEXT } from "../constants/uiText";
import { ERROR_MESSAGES } from "../constants/errorMessages";


import {
  Container,
  BackButton,
  ActionButton,
  MessageText,
  ErrorText,
  SectionTitle,
} from "../styles/SharedUI";

import {
  HotelHeader,
  HotelHeroImage,
  HeroOverlay,
  HeroContent,
  HeroCaption,
  HotelTitle,
  HotelLocation,
  StarsText,
  Description,
  RoomsGrid,
  RoomRowDivider,
  RoomRow,
  RoomRowImage,
  RoomZoneDivider,
  RoomRowText,
  RoomRowStats,
  RoomStatColumn,
  RoomStatLabel,
  RoomStatIcon,
  RoomStatValue,
  RoomRowActions,
  RoomAccessibilityIcon,
  RoomTitle,
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

      <HotelHeader>
        {hotel.imageUrl ? (
          <>
            <HotelHeroImage src={hotel.imageUrl} alt={hotel.name} />
            <HeroOverlay />
          </>
        ) : (
          <HeroContent>
            <HotelTitle>{hotel.name}</HotelTitle>
            <HotelLocation>{hotel.city}, {hotel.country}</HotelLocation>
            <StarsText>{"★".repeat(hotel.stars)}{"☆".repeat(5 - hotel.stars)}</StarsText>
          </HeroContent>
        )}
      </HotelHeader>

      {hotel.imageUrl ? (
        <HeroCaption>
          <HotelTitle>{hotel.name}</HotelTitle>
          <HotelLocation>{hotel.city}, {hotel.country}</HotelLocation>
          <StarsText>{"★".repeat(hotel.stars)}{"☆".repeat(5 - hotel.stars)}</StarsText>
          <Description>{hotel.description || UI_TEXT.NO_DESCRIPTION}</Description>
        </HeroCaption>
      ) : (
        <Description>{hotel.description || UI_TEXT.NO_DESCRIPTION}</Description>
      )}

      <SectionTitle>{UI_TEXT.VIEW_ROOMS}</SectionTitle>

      {hotel.rooms.length === 0 ? (
        <MessageText>{UI_TEXT.NO_ROOMS_IN_HOTEL}</MessageText>
      ) : (
        <RoomsGrid>
          {hotel.rooms.map((room, index) => (
            <React.Fragment key={room.id}>
              {index > 0 && (
                <RoomRowDivider
                  src="/illustrations/Separators/room-4.svg"
                  alt=""
                />
              )}
              <RoomRow>
                {room.imageUrl && (
                  <RoomRowImage src={room.imageUrl} alt={room.name} />
                )}
                <RoomRowText>
                  <RoomTitle>{room.name}</RoomTitle>
                  <Description>{room.description || UI_TEXT.NO_DESCRIPTION}</Description>
                </RoomRowText>
                <RoomZoneDivider $rotate={90}>
                  <img src="/illustrations/Separators/section-3.svg" alt="" />
                </RoomZoneDivider>
                <RoomRowStats>
                  <RoomStatColumn>
                    <RoomStatLabel>{UI_TEXT.ROOM_SIZE}</RoomStatLabel>
                    <RoomStatIcon src="/illustrations/icons/room-size.svg" alt="" />
                    <RoomStatValue>{formatArea(room.size)}</RoomStatValue>
                  </RoomStatColumn>
                  <RoomStatColumn>
                    <RoomStatLabel>{UI_TEXT.MAX_CAPACITY}</RoomStatLabel>
                    <RoomStatIcon src="/illustrations/icons/guests.svg" alt="" />
                    <RoomStatValue>{room.maxGuests}</RoomStatValue>
                  </RoomStatColumn>
                  <RoomStatColumn>
                    <RoomStatLabel>{UI_TEXT.PRICE_PER_NIGHT}</RoomStatLabel>
                    <RoomStatIcon src="/illustrations/icons/price.svg" alt="" />
                    <RoomStatValue>{formatCurrency(room.price)}</RoomStatValue>
                  </RoomStatColumn>
                </RoomRowStats>
                <RoomZoneDivider $rotate={270}>
                  <img src="/illustrations/Separators/section-3.svg" alt="" />
                </RoomZoneDivider>
                <RoomRowActions>
                  {room.isAccessible && (
                    <RoomAccessibilityIcon
                      src="/illustrations/icons/accessibility.svg"
                      alt={UI_TEXT.ACCESSIBLE_ROOM}
                    />
                  )}
                  <ActionButton onClick={() => navigate(`/rooms/${room.id}`)}>
                    {UI_TEXT.SELECT_ROOM}
                  </ActionButton>
                </RoomRowActions>
              </RoomRow>
            </React.Fragment>
          ))}
        </RoomsGrid>
      )}
    </Container>
  );
};

export default HotelDetailsPage;