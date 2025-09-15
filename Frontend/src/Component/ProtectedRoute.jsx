import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    // Arahkan kembali ke halaman login jika tidak ada token
    return <Navigate to="/" />;
  }

  // Tampilkan komponen yang dilindungi jika token ditemukan
  return children;
};

export default ProtectedRoute;