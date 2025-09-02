import React, { useState, useEffect } from "react";
import Navbar from "../Component/Navbar";
import {
  GetSobat,
  GetSobatById,
  CreateSobat,
  UpdateSobat,
  DeleteSobat,
} from "../Api/Sobat_Api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Bootstrap CDN
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

// Tambahkan di dalam component Sobat
const isDataLoaded = () => {
  return !loading && sobatList.length > 0;
};

const Sobat = () => {
  const [sobatList, setSobatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    id_sobat: "",
    nama: "",
    email: "",
    total_akumulasi: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [currentSobatId, setCurrentSobatId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch API data
  useEffect(() => {
    const fetchSobat = async () => {
      try {
        setLoading(true);
        const res = await GetSobat();
        setSobatList(Array.isArray(res) ? res : res?.data || []);
      } catch (err) {
        console.error("Gagal fetch API:", err.response?.data || err.message);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSobat();
  }, []);

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form submit handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await UpdateSobat(currentSobatId, formData);
      } else {
        await CreateSobat(formData);
      }
      // refresh data
      const res = await GetSobat();
      setSobatList(Array.isArray(res) ? res : res?.data || []);
      resetForm();
    } catch (err) {
      console.error("❌ Gagal simpan:", err);
      alert("Gagal simpan data Sobat");
    }
  };

  // Edit data
  const handleEdit = (sobat) => {
    setFormData({
      id_sobat: sobat.id_sobat || "",
      nama: sobat.nama || "",
      email: sobat.email || "",
      total_akumulasi: sobat.total_akumulasi || 0,
    });
    setIsEditing(true);
    setCurrentSobatId(sobat.id_sobat);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Hapus data
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin mau hapus?")) return;
    try {
      await DeleteSobat(id);
      const res = await GetSobat();
      setSobatList(Array.isArray(res) ? res : res?.data || []);
    } catch (err) {
      console.error("❌ Gagal hapus:", err);
      alert("Gagal hapus data Sobat");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id_sobat: "",
      nama: "",
      email: "",
      total_akumulasi: 0,
    });
    setIsEditing(false);
    setCurrentSobatId(null);
  };

  // Filter pencarian
  const filteredSobat = sobatList.filter((s) => {
    const keyword = searchTerm.toLowerCase();
    return (
      s.id_sobat?.toString().includes(keyword) ||
      s.nama?.toLowerCase().includes(keyword) ||
      s.email?.toLowerCase().includes(keyword)
    );
  });

  // Export Excel
  const handleExport = () => {
    const dataToExport = sobatList.map((s) => ({
      "ID Sobat (NIK)": s.id_sobat,
      Nama: s.nama,
      Email: s.email,
      total_akumulasi: s.total_akumulasi,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Sobat");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Data_Sobat.xlsx");
  };

  return (
    <>
      <BootstrapCDN />
      <style>
        {`
          :root {
            --bs-primary: #007bff;
            --bs-secondary: #6c757d;
            --bps-blue: #0A2463;
            --bps-orange: #F58220;
          }
          body { background-color: #f0f2f5; }
          .bps-header { background-color: var(--bps-blue); color: #fff; border-radius: .5rem; padding: 2rem; }
          .btn-primary { background-color: var(--bps-orange); border-color: var(--bps-orange); }
          .btn-primary:hover { background-color: #e57210; border-color: #e57210; }
          .text-bps-blue { color: var(--bps-blue); }

          .text-soft-yellow {
              color: #d4af37 !important; /* emas lembut */
            }

            .text-soft-orange {
              color: #e69500 !important; /* oranye pastel */
            }

            .text-soft-green {
              color: #4caf50 !important; /* hijau lembut */
            }
            .text-soft-danger {
            color: #e57373 !important; /* merah pastel */
          }


        `}
      </style>

      <div className="container-fluid py-5">
        {/* <Navbar /> */}
        <div className="container bg-white p-4 rounded shadow">
          <header className="bps-header p-4 text-center">
            <h1 className="display-4 mb-2">Data Sobat (Mitra)</h1>
            <p>Manajemen dan Monitoring Data Sobat (Mitra).</p>
          </header>

          <div className="p-4 rounded shadow mb-4">
            <h3 className="h5 fw-bold text-bps-blue mb-3">
              {isEditing ? "Edit Sobat" : "Tambah Sobat"}
            </h3>
            <form onSubmit={handleFormSubmit} className="row g-3">
              <div className="col-md-4">
                <label className="form-label">NIK</label>
                <input
                  type="text"
                  className="form-control"
                  name="id_sobat"
                  value={formData.id_sobat}
                  onChange={handleInputChange}
                  placeholder="Contoh: 1234567890123456"
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Nama</label>
                <input
                  type="text"
                  className="form-control"
                  name="nama"
                  value={formData.nama || ""}
                  onChange={handleInputChange}
                  placeholder="Contoh: Budi Santoso"
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  placeholder="Contoh: budi@example.com"
                />
              </div>
              <div className="col-12 d-flex gap-2 mt-3">
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Update" : "Tambah"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Search & Export */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 fw-bold text-bps-blue m-0">Data Sobat (Mitra)</h2>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Cari Sobat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-success" onClick={handleExport}>
                Export Excel
              </button>
            </div>
          </div>

          {/* Table */}
          <div
            className="table-responsive"
            style={{ maxHeight: 400, overflowY: "auto" }}
          >
            <table className="table table-striped table-hover">
              <thead className="table-primary">
                <tr>
                  <th>NIK</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Total Honor</th>
                  <th>Total Pulsa</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredSobat.length > 0 ? (
                  filteredSobat.map((s) => {
                    let cellClass = "";
                    if (s.total_honor >= 3000000) {
                      cellClass = "text-soft-danger fw-bold"; // merah
                    }
                    if (
                      s.total_honor >= 2500000 &&
                      s.total_honor <= 2999999
                    ) {
                      cellClass = "text-soft-yellow fw-bold"; // kuning
                    }

                    return (
                      <tr key={s.id_sobat}>
                        <td>{s.id_sobat}</td>
                        <td>{s.nama}</td>
                        <td>{s.email}</td>
                        <td className={cellClass}>
                          Rp{" "}
                          {Number(s.total_honor || 0).toLocaleString(
                            "id-ID"
                          )}
                        </td>
                        <td className={cellClass}>
                          Rp{" "}
                          {Number(s.total_pulsa || 0).toLocaleString(
                            "id-ID"
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => handleEdit(s)}
                            className="btn btn-warning btn-sm me-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(s.id_sobat)}
                            className="btn btn-danger btn-sm"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Data tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sobat;
