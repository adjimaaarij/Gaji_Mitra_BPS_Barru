import React, { useState, useEffect } from "react";
// import Navbar from "../Component/Navbar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Select from "react-select";
import { GetSobat, UpdateSobat, CreateSobat } from "../Api/Sobat_Api";
import { GetSurveis } from "../Api/Survei_Api";
import { GetTimSurvei, GetTimSurveisById } from "../Api/Tim_Survei_api";
import { GetNamaSurveiById, GetNamaSurveis } from "../Api/Nama_Survei_Api";
import {
  GetHonors,
  GetHonorById,
  CreateHonor,
  UpdateHonor,
  DeleteHonor,
} from "../Api/Honor_Api";

// Include Bootstrap CSS and JS from CDN
const BootstrapCDN = () => (
  <>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      xintegrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
      crossOrigin="anonymous"
    />
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
      xintegrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
      crossOrigin="anonymous"
    />
  </>
);

// Main application component for the Mitra Honor Admin Dashboard
const Home = () => {
  const [honors, setHonors] = useState([]);
  const [sobatList, setSobatList] = useState([]);
  const [surveiList, setSurveiList] = useState([]);
  const [nama_surveiList, setNama_SurveiList] = useState([]);
  const [sortBy, setSortBy] = useState("honor"); // default urut berdasarkan honor

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHonors = async () => {
    try {
      const res = await GetHonors();
      setHonors(Array.isArray(res) ? res : res?.data || []);
    } catch (err) {
      console.error(
        "❌ Gagal fetch honors:",
        err.response?.data || err.message
      );
    }
  };

  const initialFormState = {
    id_sobat: "",
    id_survei: "",
    id_nama_survei: "",
    nama: "",
    email: "",
    nilai_honor: "",
    jenis_survei: "",
    tanggal_input: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    bulan: "",
  };

  const namaBulan = [
    "", // index 0 biar pas, karena bulan biasanya mulai dari 1
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  function getNamaBulan(tanggal) {
    if (!tanggal) return "-";
    const dateObj = new Date(tanggal);
    const bulanIndex = dateObj.getMonth(); // 0-11
    const tahun = dateObj.getFullYear();
    return `${namaBulan[bulanIndex + 1]} ${tahun}`;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [currentHonorId, setCurrentHonorId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  const [namaSurveiList, setNamaSurveiList] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [sobatRes, surveiRes, honorRes, namaSurveiRes] =
          await Promise.all([
            GetSobat(),
            GetSurveis(),
            GetHonors(),
            GetNamaSurveis(),
          ]);

        setSobatList(Array.isArray(sobatRes) ? sobatRes : sobatRes?.data || []);
        setSurveiList(
          Array.isArray(surveiRes) ? surveiRes : surveiRes?.data || []
        );
        setHonors(Array.isArray(honorRes) ? honorRes : honorRes?.data || []);
        setNamaSurveiList(
          Array.isArray(namaSurveiRes)
            ? namaSurveiRes
            : namaSurveiRes?.data || []
        );
      } catch (err) {
        console.error("Gagal fetch API:", err.response?.data || err.message);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    fetchHonors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" && value !== "" ? Number(value) : value,
    }));
  };

  // Form submit handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      id_sobat: formData.id_sobat,
      id_survei: formData.id_survei,
      id_nama_survei: formData.id_nama_survei,
      nilai_honor: formData.nilai_honor,
      nilai_pulsa: formData.nilai_pulsa,
      bulan: formData.bulan,
      tanggal_input: formData.tanggal_input,
    };

    try {
      if (isEditing) {
        await UpdateHonor(currentHonorId, payload);
        console.log("✅ Data berhasil diupdate");
      } else {
        await CreateHonor(payload);
        console.log("✅ Data berhasil disimpan");
      }

      // 🔥 refresh data
      await fetchHonors();

      // 🔄 reset form setelah simpan
      resetForm();
    } catch (err) {
      console.error("❌ Error submit:", err.response?.data || err.message);
    }
  };

  const handleEdit = (honor) => {
    setFormData({
      id_sobat: honor.sobat?.id_sobat || "",
      id_survei: honor.survei?.id_survei || "",
      nilai_honor: honor.nilai_honor ?? "",
      nilai_pulsa: honor.nilai_pulsa ?? "",
      tanggal_input: honor.tanggal_input
        ? honor.tanggal_input.split("T")[0]
        : new Date().toISOString().split("T")[0],
      id_nama_survei: honor.nama_survei?.id_nama_survei || "",
      bulan: honor.bulan || "",
    });

    setIsEditing(true);
    setCurrentHonorId(honor.id_honor);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      message: "Apakah Anda yakin ingin menghapus data ini?",
      onConfirm: async () => {
        try {
          await DeleteHonor(id);
          setHonors((prev) => prev.filter((h) => h.id_honor !== id));
        } catch (err) {
          console.error(
            "❌ Gagal hapus honor:",
            err.response?.data || err.message
          );
          alert("Gagal hapus data.");
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // 🔄 Reset form
  const resetForm = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setCurrentHonorId(null);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredHonors = honors.filter((honor) => {
    const keyword = searchTerm.toLowerCase();
    const bulanNama = getNamaBulan(honor.bulan).toLowerCase();

    // Format tanggal input sesuai UI
    const tanggalInputFormatted = honor.tanggal_input
      ? new Date(honor.tanggal_input.replace(" ", "T"))
          .toLocaleDateString("id-ID")
          .toLowerCase()
      : "";

    return (
      honor.sobat?.id_sobat?.toString().includes(keyword) ||
      honor.id_honor?.toString().includes(keyword) ||
      bulanNama.includes(keyword) || // 🔥 sekarang cari pakai nama bulan
      honor.nama_survei?.nama_survei?.toLowerCase().includes(keyword) ||
      honor.sobat?.nama?.toLowerCase().includes(keyword) ||
      honor.nilai_honor?.toString().includes(keyword) ||
      honor.nilai_pulsa?.toString().includes(keyword) ||
      honor.survei?.jenis_survei?.toLowerCase().includes(keyword) ||
      tanggalInputFormatted.includes(keyword)
    );
  });

  const sortedHonors = [...filteredHonors].sort((a, b) => {
    if (sortBy === "honor") {
      return (b.nilai_honor || 0) - (a.nilai_honor || 0);
    } else if (sortBy === "pulsa") {
      return (b.nilai_pulsa || 0) - (a.nilai_pulsa || 0);
    }
    return 0;
  });

  const exportToExcel = () => {
    const data = filteredHonors.map((honor) => {
      // Perbaikan: Ambil nama survei dari objek nama_survei
      const namaSurvei = honor.nama_survei?.nama_survei || "-";

      // Perbaikan: Ambil jenis survei dari objek survei
      const jenisSurvei = honor.survei?.jenis_survei || "";
      const jenisSurveiBulanan = jenisSurvei.toLowerCase().includes("bulanan")
        ? "x"
        : "";
      const jenisSurveiTriwulanan = jenisSurvei
        .toLowerCase()
        .includes("triwulanan")
        ? "x"
        : "";
      const jenisSurveiSubround = jenisSurvei.toLowerCase().includes("subround")
        ? "x"
        : "";
      const jenisSurveiTahunan = jenisSurvei.toLowerCase().includes("tahunan")
        ? "x"
        : "";

      return {
        "ID Sobat": honor.sobat?.id_sobat || "-",
        Nama: honor.sobat?.nama || "-",
        Email: honor.sobat?.email || "-",
        Bulan: getNamaBulan(honor.bulan),
        "Nama Survei": namaSurvei, // Perbaikan di sini
        Bulanan: jenisSurveiBulanan,
        Triwulanan: jenisSurveiTriwulanan,
        Subround: jenisSurveiSubround,
        Tahunan: jenisSurveiTahunan,
        "Nilai Honor": Number(honor.nilai_honor || 0), // angka biar bisa diformat
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);

    // set lebar kolom
    worksheet["!cols"] = [
      { wch: 15 }, // ID Sobat
      { wch: 25 }, // Nama
      { wch: 30 }, // Email
      { wch: 12 }, // Bulan
      { wch: 40 }, // Nama Survei
      { wch: 12 }, // Bulanan
      { wch: 12 }, // Triwulanan
      { wch: 12 }, // Subround
      { wch: 12 }, // Tahunan
      { wch: 18 }, // Nilai Honor
    ];

    // Terapkan format angka untuk kolom Nilai Honor
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let row = 1; row <= range.e.r; row++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: 9 }); // kolom ke-9 (Nilai Honor)
      if (worksheet[cellRef]) {
        worksheet[cellRef].t = "n"; // tipe number
        worksheet[cellRef].z = "#,##0"; // format ribuan
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Data Honor Sobat (Mitra)"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      "GajiMitra.xlsx"
    );
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
        `}
      </style>

      <div className="container-fluid py-5">
        {/* <Navbar /> */}
        <div className="container bg-white p-4 rounded shadow">
          <header className="bps-header p-4 text-center">
            <h1 className="display-4 mb-2">
              Admin Dashboard Honor Sobat (Mitra)
            </h1>
            <p>Manajemen Dan Monitoring Data Honor Sobat (Mitra).</p>
          </header>

          <div className="p-4 rounded shadow mt-4 mb-4">
            <h2 className="h4 fw-bold text-bps-blue mb-4">
              {isEditing
                ? "Edit Data Honor Sobat (Mitra)"
                : "Tambah Data Honor Sobat (Mitra)"}
            </h2>

            <form onSubmit={handleFormSubmit}>
              <div className="row g-4">
                <div className="col-12 col-md-6 col-lg-4">
                  <label className="form-label" htmlFor="id_sobat">
                    Nama Mitra
                  </label>
                  <Select
                    id="id_sobat"
                    name="id_sobat"
                    value={
                      formData.id_sobat
                        ? {
                            value: formData.id_sobat,
                            label:
                              sobatList.find(
                                (s) => s.id_sobat === formData.id_sobat
                              )?.nama || "",
                          }
                        : null
                    }
                    onChange={(selected) =>
                      setFormData((prev) => ({
                        ...prev,
                        id_sobat: selected ? selected.value : "",
                      }))
                    }
                    options={sobatList.map((s) => ({
                      value: s.id_sobat,
                      label: s.nama,
                    }))}
                    placeholder="Pilih Mitra..."
                    isSearchable
                    className="basic-single"
                    classNamePrefix="select"
                  />
                </div>

                <div className="col-12 col-md-6 col-lg-4">
                  <label className="form-label" htmlFor="id_survei">
                    Priode
                  </label>
                  <select
                    id="id_survei"
                    name="id_survei"
                    value={formData.id_survei || ""}
                    onChange={handleInputChange}
                    required
                    className="form-select"
                  >
                    <option value="">Pilih Priode</option>
                    {surveiList.map((s) => (
                      <option key={s.id_survei} value={s.id_survei}>
                        {s.nama_survei} ({s.jenis_survei})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6 col-lg-4">
                  <label className="form-label" htmlFor="id_nama_survei">
                    Survei
                  </label>
                  <Select
                    id="id_nama_survei"
                    name="id_nama_survei"
                    value={
                      formData.id_nama_survei
                        ? {
                            value: formData.id_nama_survei,
                            label:
                              namaSurveiList.find(
                                (n) =>
                                  n.id_nama_survei === formData.id_nama_survei
                              )?.nama_survei || "",
                          }
                        : null
                    }
                    onChange={(selected) =>
                      setFormData((prev) => ({
                        ...prev,
                        id_nama_survei: selected ? selected.value : "",
                      }))
                    }
                    options={namaSurveiList.map((n) => ({
                      value: n.id_nama_survei,
                      label: n.nama_survei,
                    }))}
                    placeholder="Pilih Survei..."
                    isSearchable
                    className="basic-single"
                    classNamePrefix="select"
                  />
                </div>

                <div className="col-12 col-md-6 col-lg-4">
                  <label className="form-label" htmlFor="bulan">
                    Bulan
                  </label>
                  <input
                    type="month"
                    id="bulan"
                    name="bulan"
                    value={formData.bulan?.slice(0, 7) || ""} // tampilkan hanya YYYY-MM
                    onChange={(e) => {
                      const [year, month] = e.target.value.split("-");
                      handleInputChange({
                        target: {
                          name: "bulan",
                          value: `${year}-${month}-01`, // simpan di DB sebagai format date
                        },
                      });
                    }}
                    required
                    className="form-control"
                  />
                </div>

                <div className="col-12 col-md-6 col-lg-4">
                  <label className="form-label" htmlFor="nilai_honor">
                    Nilai Honor
                  </label>
                  <input
                    type="number"
                    id="nilai_honor"
                    name="nilai_honor"
                    value={formData.nilai_honor}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                    placeholder="Contoh: 1000000"
                  />
                </div>

                <div className="col-12 col-md-6 col-lg-4">
                  <label className="form-label" htmlFor="nilai_honor">
                    Nilai Pulsa
                  </label>
                  <input
                    type="number"
                    id="nilai_pulsa"
                    name="nilai_pulsa"
                    value={formData.nilai_pulsa}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                    placeholder="Contoh: 1000000"
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4 gap-2">
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Simpan Perubahan" : "Tambahkan Data"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>

          <div className="p-4 rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h4 fw-bold text-bps-blue m-0">
                Daftar Honor Sobat (Mitra)
              </h1>

              <div>
                <div className="d-flex gap-2 align-items-center mb-1">
                  <select
                    className="form-select mb-6"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="honor">Urutkan Honor Tertinggi</option>
                    <option value="pulsa">Urutkan Pulsa Tertinggi</option>
                  </select>
                  <button className="btn btn-success" onClick={exportToExcel}>
                    Export Excel
                  </button>
                </div>

                {/* SortBy dipindah ke bawah */}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div
              className="table-responsive"
              style={{ maxHeight: 400, overflowY: "auto" }}
            >
              <table className="table table-striped table-hover">
                <thead className="table-primary">
                  <tr>
                    <th>NIK</th>
                    <th>Nama Mitra</th>
                    <th>Nama Survei</th>
                    <th>Jenis Survei</th>
                    <th>Bulan</th>
                    <th>Nilai Honor</th>
                    <th>Nilai Pulsa</th>
                    {/* <th>Tanggal Input</th> */}
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedHonors.length > 0 ? (
                    sortedHonors.map((honor) => (
                      <tr key={honor.id_honor}>
                        <td>{honor.sobat?.id_sobat || "-"}</td>
                        <td>{honor.sobat?.nama || "-"}</td>
                        <td>{honor.nama_survei?.nama_survei || "-"}</td>
                        <td>{honor.survei?.jenis_survei || "-"}</td>
                        <td>{getNamaBulan(honor.bulan)}</td>
                        <td>
                          Rp
                          {Number(honor.nilai_honor || 0).toLocaleString(
                            "id-ID"
                          )}
                        </td>
                        <td>
                          {Number(honor.nilai_pulsa || 0).toLocaleString(
                            "id-ID"
                          )}
                        </td>
                        {/* <td>
                          {honor.tanggal_input
                            ? new Date(
                                honor.tanggal_input.replace(" ", "T")
                              ).toLocaleDateString("id-ID")
                            : "-"}
                        </td> */}
                        <td>
                          <button
                            onClick={() => handleEdit(honor)}
                            className="btn btn-warning btn-sm me-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(honor.id_honor)}
                            className="btn btn-danger btn-sm"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        Data tidak ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {confirmModal.isOpen && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Konfirmasi Hapus</h5>
              </div>
              <div className="modal-body">
                <p>{confirmModal.message}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    setConfirmModal((p) => ({ ...p, isOpen: false }))
                  }
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmModal.onConfirm}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
