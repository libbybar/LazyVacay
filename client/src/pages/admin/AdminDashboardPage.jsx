import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { apiClient } from "../../api/apiClient";
import { UI_TEXT } from "../../constants/uiText";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

import {
  Container,
  BackButton,
  PageTitle,
  DashboardGrid,
  DashboardCard,
  CardTitle,
  CardText,
  ActionButton,
  MessageText,
} from "../../styles/AdminDashboardPageStyle";

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  const [isAllowed, setIsAllowed] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const data = await apiClient("/auth/profile");

        if (data.user.role === "ADMIN") {
          setIsAllowed(true);
        } else {
          setError(ERROR_MESSAGES.UNAUTHORIZED_ADMIN_ONLY);
        }
      } catch (err) {
        setError(ERROR_MESSAGES[err.error] || UI_TEXT.SOMETHING_WENT_WRONG);
      } finally {
        setIsCheckingAccess(false);
      }
    };

    if (token) {
      checkAdminAccess();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (isCheckingAccess) {
    return (
      <Container>
        <MessageText>{UI_TEXT.LOADING}</MessageText>
      </Container>
    );
  }

  if (!isAllowed) {
    return (
      <Container>
        <MessageText>{error}</MessageText>

        <ActionButton type="button" onClick={() => navigate("/hotels")}>
          {UI_TEXT.BACK_TO_HOTELS}
        </ActionButton>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton type="button" onClick={handleLogout}>
        {UI_TEXT.LOGOUT}
      </BackButton>

      <PageTitle>{UI_TEXT.ADMIN_DASHBOARD_TITLE}</PageTitle>

      <DashboardGrid>
        <DashboardCard>
          <div>
            <CardTitle>{UI_TEXT.ADMIN_RESERVATIONS_TITLE}</CardTitle>
            <CardText>{UI_TEXT.ADMIN_RESERVATIONS_DESCRIPTION}</CardText>
          </div>

          <ActionButton
            type="button"
            onClick={() => navigate("/admin/reservations")}
          >
            {UI_TEXT.ADMIN_ENTER_MANAGEMENT}
          </ActionButton>
        </DashboardCard>

        <DashboardCard>
          <div>
            <CardTitle>{UI_TEXT.ADMIN_HOTELS_TITLE}</CardTitle>
            <CardText>{UI_TEXT.ADMIN_HOTELS_DESCRIPTION}</CardText>
          </div>

          <ActionButton type="button" onClick={() => navigate("/admin/hotels")}>
            {UI_TEXT.ADMIN_ENTER_MANAGEMENT}
          </ActionButton>
        </DashboardCard>
      </DashboardGrid>
    </Container>
  );
};

export default AdminDashboardPage;