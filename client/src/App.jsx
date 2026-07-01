import { Routes, Route, useLocation } from "react-router-dom";
import { PageTransition } from "./styles/SharedUI";
import AuthPage from "./pages/AuthPage";
import HotelsPage from "./pages/HotelsPage";
import HotelDetailsPage from "./pages/HotelDetailsPage";
import RoomDetailsPage from "./pages/RoomDetailsPage";
import BookingPage from "./pages/BookingPage";
import ReservationDetailsPage from "./pages/ReservationDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminHotelsPage from "./pages/admin/AdminHotelsPage";
import AdminRoomsPage from "./pages/admin/AdminRoomsPage";
import AdminReservationsPage from "./pages/admin/AdminReservationsPage";


function App() {
  const location = useLocation();

  return (
    <PageTransition key={location.key}>
    <Routes>
      <Route path="/" element={<AuthPage />} />

      <Route path="/hotels" element={<HotelsPage />} />

      <Route path="/profile" element={<ProfilePage />} />

      <Route path="/admin" element={<AdminDashboardPage />} />

      <Route path="/admin/reservations" element={<AdminReservationsPage />} />

      <Route path="/admin/hotels" element={<AdminHotelsPage />} />

      <Route path="/admin/hotels/:hotelId/rooms" element={<AdminRoomsPage />} />

      <Route path="/hotels/:hotelId" element={<HotelDetailsPage />} />

      <Route path="/rooms/:roomId" element={<RoomDetailsPage />} />

      <Route path="/rooms/:roomId/booking" element={<BookingPage />} />



      <Route
        path="/reservations/:reservationId"
        element={<ReservationDetailsPage />}
      />
    </Routes>
    </PageTransition>
  );
}

export default App;