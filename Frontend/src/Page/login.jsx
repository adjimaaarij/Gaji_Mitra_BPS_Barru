import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Login as LoginApi } from "../Api/Auth_Api";
import "./login.css";

const BootstrapCDN = () => (
  <>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      crossOrigin="anonymous"
    />
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
      crossOrigin="anonymous"
    />
  </>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await LoginApi({ email, password });
      sessionStorage.setItem("token", data.token);

      toast.success("Login berhasil!");
      navigate("/honor");
    } catch (err) {
      console.error("Error logging in:", err);
      setError(err.message || "Gagal login. Periksa email dan password.");
      toast.error(err.message || "Gagal login. Periksa email dan password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BootstrapCDN />
      {/* ✅ Centering with Bootstrap flex */}
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card shadow-lg p-4" style={{ maxWidth: "450px", width: "100%" }}>
          <div className="card-header text-center rounded-top bg-primary text-white">
            <h1 className="card-title mb-0">Admin Login</h1>
          </div>
          <div className="card-body">
            <h4 className="text-center text-secondary mb-4">
              Dashboard Gaji Sobat (Mitra)
            </h4>

            {error && (
              <div className="alert alert-danger text-center" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-3 text-start">
                <label htmlFor="emailInput" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="emailInput"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3 text-start">
                <label htmlFor="passwordInput" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="passwordInput"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
