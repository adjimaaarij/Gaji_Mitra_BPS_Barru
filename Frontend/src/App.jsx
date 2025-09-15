import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Component/Navbar";
import Navbar_Survei from "./Component/Navbar_Survei.jsx";

import Home from "./Page/Honor";
import Sobat from "./Page/Sobat";
import Survei from "./Page/Survei/Survei.jsx";
import Login from "./Page/login.jsx";
import Honor from "./Page/Sobat_Bulanana.jsx";

// Survei
import JenisSurvei from "./Page/Survei/Jenis_Survei.jsx";
import NamaSurvei from "./Page/Survei/Nama_Survei.jsx";
import TimSurvei from "./Page/Survei/Tim_Survei..jsx";

import ProtectedRoute from "./Component/ProtectedRoute.jsx";

// Komponen layout untuk halaman yang butuh Navbar
const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

// Komponen layout untuk halaman Survei yang butuh dua Navbar
const SurveiLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Navbar_Survei />
      {children}
    </>
  );
};

function App() {
  return (
    <Routes>
      {/* Rute untuk halaman login, tidak perlu proteksi */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rute yang dilindungi, gunakan ProtectedRoute */}
      <Route
        path="/honor"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Home />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sobat"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Sobat />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sobat_bulanan"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Honor />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/survei"
        element={
          <ProtectedRoute>
            <SurveiLayout>
              <Survei />
            </SurveiLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/survei/jenis"
        element={
          <ProtectedRoute>
            <SurveiLayout>
              <JenisSurvei />
            </SurveiLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/survei/nama"
        element={
          <ProtectedRoute>
            <SurveiLayout>
              <NamaSurvei />
            </SurveiLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/survei/tim"
        element={
          <ProtectedRoute>
            <SurveiLayout>
              <TimSurvei />
            </SurveiLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;