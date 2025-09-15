import React, { useState, useEffect } from "react";
import {
  GetNamaSurveis,
  CreateNamaSurvei,
  UpdateNamaSurvei,
  DeleteNamaSurvei,
} from "../../Api/Nama_Survei_Api";
import { GetTimSurvei } from "../../Api/Tim_Survei_api";

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

const NamaSurvei = () => {
  const [namaList, setNamaList] = useState([]);
  const [timList, setTimList] = useState([]);
  const [currentNama, setCurrentNama] = useState(null);
  const [namaSurvei, setNamaSurvei] = useState("");
  const [selectedTim, setSelectedTim] = useState("");
  const [searchGlobal, setSearchGlobal] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // ------------------------------
  // Fungsi helper harus dideklarasikan sebelum dipakai
  // ------------------------------
  const getNamaTimById = (id_tim_survei) => {
    const tim = timList.find(
      (t) => Number(t.id_tim_survei) === Number(id_tim_survei)
    );
    return tim ? tim.nama_Tim_Survei : "-";
  };

  // ------------------------------
  // Fetch semua data
  // ------------------------------
  const fetchNama = async () => {
    try {
      const res = await GetNamaSurveis();
      const data = Array.isArray(res) ? res : res.data; // ambil dari res.data kalau perlu
      setNamaList(data || []);
    } catch (err) {
      console.error("Gagal ambil nama survei:", err);
    }
  };

  const fetchTim = async () => {
    try {
      const res = await GetTimSurvei();
      const data = Array.isArray(res) ? res : res.data; // ambil dari res.data kalau perlu
      setTimList(data || []);
    } catch (err) {
      console.error("Gagal ambil tim survei:", err);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await fetchTim();
      await fetchNama();
      setLoading(false);
    };
    fetchAll();
  }, []);

  // ------------------------------
  // Create / Update
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentNama) {
        await UpdateNamaSurvei(currentNama.id_nama_survei, {
          nama_survei: namaSurvei,
          id_tim_survei: selectedTim,
        });
      } else {
        await CreateNamaSurvei({
          nama_survei: namaSurvei,
          id_tim_survei: selectedTim,
        });
      }
      setNamaSurvei("");
      setSelectedTim("");
      setCurrentNama(null);
      fetchNama();
    } catch (err) {
      console.error("Gagal simpan nama survei:", err);
    }
  };

  // ------------------------------
  // Delete
  // ------------------------------
  const handleDelete = async (id) => {
    if (window.confirm("Apakah yakin ingin menghapus data ini?")) {
      await DeleteNamaSurvei(id);
      fetchNama();
    }
  };

  // ------------------------------
  // Filter & Pagination
  // ------------------------------
  const filteredList = namaList.filter((item) => {
    const nama = (item.nama_survei || "").toLowerCase();
    const timName = getNamaTimById(item.id_tim_survei).toLowerCase();
    const search = searchGlobal.toLowerCase();
    return nama.includes(search) || timName.includes(search);
  });

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedList = filteredList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) return <p className="text-center py-5">Loading data...</p>;

  return (
    <>
      <BootstrapCDN />
      <div className="container-fluid py-5">
        <div className="container bg-white p-4 rounded shadow">
          <h2 className="mb-4">Manajemen Nama Survei</h2>

          {/* Form Tambah / Edit */}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="card shadow mb-3">
              <div className="bps-header text-center">
                {currentNama ? "✏️ Edit Nama Survei" : "➕ Tambah Nama Survei"}
              </div>
              <div className="card-body">
                <div className="row mb-2">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nama Survei"
                      value={namaSurvei}
                      onChange={(e) => setNamaSurvei(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <select
                      className="form-select"
                      value={selectedTim}
                      onChange={(e) => setSelectedTim(e.target.value)}
                      required
                    >
                      <option value="">-- Pilih Tim --</option>
                      {timList.map((tim) => (
                        <option
                          key={tim.id_tim_survei}
                          value={tim.id_tim_survei}
                        >
                          {tim.nama_Tim_Survei}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="submit" className="btn btn-warning">
                    Simpan
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setNamaSurvei("");
                      setSelectedTim("");
                      setCurrentNama(null);
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
              style={{ width: "300px" }}
              placeholder="Cari Nama Survei / Tim..."
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
                  <th>Nama Survei</th>
                  <th>Tim</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.length > 0 ? (
                  paginatedList.map((item, i) => (
                    <tr key={item.id_nama_survei}>
                      <td>{startIndex + i + 1}</td>
                      <td>{item.nama_survei}</td>
                      <td>{getNamaTimById(item.id_tim_survei)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => {
                            setNamaSurvei(item.nama_survei);
                            setSelectedTim(item.id_tim_survei || "");
                            setCurrentNama(item);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item.id_nama_survei)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center">
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

export default NamaSurvei;
