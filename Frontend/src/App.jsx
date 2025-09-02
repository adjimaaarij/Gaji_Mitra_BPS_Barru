import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./Component/Navbar";
import Home from "./Page/Honor";
import Sobat from "./Page/Sobat";
import Survei from "./Page/Surevei.jsx";
import Login from "./Page/login.jsx";

function App() {
  const location = useLocation();

  // Cek apakah path sekarang "/login"
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {/* Navbar hanya tampil kalau bukan halaman login */}
      {/* {!isLoginPage && <Navbar />} */}

      <div style={{ marginLeft: isLoginPage ? "0" : "60px", padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/honor" element={
            <div>
              <Navbar />
              <Home />
            </div>
          } />
          <Route path="/sobat" element={
            <div>
              <Navbar />
              <Sobat />
            </div>
          } />
          <Route path="/survei" element={
            <div>
              <Navbar />
              <Survei />
            </div>
          } />
          <Route path="/login" element={
            <div>
              <Login />
            </div>
          } />
        </Routes>
      </div>
    </>
  );
}

export default App;
