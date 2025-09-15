import React, { useState, useEffect } from "react";
import {
  GetTimSurvei,
  CreateTimSurvei,
  UpdateTimSurvei,
  DeleteTimSurvei,
} from "../../Api/Tim_Survei_api";

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

const ITEMS_PER_PAGE = 10;

const TimSurvei = () => {
  const [timList, setTimList] = useState([]);
  const [currentTim, setCurrentTim] = useState(null);
  const [timSurvei, setTimSurvei] = useState("");
  const [searchGlobal, setSearchGlobal] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // ------------------------------
  // Fetch semua tim survei
  // ------------------------------
  const fetchTim = async () => {
    try {
      const res = await GetTimSurvei();
      const data = Array.isArray(res) ? res : res.data;
      setTimList(data || []);
    } catch (err) {
      console.error("Gagal ambil tim survei:", err);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await fetchTim();
      setLoading(false);
    };
    fetchAll();
  }, []);

  // ------------------------------
  // Create / Update
  // ------------------------------
  const handleSubmitTimSurvei = async (e) => {
    e.preventDefault();
    if (!timSurvei) return alert("Harap isi Nama Tim.");

    try {
      if (currentTim) {
        await UpdateTimSurvei(currentTim.id_tim_survei, {
          nama_tim_survei: timSurvei, // Corrected key to lowercase
        });
      } else {
        await CreateTimSurvei({ nama_tim_survei: timSurvei }); // Corrected key to lowercase
      }
      setTimSurvei("");
      setCurrentTim(null);
      fetchTim();
    } catch (err) {
      console.error("Gagal simpan tim survei:", err.response.data); // Log the full error response for better debugging
      // You can also add an alert here to inform the user
      alert(
        "Terjadi kesalahan saat menyimpan data. Pastikan nama tim tidak kosong."
      );
    }
  };

  // ------------------------------
  // Delete
  // ------------------------------
  const handleDelete = async (id) => {
    if (window.confirm("Apakah yakin ingin menghapus data ini?")) {
      await DeleteTimSurvei(id);
      fetchTim();
    }
  };

  // ------------------------------
  // Filter & Pagination
  // ------------------------------
  const filteredList = timList.filter((item) =>
    (item.nama_Tim_Survei || "")
      .toLowerCase()
      .includes(searchGlobal.toLowerCase())
  );

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedList = filteredList.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  if (loading) return <p className="text-center py-5">Loading data...</p>;

  return (
    <>
      <BootstrapCDN />
      <div className="container-fluid py-5">
        <div className="container bg-white p-4 rounded shadow">
          <h2 className="mb-4">Manajemen Tim Survei</h2>

          {/* Form Tambah / Edit */}
          <form onSubmit={handleSubmitTimSurvei} className="mb-4">
            <div className="card shadow mb-3">
              <div className="bps-header text-center">
                {currentTim ? "✏️ Edit Tim Survei" : "➕ Tambah Tim Survei"}
              </div>
              <div className="card-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Nama Tim"
                  value={timSurvei}
                  onChange={(e) => setTimSurvei(e.target.value)}
                  required
                />
                <div className="d-flex justify-content-end gap-2">
                  <button type="submit" className="btn btn-warning">
                    Simpan
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setTimSurvei("");
                      setCurrentTim(null);
                    }}
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Search */}
          <div className="mb-3 d-flex justify-content-end">
            <input
              type="text"
              className="form-control"
              style={{ width: "400px" }}
              placeholder="Cari Tim Survei..."
              value={searchGlobal}
              onChange={(e) => {
                setSearchGlobal(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Tabel Data */}
          <div className="card shadow">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>NO</th>
                  <th>Nama Tim</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.length > 0 ? (
                  paginatedList.map((item, i) => (
                    <tr key={item.id_tim_survei}>
                      <td>{startIndex + i + 1}</td>
                      <td>{item.nama_Tim_Survei}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => {
                            setTimSurvei(item.nama_Tim_Survei);
                            setCurrentTim(item);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item.id_tim_survei)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center">
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="card-footer text-center">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`btn btn-sm mx-1 ${
                      page === i + 1 ? "btn-secondary" : "btn-outline-secondary"
                    }`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TimSurvei;
