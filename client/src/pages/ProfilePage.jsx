import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";
import { hasReservationEnded } from "../utils/reservationDates";
import { UI_TEXT } from "../constants/uiText";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { useNavigate } from "react-router-dom";
import { BackButton, Container, PageTitle, MessageText, ErrorText, SectionTitle, TableCard, ActionButton, SecondaryButton, InputGroup, Label, Input } from "../styles/SharedUI";

import {
    ProfileCard,
    DetailsGrid,
    DetailText,
    ReservationsTable,
    BackLink,
    ProfileFormActions,
} from "../styles/ProfilePageStyle";

function ProfilePage() {
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorCode, setErrorCode] = useState("");

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "", email: "", phoneNumber: "" });
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [profileError, setProfileError] = useState("");
    const [profileSuccess, setProfileSuccess] = useState("");

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
                <ErrorText>
                    {ERROR_MESSAGES[errorCode] || UI_TEXT.SOMETHING_WENT_WRONG}
                </ErrorText>

                <BackLink as={Link} to="/hotels">
                    {UI_TEXT.BACK_TO_HOTELS}
                </BackLink>
            </Container>
        );
    }

    const { user, reservations } = profileData;

    const futureReservations = reservations.filter(
        (reservation) => !hasReservationEnded(reservation.endDate)
    );

    const pastReservations = reservations.filter((reservation) =>
        hasReservationEnded(reservation.endDate)
    );


    const handleOpenEdit = () => {
        setProfileForm({
            firstName: user.firstName,
            lastName: user.lastName || "",
            email: user.email,
            phoneNumber: user.phoneNumber || "",
        });
        setIsEditingProfile(true);
        setProfileError("");
        setProfileSuccess("");
    };

    const handleCancelEdit = () => {
        setIsEditingProfile(false);
        setProfileError("");
    };

    const handleProfileFormChange = (e) => {
        const { name, value } = e.target;
        setProfileForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            setIsSavingProfile(true);
            setProfileError("");
            const result = await apiClient("/auth/profile", {
                method: "PATCH",
                body: JSON.stringify(profileForm),
            });
            setProfileData((prev) => ({ ...prev, user: result.user }));
            setIsEditingProfile(false);
            setProfileSuccess(UI_TEXT.CHANGES_SAVED);
        } catch (err) {
            setProfileError(ERROR_MESSAGES[err.error] || UI_TEXT.SOMETHING_WENT_WRONG);
        } finally {
            setIsSavingProfile(false);
        }
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
                            <td>{formatCurrency(reservation.price)}</td>
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

                {isEditingProfile ? (
                    <form onSubmit={handleSaveProfile}>
                        <InputGroup>
                            <Label htmlFor="firstName">{UI_TEXT.FIRST_NAME_LABEL}</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={profileForm.firstName}
                                onChange={handleProfileFormChange}
                                required
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label htmlFor="lastName">{UI_TEXT.LAST_NAME_LABEL}</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={profileForm.lastName}
                                onChange={handleProfileFormChange}
                                required
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label htmlFor="email">{UI_TEXT.EMAIL_LABEL}</Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                value={profileForm.email}
                                onChange={handleProfileFormChange}
                                required
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label htmlFor="phoneNumber">{UI_TEXT.PHONE_NUMBER_LABEL}</Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                value={profileForm.phoneNumber}
                                onChange={handleProfileFormChange}
                            />
                        </InputGroup>

                        {profileError && <ErrorText>{profileError}</ErrorText>}

                        <ProfileFormActions>
                            <SecondaryButton type="button" onClick={handleCancelEdit} disabled={isSavingProfile}>
                                {UI_TEXT.CANCEL}
                            </SecondaryButton>
                            <ActionButton type="submit" disabled={isSavingProfile}>
                                {isSavingProfile ? UI_TEXT.LOADING : UI_TEXT.SAVE}
                            </ActionButton>
                        </ProfileFormActions>
                    </form>
                ) : (
                    <>
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

                        {profileSuccess && <MessageText>{profileSuccess}</MessageText>}

                        <ActionButton type="button" onClick={handleOpenEdit} style={{ marginTop: "1.5rem" }}>
                            {UI_TEXT.EDIT_PROFILE}
                        </ActionButton>
                    </>
                )}
            </ProfileCard>

            <TableCard>
                <SectionTitle>{UI_TEXT.FUTURE_RESERVATIONS}</SectionTitle>
                {renderReservationsTable(
                    futureReservations,
                    UI_TEXT.NO_FUTURE_RESERVATIONS
                )}
            </TableCard>

            <TableCard>
                <SectionTitle>{UI_TEXT.PAST_RESERVATIONS}</SectionTitle>
                {renderReservationsTable(
                    pastReservations,
                    UI_TEXT.NO_PAST_RESERVATIONS
                )}
            </TableCard>
        </Container>
    );
}

export default ProfilePage;