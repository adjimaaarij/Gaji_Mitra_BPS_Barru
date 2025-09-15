import axios from "axios";

export const BASE_URL = "https://barru.stat7300.net/Manajamen_gaji_mitra/Backend";
// export const BASE_URL = "http://127.0.0.1:8000"; // Komentar ini atau hapus

const useAxios = axios.create({
    baseURL: `${BASE_URL}/api`,
    withCredentials: true,
});

// Add a request interceptor to attach the auth token
useAxios.interceptors.request.use(
    (config) => {
        // Get the token from sessionStorage
        const token = sessionStorage.getItem("token");

        // If a token exists, add it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default useAxios;