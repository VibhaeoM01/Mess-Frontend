// import React, { useState } from "react";
import HomePage from "./Routes/Homepage/homePage";
import MessPage from "./Routes/MessManagerPage/messPage";
import StudentPage from "./Routes/StudentPage/studentPage";
import SuperAdminPage from "./Routes/StudentPage/studentPage";
import { useAuth } from "./context/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./Routes/Login/Login";
import Signup from "./Routes/Signup/signup";
import StudentLogin from "./Routes/StudentLogin/StudentLogin";
import GetMessId from "./Routes/GetMessId/GetMessId";
import "./App.scss";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Ann from "./Routes/Ann/ann.jsx";
import Stats from "./Routes/Stats/Stats.jsx";
import Footer from "./components/Footer/Footer.jsx";
import FreeTrial from "./Routes/FreeTrial/FreeTrial.jsx";
import { ToastProvider } from "./context/ToastContext";
import { MessProvider } from "./context/MessContext";
import StripeSuccess from "./components/StripeSuccess/StripeSuccess.jsx";
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
    <MessProvider>
      <ToastProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to={`/${user.role}`} />}
          />
          <Route
            path="/student-login"
            element={!user ? <StudentLogin /> : <Navigate to="/student" />}
          />
          <Route
            path="/get-mess-id"
            element={<GetMessId />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to={`/${user.role}`} />}
          />
          <Route
          path="/free-trial"
          element={<FreeTrial/>}
            />
        <Route
          path="/stripe-success"
          element={<StripeSuccess/>}
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
      <Footer/>
      </ToastProvider>
    </MessProvider>
  );
}

export default App;
