import React, { useState } from "react";
import HomePage from "./Routes/Homepage/homePage";
import MessPage from "./Routes/MessManagerPage/messPage";
import StudentPage from "./Routes/StudentPage/studentPage";
import SuperAdminPage from "./Routes/StudentPage/studentPage";
import { useAuth } from "./context/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./Routes/Login/Login";
import Signup from "./Routes/Signup/signup";
import "./App.scss";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Ann from "./Routes/Ann/ann.jsx";
import Stats from "./Routes/Stats/Stats.jsx";
function App() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="App">
        <div className="loadingscreen">
          <img src="/assets/logo.png" alt="efw" />
          Loading....
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to={`/${user.role}`} />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to={`/${user.role}`} />}
        />
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mess_manager"
          element={
            <ProtectedRoute allowedRoles={["mess_manager", "super_admin"]}>
              <MessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mess_manager/ann"
          element={
            <ProtectedRoute allowedRoles={["mess_manager", "super_admin"]}>
              <Ann />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mess_manager/stats"
          element={
            <ProtectedRoute allowedRoles={["mess_manager", "super_admin"]}>
              <Stats />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
