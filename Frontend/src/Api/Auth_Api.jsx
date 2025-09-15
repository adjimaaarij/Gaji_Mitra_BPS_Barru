import useAxios, { BASE_URL } from "./Local_Api";
import axios from "axios";

// REGISTER
const SignUp = async (data) => {
    try {
        const response = await useAxios.post("/register", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// LOGIN
const Login = async (data) => {
    try {
        const response = await useAxios.post("/login", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// LOGOUT
const Logout = async () => {
    // URL perlu diperbaiki agar sesuai dengan rute backend
    return await useAxios.post("/log/logout");
};

export { Login, SignUp, Logout };