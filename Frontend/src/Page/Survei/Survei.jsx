import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetNamaSurveis } from "../../Api/Nama_Survei_Api";
import { GetSurveis } from "../../Api/Survei_Api";
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

const Survei = () => {
  const [jenisList, setJenisList] = useState([]);
  const [namaList, setNamaList] = useState([]);
  const [timList, setTimList] = useState([]);
  const [searchGlobal, setSearchGlobal] = useState(""); // gabungan search nama survei + tim
  const [searchJenis, setSearchJenis] = useState("");
  const [searchTim, setSearchTim] = useState("");
  const [pageNama, setPageNama] = useState(1);
  const [pageJenis, setPageJenis] = useState(1);
  const [pageTim, setPageTim] = useState(1);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      await fetchTim();
      await fetchNama();
      await fetchJenis();
      setLoading(false);
    };
    fetchAll();
  }, []);

  const fetchJenis = async () => {
    try {
      const res = await GetSurveis();
      const data = Array.isArray(res) ? res : res.data;
      setJenisList(data || []);
    } catch (err) {
      console.error("Gagal fetch jenis survei:", err);
    }
  };

  const fetchNama = async () => {
    try {
      const res = await GetNamaSurveis();
      const data = Array.isArray(res) ? res : res.data;
      setNamaList(data || []);
    } catch (err) {
      console.error("Gagal fetch nama survei:", err);
    }
  };

  const fetchTim = async () => {
    try {
      const res = await GetTimSurvei();
      const data = Array.isArray(res) ? res : res.data;
      setTimList(data || []);
    } catch (err) {
      console.error("Gagal fetch tim survei:", err);
    }
  };

  // Helper untuk pagination umum
  const getPaginatedData = (list, search, keySelector, page) => {
    const filtered = list.filter((item) =>
      keySelector(item).toLowerCase().includes(search.toLowerCase())
    );
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return {
      data: filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE),
      totalPages: Math.ceil(filtered.length / ITEMS_PER_PAGE),
    };
  };

  // Fungsi get nama tim dari ID
  const getNamaTimById = (id_tim_survei) => {
    const tim = timList.find(
      (t) => Number(t.id_tim_survei) === Number(id_tim_survei)
    );
    return tim ? tim.nama_Tim_Survei : "-";
  };

  // Filter & pagination Nama Survei (gabungan search)
  const filteredNamaList = namaList.filter((item) => {
    const namaSurvei = (item.nama_survei || "").toLowerCase();
    const namaTim = getNamaTimById(item.id_tim_survei).toLowerCase();
    const search = searchGlobal.toLowerCase();
    return namaSurvei.includes(search) || namaTim.includes(search);
  });

  const startIndexNama = (pageNama - 1) * ITEMS_PER_PAGE;
  const namaPage = filteredNamaList.slice(
    startIndexNama,
    startIndexNama + ITEMS_PER_PAGE
  );
  const totalNamaPages = Math.ceil(filteredNamaList.length / ITEMS_PER_PAGE);

  // Pagination Jenis & Tim
  const { data: jenisPage } = getPaginatedData(
    jenisList,
    searchJenis,
    (item) => item.jenis_survei || "",
    pageJenis
  );

  const { data: timPage } = getPaginatedData(
    timList,
    searchTim,
    (item) => item.nama_Tim_Survei || "",
    pageTim
  );

  if (loading) return <p className="text-center py-5">Loading data...</p>;

  return (
    <>
      <BootstrapCDN />
      <div className="container-fluid py-5">
        <div className="container bg-white p-4 rounded shadow">
          <h2 className="mb-5">Manajemen Survei</h2>

          {/* Tim & Periode */}
          <div className="row mb-4">
            {/* Tim Survei */}
            <div className="col-md-6">
              <div className="card shadow">
                <div className="bps-header d-flex justify-content-between align-items-center">
                  <h2 className="h5 fw-bold text-bps-blue mb-3">Tim Survei</h2>
                  <div>
                    <input
                      type="text"
                      placeholder="Cari Tim..."
                      className="form-control form-control-sm d-inline-block me-2"
                      style={{ width: "300px" }}
                      value={searchTim}
                      onChange={(e) => {
                        setSearchTim(e.target.value);
                        setPageTim(1);
                      }}
                    />
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => navigate("/survei/tim")}
                    >
                      + Tambah
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  {timPage.length > 0 ? (
                    timPage.map((item, i) => (
                      <div key={i} className="mb-2">
                        <input
                          type="text"
                          className="form-control"
                          value={item.nama_Tim_Survei || "-"}
                          readOnly
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-center mb-0">Tidak ada data</p>
                  )}
                </div>
              </div>
            </div>

            {/* Periode */}
            <div className="col-md-6">
              <div className="card shadow">
                <div className="bps-header d-flex justify-content-between align-items-center">
                  <h2 className="h5 fw-bold text-bps-blue mb-3">Periode</h2>
                  <div>
                    <input
                      type="text"
                      placeholder="Cari Periode..."
                      className="form-control form-control-sm d-inline-block me-2"
                      style={{ width: "150px" }}
                      value={searchJenis}
                      onChange={(e) => {
                        setSearchJenis(e.target.value);
                        setPageJenis(1);
                      }}
                    />
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => navigate("/survei/jenis")}
                    >
                      + Tambah
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  {jenisPage.length > 0 ? (
                    jenisPage.map((item, i) => (
                      <div key={i} className="mb-2">
                        <input
                          type="text"
                          className="form-control"
                          value={item.jenis_survei || "-"}
                          readOnly
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-center mb-0">Tidak ada data</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Nama Survei */}
          <div className="card shadow">
            <div className="bps-header d-flex justify-content-between align-items-center">
              <h2 className="h5 fw-bold text-bps-blue mb-3">Nama Survei</h2>
              <div>
                <input
                  type="text"
                  placeholder="Cari Nama Survei / Tim..."
                  className="form-control form-control-sm d-inline-block me-2"
                  style={{ width: "300px" }}
                  value={searchGlobal}
                  onChange={(e) => {
                    setSearchGlobal(e.target.value);
                    setPageNama(1);
                  }}
                />
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => navigate("/survei/nama")}
                >
                  + Tambah
                </button>
              </div>
            </div>
            <div className="card-body">
              {namaPage.length > 0 ? (
                namaPage.map((item, i) => (
                  <div key={i} className="row mb-3">
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control"
                        value={item.nama_survei}
                        readOnly
                      />
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        className="form-control"
                        value={getNamaTimById(item.id_tim_survei)}
                        readOnly
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center mb-0">Tidak ada data</p>
              )}
            </div>
            <div className="card-footer text-center">
              {Array.from({ length: totalNamaPages }, (_, i) => (
                <button
                  key={i}
                  className={`btn btn-sm mx-1 ${
                    pageNama === i + 1 ? "btn-secondary" : "btn-outline-secondary"
                  }`}
                  onClick={() => setPageNama(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Survei;
