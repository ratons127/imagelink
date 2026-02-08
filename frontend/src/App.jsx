import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "./features/authSlice.js";
import { getTokens } from "./app/api.js";
import AuthLayout from "./components/AuthLayout.jsx";
import AppLayout from "./components/AppLayout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MyDay from "./pages/MyDay.jsx";
import Kanban from "./pages/Kanban.jsx";
import Settings from "./pages/Settings.jsx";
import Planned from "./pages/Planned.jsx";
import Important from "./pages/Important.jsx";
import Completed from "./pages/Completed.jsx";

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((s) => s.auth);
  const tokens = getTokens();
  if (!user && !tokens.accessToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const theme = useSelector((s) => s.ui.theme);

  useEffect(() => {
    if (getTokens().accessToken) dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/my-day" element={<MyDay />} />
        <Route path="/planned" element={<Planned />} />
        <Route path="/important" element={<Important />} />
        <Route path="/completed" element={<Completed />} />
        <Route path="/kanban" element={<Kanban />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default App;
