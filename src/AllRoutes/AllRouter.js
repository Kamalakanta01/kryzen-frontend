import { Routes, Route, Navigate } from "react-router-dom";
import KanbanBoard from "../pages/kanban";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";

export default function AllRouter() {
  let token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/dashboard"
        element={token ? <KanbanBoard /> : <Navigate to="/login" />}
      />
      <Route
        path="/login"
        element={token ? <Navigate to="/dashboard" />: <Login />}
      />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}