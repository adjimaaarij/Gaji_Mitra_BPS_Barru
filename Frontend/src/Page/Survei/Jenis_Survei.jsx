import React, { useState, useEffect } from "react";
import { CreateSurvei, UpdateSurvei, DeleteSurvei, GetSurveis } from "../../Api/Survei_Api";

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

const JenisSurvei = () => {
  const [jenisList, setJenisList] = useState([]);
  const [currentJenis, setCurrentJenis] = useState(null);
  const [jenisSurvei, setJenisSurvei] = useState("");
  const [searchGlobal, setSearchGlobal] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // ------------------------------
  // Fetch semua jenis survei
  // ------------------------------
  const fetchJenis = async () => {
    try {
      const res = await GetSurveis();
      const data = Array.isArray(res) ? res : res.data;
      setJenisList(data || []);
    } catch (err) {
      console.error("Gagal ambil jenis survei:", err);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await fetchJenis();
      setLoading(false);
    };
    fetchAll();
  }, []);

  // ------------------------------
  // Create / Update
  // ------------------------------
  const handleSubmitJenisSurvei = async (e) => {
    e.preventDefault();
    try {
      if (currentJenis) {
        await UpdateSurvei(currentJenis.id_survei, {
          jenis_survei: jenisSurvei,
        });
      } else {
        await CreateSurvei({ jenis_survei: jenisSurvei });
      }
      setJenisSurvei("");
      setCurrentJenis(null);
      fetchJenis();
    } catch (err) {
      console.error("Gagal simpan jenis survei:", err);
    }
  };

  // ------------------------------
  // Delete
  // ------------------------------
  const handleDelete = async (id) => {
    if (window.confirm("Apakah yakin ingin menghapus data ini?")) {
      await DeleteSurvei(id);
      fetchJenis();
    }
  };

  // ------------------------------
  // Filter & Pagination
  // ------------------------------
  const filteredList = jenisList.filter((item) =>
    (item.jenis_survei || "").toLowerCase().includes(searchGlobal.toLowerCase())
  );

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedList = filteredList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) return <p className="text-center py-5">Loading data...</p>;

  return (
    <>
      <BootstrapCDN />
      <div className="container-fluid py-5">
        <div className="container bg-white p-4 rounded shadow">
          <h2 className="mb-4">Manajemen Jenis Survei</h2>

          {/* Form Tambah / Edit */}
          <form onSubmit={handleSubmitJenisSurvei} className="mb-4">
            <div className="card shadow mb-3">
              <div className="bps-header text-center">
                {currentJenis ? "✏️ Edit Jenis Survei" : "➕ Tambah Jenis Survei"}
              </div>
              <div className="card-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Jenis Survei"
                  value={jenisSurvei}
                  onChange={(e) => setJenisSurvei(e.target.value)}
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
                      setJenisSurvei("");
                      setCurrentJenis(null);
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
              placeholder="Cari Jenis Survei..."
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
                  <th>Jenis Survei</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.length > 0 ? (
                  paginatedList.map((item, i) => (
                    <tr key={item.id_survei}>
                      <td>{startIndex + i + 1}</td>
                      <td>{item.jenis_survei}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => {
                            setJenisSurvei(item.jenis_survei);
                            setCurrentJenis(item);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item.id_survei)}
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

export default JenisSurvei;
