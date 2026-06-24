import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import HotelsPage from "./pages/HotelsPage";
import HotelDetailsPage from "./pages/HotelDetailsPage";
import RoomDetailsPage from "./pages/RoomDetailsPage";
import BookingPage from "./pages/BookingPage";
import ReservationDetailsPage from "./pages/ReservationDetailsPage";
import ProfilePage from "./pages/ProfilePage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />

      <Route path="/hotels" element={<HotelsPage />} />

      <Route path="/profile" element={<ProfilePage />} />

      <Route path="/hotels/:hotelId" element={<HotelDetailsPage />} />

      <Route path="/rooms/:roomId" element={<RoomDetailsPage />} />

      <Route path="/rooms/:roomId/booking" element={<BookingPage />} />

      <Route
        path="/reservations/:reservationId"
        element={<ReservationDetailsPage />}
      />
    </Routes>
  );
}

export default App;