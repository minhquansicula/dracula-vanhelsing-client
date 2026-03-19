import { Routes, Route } from "react-router-dom";
import { ROUTES } from "../constants/routes";

// Pages
import LandingPage from "../pages/Home/LandingPage";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Lobby from "../pages/Lobby/Lobby";
import GameRoom from "../pages/Game/GameRoom";
import NotFound from "../pages/Errors/NotFound";

// Route Guards
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const AppRouter = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<LandingPage />} />

      {/* Lobby bây giờ là Public - ai cũng xem được */}
      <Route path={ROUTES.LOBBY} element={<Lobby />} />

      <Route element={<PublicRoute />}>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
      </Route>

      {/* Chỉ khi vào phòng chơi thực sự mới bắt đăng nhập */}
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.GAME_ROOM} element={<GameRoom />} />
      </Route>

      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
