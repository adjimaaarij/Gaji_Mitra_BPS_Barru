import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { GetHonors } from "../Api/Honor_Api";

// CDN Bootstrap
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

// Nama bulan untuk format tampilan
const namaBulan = [
  "",
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

function getBulanTahun(dateString) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  return `${namaBulan[d.getMonth() + 1]} ${d.getFullYear()}`;
}

const Honor = () => {
  const [honorList, setHonorList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [totalHonor, setTotalHonor] = useState(0);
  const [totalPulsa, setTotalPulsa] = useState(0);

  // Fetch data honor
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await GetHonors();
        const data = Array.isArray(res) ? res : res?.data || [];
        setHonorList(data);
      } catch (err) {
        console.error("Gagal fetch honor:", err);
      }
    };
    fetchData();
  }, []);

  // Filter & search
  const filtered = honorList
    .filter((h) => {
      const date = new Date(h.bulan);
      return (
        date.getMonth() + 1 === selectedMonth &&
        date.getFullYear() === selectedYear
      );
    })
    .filter((h) => {
      const term = searchTerm.toLowerCase();
      return (
        h.sobat?.nama?.toLowerCase().includes(term) ||
        h.id_sobat?.toString().includes(term) ||
        h.nilai_honor?.toString().includes(term) ||
        h.nilai_pulsa?.toString().includes(term)
      );
    });

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // filter sesuai bulan & tahun
    const filteredData = honorList.filter((h) => {
      const date = new Date(h.bulan);
      return (
        date.getMonth() + 1 === selectedMonth &&
        date.getFullYear() === selectedYear
      );
    });

    // hitung total honor & pulsa
    const honorSum = filteredData.reduce(
      (sum, h) => sum + Number(h.nilai_honor || 0),
      0
    );
    const pulsaSum = filteredData.reduce(
      (sum, h) => sum + Number(h.nilai_pulsa || 0),
      0
    );

    setTotalHonor(honorSum);
    setTotalPulsa(pulsaSum);
  };

  // Grouping data agar 1 mitra per bulan unik
  const grouped = filtered.reduce((acc, h) => {
    const key = `${h.id_sobat}-${new Date(h.bulan).getMonth()}-${new Date(
      h.bulan
    ).getFullYear()}`;
    if (!acc[key]) {
      acc[key] = {
        id_sobat: h.id_sobat,
        nama: h.sobat?.nama || "-",
        bulan: h.bulan,
        total_honor: 0,
        total_pulsa: 0,
      };
    }
    acc[key].total_honor += Number(h.nilai_honor || 0);
    acc[key].total_pulsa += Number(h.nilai_pulsa || 0);
    return acc;
  }, {});

  // Konversi object → array
  const groupedArray = Object.values(grouped);

  // Sorting sesuai pilihan
  const sorted = [...groupedArray].sort((a, b) => {
    if (!sortField) return 0;
    const valA = Number(a[`total_${sortField.split("_")[1]}`]) || 0;
    const valB = Number(b[`total_${sortField.split("_")[1]}`]) || 0;
    return sortOrder === "asc" ? valA - valB : valB - valA;
  });

  //     // Sorting
  //   const sorted = [...filtered].sort((a, b) => {
  //     if (!sortField) return 0;
  //     const valA = Number(a[sortField]) || 0;
  //     const valB = Number(b[sortField]) || 0;
  //     return sortOrder === "asc" ? valA - valB : valB - valA;
  //   });

  // Export
  const handleExport = () => {
    if (sorted.length === 0) {
      alert("Tidak ada data untuk diexport!");
      return;
    }
    const dataToExport = sorted.map((h) => ({
      "ID Sobat": h.id_sobat,
      "Nama Sobat": h.nama || "-",
      Bulan: getBulanTahun(h.bulan),
      "Total Honor": h.total_honor,
      "Total Pulsa": h.total_pulsa,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Honor");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      `Honor_${selectedMonth}-${selectedYear}.xlsx`
    );
  };

  return (
    <>
      <BootstrapCDN />
      <style>{`
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
      `}</style>

      <div className="container-fluid py-5">
        {/* Header */}
        <div className="container bg-white p-4 rounded shadow">
          <header className="bps-header p-4 text-center">
            <h1 className="display-4 mb-2">Laporan Bulanan Honor(Mitra)</h1>
            <p>Monitoring honor & pulsa bulanan Sobat(Mitra)</p>
          </header>

          {/* Filter */}
          <div className="p-4 rounded shadow mb-2">
            <form onSubmit={handleFormSubmit} className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Bulan</label>
                <select
                  className="form-select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {namaBulan.map(
                    (b, i) =>
                      i > 0 && (
                        <option key={i} value={i}>
                          {b}
                        </option>
                      )
                  )}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Tahun</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  min="2000"
                  max="2100"
                />
              </div>
            </form>
          </div>

          <div className="p-4 rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h4 fw-bold text-bps-blue m-0">
                Data Sobat Bulanan
              </h2>

              <div>
                <div className="d-flex gap-2 align-items-center mb-1">
                  <select
                    className="form-select"
                    value={sortField || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "nilai_honor" || val === "nilai_pulsa") {
                        setSortField(val);
                        setSortOrder("desc"); // default urutkan terbesar
                      } else {
                        setSortField(null);
                      }
                    }}
                  >
                    <option value="nilai_honor">Urutkan Honor Tertinggi</option>
                    <option value="nilai_pulsa">Urutkan Pulsa Tertinggi</option>
                  </select>

                  <button className="btn btn-success" onClick={handleExport}>
                    Export Excel
                  </button>
                </div>

                {/* Input search dipindah ke bawah */}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari Sobat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table */}

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-primary">
                <tr>
                  <th>ID Sobat</th>
                  <th>Nama Sobat</th>
                  <th>Bulan</th>
                  <th
                    onClick={() => {
                      setSortField("nilai_honor");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Honor{" "}
                    {sortField === "nilai_honor"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </th>
                  <th
                    onClick={() => {
                      setSortField("nilai_pulsa");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Pulsa{" "}
                    {sortField === "nilai_pulsa"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.length > 0 ? (
                  sorted.map((h, idx) => {
                    let cellHonor = "";
                    let cellPulsa = "";

                    // aturan honor
                    if (h.total_honor >= 3480000) {
                      cellHonor = "text-soft-danger fw-bold"; // merah
                    }
                    if (h.total_honor <= 3479999 && h.total_honor >= 2999999) {
                      cellHonor = "text-soft-yellow fw-bold"; // kuning
                    }

                    // aturan pulsa
                    if (h.total_pulsa >= 150000) {
                      cellPulsa = "text-soft-danger fw-bold"; // merah
                    }
                    if (h.total_pulsa <= 149999 && h.total_pulsa >= 100000) {
                      cellPulsa = "text-soft-yellow fw-bold"; // kuning
                    }

                    return (
                      <tr key={idx}>
                        <td>{h.id_sobat}</td>
                        <td>{h.nama}</td>
                        <td>{getBulanTahun(h.bulan)}</td>
                        <td className={cellHonor}>
                          Rp {h.total_honor.toLocaleString("id-ID")}
                        </td>
                        <td className={cellPulsa}>
                          Rp {h.total_pulsa.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Tidak ada data honor bulan ini
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

export default Honor;
