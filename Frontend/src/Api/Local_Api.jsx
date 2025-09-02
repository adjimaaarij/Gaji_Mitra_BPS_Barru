import axios from "axios";

export const BASE_URL = "http://127.0.0.1:8000";

const useAxios = axios.create({
    baseURL: `${BASE_URL}/api`,
});


// // ================== PERIODE ==================
// export const getPeriodes = () => useAxios.get("/periode");
// export const getPeriodeById = (id) => useAxios.get(`/periode/${id}`);
// export const createPeriode = (data) => useAxios.post("/periode", data);
// export const updatePeriode = (id, data) => useAxios.put(`/periode/${id}`, data);
// export const deletePeriode = (id) => useAxios.delete(`/periode/${id}`);

// // ================== HONOR ==================
// export const getHonors = () => useAxios.get("/honor");
// export const getHonorById = (id) => useAxios.get(`/honor/${id}`);
// export const createHonor = (data) => useAxios.post("/honor", data);
// export const updateHonor = (id, data) => useAxios.put(`/honor/${id}`, data);
// export const deleteHonor = (id) => useAxios.delete(`/honor/${id}`);

// // ================== SURVEI ==================
// export const getSurveis = () => useAxios.get("/survei");
// export const getSurveiById = (id) => useAxios.get(`/survei/${id}`);
// export const createSurvei = (data) => useAxios.post("/survei", data);
// export const updateSurvei = (id, data) => useAxios.put(`/survei/${id}`, data);
// export const deleteSurvei = (id) => useAxios.delete(`/survei/${id}`);

// // ================== Sobat ===================
// export const getSobats = () => useAxios.get("/sobat");
// export const getSobatById = (id) => useAxios.get(`/sobat/${id}`);
// export const createSobat = (data) => useAxios.post("/sobat", data);
// export const updateSobat = (id, data) => useAxios.put(`/sobat/${id}`, data);
// export const deleteSobat = (id) => useAxios.delete(`/sobat/${id}`);

export default useAxios;
