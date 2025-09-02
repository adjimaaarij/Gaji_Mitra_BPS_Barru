import useAxios from "./Local_Api";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/log";

const SignUp = async (data) => {
  try {
    const response = await useAxios.post("/register", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const Login = async (data) => {
  try {
    const response = await useAxios.post("/login", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const Logout = async () => {
  const token = sessionStorage.getItem("token"); // ambil token

  return await axios.post(
    `${API_URL}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export { Login, SignUp, Logout };
