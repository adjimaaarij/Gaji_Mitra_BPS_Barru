import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logout as LogoutApi } from "../Api/Auth_Api";

const Navbar_Survei = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await LogoutApi();
      sessionStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Gagal logout:", err);
      sessionStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <>
      <style>
        {`
          .sidebar {
            position: fixed;
            top: 0;
            right: 0;
            width: 250px;
            height: 100%;
            background-color: #0A2463;
            color: white;
            padding: 20px;
            z-index: 999;
            display: flex;
            flex-direction: column;
          }

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

      {/* Sidebar selalu tampil di kanan */}
      <div className="sidebar">
        <nav>
          <ul className="list-unstyled">
            <li>
              <Link to="/Survei">
                <h2 className="display-8 mb-1">Survei</h2>
              </Link>
            </li>
            <li>
              <Link to="/survei/nama">
                <h2 className="display-8 mb-1">Nama Survei</h2>
              </Link>
            </li>
            <li>
              <Link to="/survei/jenis">
                <h2 className="display-8 mb-1">Jenis Survei</h2>
              </Link>
            </li>

            <li>
              <Link to="/survei/tim">
                <h2 className="display-8 mb-1">Tim Survei</h2>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navbar_Survei;
