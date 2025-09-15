import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Logout as LogoutApi } from "../Api/Auth_Api";

const Navbar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // panggil API logout
      await LogoutApi();

      // hapus token dari sessionStorage (karena login pakai sessionStorage)
      sessionStorage.removeItem("token");

      // tutup sidebar
      setShowSidebar(false);

      // redirect ke login
      navigate("/login");
    } catch (err) {
      console.error("Gagal logout:", err);

      // fallback -> tetap hapus token dan redirect
      sessionStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <>
      <style>
        {`
          .list-unstyled {
            padding: 0;
            margin: 0;
            flex-grow: 1; 
          }
          .list-unstyled a {
            color: white;
            text-decoration: none;
            display: block;
            padding: 10px 0;
          }
          .list-unstyled a:hover {
            color: #F58220;
          }
          .logout-btn {
            margin-top: auto; 
          }
        `}
      </style>

      {/* Tombol toggle sidebar */}
      <AnimatePresence>
        {!showSidebar && (
          <motion.button
            key="sidebar-toggle"
            onClick={() => setShowSidebar(true)}
            className="btn btn-primary"
            style={{
              position: "fixed",
              top: 17,
              left: 17,
              zIndex: 10,
              backgroundColor: "#0A2463",
              borderColor: "#0A2463",
              fontSize: "24px",
              padding: "10px 18px",
              borderRadius: "10px",
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            ☰
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sidebar dengan animasi */}
      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div
              key="sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "250px",
                height: "100%",
                backgroundColor: "#0A2463",
                color: "white",
                padding: "20px",
                zIndex: 999,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className="d-flex justify-content-end mb-4">
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowSidebar(false)}
                  style={{ filter: "invert(1)" }}
                ></button>
              </div>

              <nav>
                <ul className="list-unstyled">
                  <li>
                    <Link to="/honor">
                      <h2 className="display-6 mb-1">Honor</h2>
                    </Link>
                  </li>
                  <li>
                    <Link to="/sobat">
                    <h2 className="display-6 mb-1">Mitra</h2>
                    </Link>
                  </li>
                  <li>
                    <Link to="/sobat_bulanan">
                    <h2 className="display-6 mb-1">Sobat Bulanan</h2>
                    </Link>
                  </li>
                  <li>
                    <Link to="/survei">
                    <h2 className="display-6 mb-1">Survei</h2>
                    </Link>
                  </li>
                </ul>
              </nav>

              <div className="logout-btn">
                <button onClick={handleLogout} className="btn btn-danger w-100">
                  Logout
                </button>
              </div>
            </motion.div>

            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="sidebar-backdrop"
              onClick={() => setShowSidebar(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.5)",
                zIndex: 998,
              }}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
