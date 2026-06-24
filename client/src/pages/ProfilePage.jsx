import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import { UI_TEXT } from "../constants/uiText";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { useNavigate } from "react-router-dom";
import {
    Container,
    PageTitle,
    ProfileCard,
    SectionTitle,
    DetailsGrid,
    DetailText,
    ReservationsSection,
    ReservationsTable,
    MessageText,
    BackLink,
    BackButton,
} from "../styles/ProfilePageStyle";

function ProfilePage() {
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorCode, setErrorCode] = useState("");

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await apiClient("/auth/profile");
                setProfileData(data);
            } catch (error) {
                setErrorCode(error.error || "INTERNAL_SERVER_ERROR");
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            fetchProfile();
        }
    }, [token]);

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (isLoading) {
        return <MessageText>{UI_TEXT.LOADING_PROFILE}</MessageText>;
    }

    if (errorCode) {
        return (
            <Container>
                <MessageText>
                    {ERROR_MESSAGES[errorCode] || UI_TEXT.SOMETHING_WENT_WRONG}
                </MessageText>

                <BackLink as={Link} to="/hotels">
                    {UI_TEXT.BACK_TO_HOTELS}
                </BackLink>
            </Container>
        );
    }

    const { user, reservations } = profileData;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureReservations = reservations.filter((reservation) => {
        const endDate = new Date(reservation.endDate);
        endDate.setHours(0, 0, 0, 0);

        return endDate >= today;
    });

    const pastReservations = reservations.filter((reservation) => {
        const endDate = new Date(reservation.endDate);
        endDate.setHours(0, 0, 0, 0);

        return endDate < today;
    });

    const formatDate = (dateValue) => {
        return new Date(dateValue).toLocaleDateString("he-IL");
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("he-IL", {
            style: "currency",
            currency: "ILS",
        }).format(price);
    };

    const renderReservationsTable = (reservationList, emptyMessage) => {
        if (reservationList.length === 0) {
            return <MessageText>{emptyMessage}</MessageText>;
        }

        return (
            <ReservationsTable>
                <thead>
                    <tr>
                        <th>{UI_TEXT.HOTEL_NAME}</th>
                        <th>{UI_TEXT.ROOM_NAME}</th>
                        <th>{UI_TEXT.CHECK_IN_LABEL}</th>
                        <th>{UI_TEXT.CHECK_OUT_LABEL}</th>
                        <th>{UI_TEXT.TOTAL_PRICE_INCLUDING_VAT}</th>
                    </tr>
                </thead>

                <tbody>
                    {reservationList.map((reservation) => (
                        <tr key={reservation.id}>
                            <td>
                                <Link to={`/hotels/${reservation.hotel.id}`}>
                                    {reservation.hotel.name}
                                </Link>
                            </td>

                            <td>
                                <Link to={`/rooms/${reservation.room.id}`}>
                                    {reservation.room.name}
                                </Link>
                            </td>

                            <td>{formatDate(reservation.startDate)}</td>
                            <td>{formatDate(reservation.endDate)}</td>
                            <td>{formatPrice(reservation.price)}</td>
                        </tr>
                    ))}
                </tbody>
            </ReservationsTable>
        );
    };

    return (
        <Container>
            <BackButton onClick={() => navigate("/hotels")}>
                {UI_TEXT.BACK}
            </BackButton>
            <PageTitle>{UI_TEXT.PROFILE_TITLE}</PageTitle>

            <ProfileCard>
                <SectionTitle>{UI_TEXT.PERSONAL_DETAILS}</SectionTitle>

                <DetailsGrid>
                    <DetailText>
                        <strong>{UI_TEXT.FIRST_NAME_LABEL}: </strong>
                        {user.firstName}
                    </DetailText>

                    <DetailText>
                        <strong>{UI_TEXT.LAST_NAME_LABEL}: </strong>
                        {user.lastName}
                    </DetailText>

                    <DetailText>
                        <strong>{UI_TEXT.EMAIL_LABEL}: </strong>
                        {user.email}
                    </DetailText>

                    <DetailText>
                        <strong>{UI_TEXT.PHONE_NUMBER_LABEL}: </strong>
                        {user.phoneNumber || UI_TEXT.NO_PHONE_NUMBER}
                    </DetailText>
                </DetailsGrid>
            </ProfileCard>

            <ReservationsSection>
                <SectionTitle>{UI_TEXT.FUTURE_RESERVATIONS}</SectionTitle>
                {renderReservationsTable(
                    futureReservations,
                    UI_TEXT.NO_FUTURE_RESERVATIONS
                )}
            </ReservationsSection>

            <ReservationsSection>
                <SectionTitle>{UI_TEXT.PAST_RESERVATIONS}</SectionTitle>
                {renderReservationsTable(
                    pastReservations,
                    UI_TEXT.NO_PAST_RESERVATIONS
                )}
            </ReservationsSection>
        </Container>
    );
}

export default ProfilePage;