import useAxios from "./Local_Api";

export const GetSobat = async () => {
  try {
    const response = await useAxios.get('/log/sobat', {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    // kalau API langsung array:
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const GetSobatById = async (id) => {
    try {
        const response = await useAxios.get(`/log/sobat/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data.data;
    }
    catch (error) {
        throw error.response.data;
    }
};

export const CreateSobat = async (value) => {
    try {
        const response = await useAxios.post('/log/sobat', value, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response.data;
    }
};

export const UpdateSobat = async (id, values) => {
    try {
        const response = await useAxios.put(`/log/sobat/${id}`, values, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('Update error:', error.response?.data || error.message);
        throw error.response.data;
    }
};

export const DeleteSobat = async (id) => {
    try {
        const response = await useAxios.delete(`/log/sobat/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    }
    catch (error) {
        throw error.response.data;
    }
};
