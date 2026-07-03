import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UI_TEXT } from "../constants/uiText";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { apiClient } from "../api/apiClient";
import { formatCurrency } from "../utils/formatCurrency";
import { formatArea } from "../utils/formatArea";
import {
  Container,
  PageTitle,
  InputGroup,
  SecondaryButton,
  Label,
  Input,
  ActionButton,
  MessageText,
  ErrorText,
  AtlasCard,
  TopBar,
  LocationIcon,
  StarRating,
} from "../styles/SharedUI";

import {
  SearchCard,
  SearchTitle,
  SearchSubtitle,
  SearchForm,
  HotelsGrid,
  HotelRow,
  HotelRowImage,
  HotelRowText,
  HotelRowActions,
  HotelRowDivider,
  RoomDetail,
  HeroSection,
  MainHeadline,
  SubHeadline,
  BrandSection,
  CompassImg,
  BrandName,
} from "../styles/HotelsPageStyle";

const HotelsPage = () => {
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);

  const [searchData, setSearchData] = useState({
    startDate: "",
    endDate: "",
  });

  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [isLoadingHotels, setIsLoadingHotels] = useState(true);
  const [isSearchingRooms, setIsSearchingRooms] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const data = await apiClient("/hotels");
        setHotels(data);
      } catch (err) {
        setError(
          ERROR_MESSAGES[err.error] || ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        );
        console.error("Hotel loading failed:", err);
      } finally {
        setIsLoadingHotels(false);
      }
    };

    loadHotels();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSearchChange = (e) => {
    const { id, value } = e.target;
    setSearchData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    setError("");
  };

  const handleAvailableRoomsSearch = async (e) => {
    e.preventDefault();

    if (!searchData.startDate || !searchData.endDate) {
      setError(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
      return;
    }

    if (searchData.startDate < today || searchData.endDate < today) {
      setError(ERROR_MESSAGES.PAST_BOOKING_DATE);
      return;
    }

    if (searchData.endDate <= searchData.startDate) {
      setError(ERROR_MESSAGES.END_DATE_BEFORE_START_DATE);
      return;
    }

    try {
      setIsSearchingRooms(true);
      setError("");

      const data = await apiClient(
        `/hotels/available_rooms?start_date=${searchData.startDate}&end_date=${searchData.endDate}`
      );

      setAvailableRooms(data);
      setHasSearched(true);
    } catch (err) {
      setError(ERROR_MESSAGES[err.error] || UI_TEXT.SOMETHING_WENT_WRONG);
    } finally {
      setIsSearchingRooms(false);
    }
  };

  const clearSearch = () => {
    setSearchData({
      startDate: "",
      endDate: "",
    });
    setAvailableRooms([]);
    setHasSearched(false);
    setError("");
  };

  if (isLoadingHotels) {
    return (
      <Container>
        <PageTitle>{UI_TEXT.LOADING_HOTELS}</PageTitle>
      </Container>
    );
  }

  return (
    <Container>
      <TopBar>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <SecondaryButton type="button" onClick={() => navigate("/profile")}>
            {UI_TEXT.PROFILE_TITLE}
          </SecondaryButton>

          <SecondaryButton type="button" onClick={handleLogout}>
            {UI_TEXT.LOGOUT}
          </SecondaryButton>
        </div>

        <BrandSection>
          <CompassImg src="/illustrations/icons/compass.svg" alt={UI_TEXT.SITE_NAME} />
          <BrandName>{UI_TEXT.SITE_NAME}</BrandName>
        </BrandSection>
      </TopBar>
      <HeroSection>
        <MainHeadline>{UI_TEXT.HOME_HEADLINE}</MainHeadline>
        <SubHeadline>{UI_TEXT.HOME_SUBTITLE}</SubHeadline>
      </HeroSection>

      <SearchCard>
        <SearchTitle>{UI_TEXT.AVAILABLE_ROOMS_SEARCH_TITLE}</SearchTitle>
        <SearchSubtitle>{UI_TEXT.AVAILABLE_ROOMS_SEARCH_SUBTITLE}</SearchSubtitle>

        <SearchForm onSubmit={handleAvailableRoomsSearch}>
          <InputGroup>
            <Label htmlFor="startDate">{UI_TEXT.CHECK_IN_LABEL}</Label>
            <Input
              type="date"
              id="startDate"
              min={today}
              value={searchData.startDate}
              onChange={handleSearchChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="endDate">{UI_TEXT.CHECK_OUT_LABEL}</Label>
            <Input
              type="date"
              id="endDate"
              min={searchData.startDate || today}
              value={searchData.endDate}
              onChange={handleSearchChange}
              required
            />
          </InputGroup>

          <ActionButton type="submit" disabled={isSearchingRooms}>
            {isSearchingRooms ? UI_TEXT.LOADING : UI_TEXT.SEARCH_AVAILABLE_ROOMS}
          </ActionButton>

          {hasSearched && (
            <SecondaryButton type="button" onClick={clearSearch}>
              {UI_TEXT.CLEAR_SEARCH}
            </SecondaryButton>
          )}
        </SearchForm>
      </SearchCard>

      {error && <ErrorText>{error}</ErrorText>}

      {hasSearched ? (
        <>
          <PageTitle>{UI_TEXT.AVAILABLE_ROOMS_RESULTS}</PageTitle>

          {availableRooms.length === 0 ? (
            <MessageText>{UI_TEXT.NO_AVAILABLE_ROOMS}</MessageText>
          ) : (
            <HotelsGrid>
              {availableRooms.map((room) => (
                <AtlasCard key={room.id}>
                  {room.imageUrl && (
                    <img src={room.imageUrl} alt={room.name} />
                  )}
                  <div>
                    <h2>{room.hotel?.name} - {room.name}</h2>
                    <RoomDetail>{UI_TEXT.ROOM_SIZE}: {formatArea(room.size)}</RoomDetail>
                    <RoomDetail>{UI_TEXT.MAX_CAPACITY}: {room.maxGuests}</RoomDetail>
                    <RoomDetail>{UI_TEXT.PRICE_PER_NIGHT}: {formatCurrency(room.price)}</RoomDetail>
                  </div>
                  <ActionButton onClick={() => navigate(`/rooms/${room.id}`)}>
                    {UI_TEXT.SELECT_ROOM}
                  </ActionButton>
                </AtlasCard>
              ))}
            </HotelsGrid>
          )}
        </>
      ) : (
        <>
          {!error && hotels.length === 0 && (
            <MessageText>{UI_TEXT.NO_HOTELS_FOUND}</MessageText>
          )}

          <PageTitle>{UI_TEXT.HOTELS}</PageTitle>

          <HotelsGrid>
            {hotels.map((hotel, index) => (
              <React.Fragment key={hotel.id}>
                {index > 0 && (
                  <HotelRowDivider src="/illustrations/Separators/room-5.svg" alt="" />
                )}
                <HotelRow>
                  {hotel.imageUrl && (
                    <HotelRowImage src={hotel.imageUrl} alt={hotel.name} />
                  )}
                  <HotelRowText>
                    <h2>{hotel.name}</h2>
                    <RoomDetail><StarRating>{"★".repeat(hotel.stars)}{"☆".repeat(5 - hotel.stars)}</StarRating></RoomDetail>
                    <RoomDetail><LocationIcon src="/illustrations/icons/location.svg" alt="" />{hotel.city}, {hotel.country}</RoomDetail>
                    <RoomDetail>{hotel.description || UI_TEXT.NO_DESCRIPTION}</RoomDetail>
                  </HotelRowText>
                  <HotelRowActions>
                    <ActionButton onClick={() => navigate(`/hotels/${hotel.id}`)}>
                      {UI_TEXT.VIEW_ROOMS}
                    </ActionButton>
                  </HotelRowActions>
                </HotelRow>
              </React.Fragment>
            ))}
          </HotelsGrid>
        </>
      )}
    </Container>
  );
};

export default HotelsPage;