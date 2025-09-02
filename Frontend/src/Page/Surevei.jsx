import React, { useState, useEffect } from "react";
import {
  GetNamaSurveis,
  CreateNamaSurvei,
  UpdateNamaSurvei,
  DeleteNamaSurvei,
} from "../Api/Nama_Survei_Api";
import {
  GetSurveis,
  CreateSurvei,
  UpdateSurvei,
  DeleteSurvei,
} from "../Api/Survei_Api";

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

const Survei = () => {
  // State Jenis Survei
  const [jenisSurvei, setJenisSurvei] = useState("");
  const [currentJenis, setCurrentJenis] = useState(null);
  const [jenisList, setJenisList] = useState([]);
  const [namaSurveiList, setNamaSurveiList] = useState([]);

  const honors = namaSurveiList[0]?.honors;

  // State Nama Survei
  const [namaSurvei, setNamaSurvei] = useState("");
  const [currentNama, setCurrentNama] = useState(null);
  const [namaList, setNamaList] = useState([]);

  // 🔹 Ambil data dari API saat load
  useEffect(() => {
    const fetchNama = async () => {
      try {
        const res = await GetNamaSurveis();
        console.log("Raw response nama_survei:", res);

        if (res.status === "success" && Array.isArray(res.data)) {
          setNamaList(res.data); // ⬅️ langsung isi ke namaList
        }
      } catch (error) {
        console.error("Error fetching nama survei:", error);
      }
    };

    fetchNama();
    fetchJenis(); // ⬅️ sekalian ambil jenis di awal
  }, []);

  const fetchJenis = async () => {
    try {
      const res = await GetSurveis();
      setJenisList(res.data);
    } catch (err) {
      console.error("Gagal fetch jenis survei:", err);
    }
  };

  const fetchNama = async () => {
    try {
      const res = await GetNamaSurveis();
      setNamaList(res.data);
    } catch (err) {
      console.error("Gagal fetch nama survei:", err);
    }
  };

  // 🔹 Simpan Jenis Survei
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
      fetchJenis(); // refresh list
    } catch (err) {
      console.error("Gagal simpan jenis survei:", err);
    }
  };

  // 🔹 Simpan Nama Survei
  const handleSubmitNamaSurvei = async (e) => {
    e.preventDefault();
    try {
      if (currentNama) {
        await UpdateNamaSurvei(currentNama.id_nama_survei, {
          nama_survei: namaSurvei,
        });
      } else {
        await CreateNamaSurvei({ nama_survei: namaSurvei });
      }
      setNamaSurvei("");
      setCurrentNama(null);
      fetchNama(); // refresh list
    } catch (err) {
      console.error("Gagal simpan nama survei:", err);
    }
  };

  return (
    <>
      <BootstrapCDN />

      <div className="container my-2">
        <div className="row">
          {/* Card Jenis Survei */}
          <div className="col-md-6">
            <form onSubmit={handleSubmitJenisSurvei}>
              <div className="card shadow mb-4">
                <div className="card-header bg-dark text-white text-center">
                  {currentJenis
                    ? "✏️ Edit Jenis Survei"
                    : "➕ Tambah Jenis Survei"}
                </div>
                <div className="card-body">
                  <input
                    type="text"
                    className="form-control mb-2"
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
                <table className="table mb-0">
                  <thead>
                    <tr>
                      <th>NO</th>
                      <th>Jenis Survei</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(jenisList) &&
                      jenisList.map((item, i) => (
                        <tr key={item.id_survei}>
                          <td>{i + 1}</td>
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
                              onClick={() =>
                                DeleteSurvei(item.id_survei).then(fetchJenis)
                              }
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </form>
          </div>

          {/* Card Nama Survei */}
          <div className="col-md-6">
            <form onSubmit={handleSubmitNamaSurvei}>
              <div className="card shadow mb-4">
                <div className="card-header bg-dark text-white text-center">
                  {currentNama
                    ? "✏️ Edit Nama Survei"
                    : "➕ Tambah Nama Survei"}
                </div>
                <div className="card-body">
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={namaSurvei}
                    onChange={(e) => setNamaSurvei(e.target.value)}
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
                        setNamaSurvei("");
                        setCurrentNama(null);
                      }}
                    >
                      Batal
                    </button>
                  </div>
                </div>
                <table className="table mb-0">
                  <thead>
                    <tr>
                      <th>NO</th>
                      <th>Nama Survei</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {namaList.map((item, i) => (
                      <tr key={item.id_nama_survei}>
                        <td>{i + 1}</td>
                        <td>{item.nama_survei}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => {
                              setNamaSurvei(item.nama_survei);
                              setCurrentNama(item);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              DeleteNamaSurvei(item.id_nama_survei).then(
                                fetchNama
                              )
                            }
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Survei;
