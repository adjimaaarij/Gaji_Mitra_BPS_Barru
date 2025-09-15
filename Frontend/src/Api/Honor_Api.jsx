import useAxios from "./Local_Api";

// ================== HONOR ==================
export const GetHonors = async () => {
    try {
        const response = await useAxios.get("/honor", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });

        console.log("Raw response honor:", response.data);

        // fallback kalau backend tidak selalu punya key "data"
        return response.data.data || response.data;
    } catch (error) {
        console.error("Error GetHonors:", error);
        throw error.response?.data || error.message;
    }
};


export const GetHonorById = async (id) => {
    try {
        const response = await useAxios.get(`/honor/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const CreateHonor = async (data) => {
    try {
        const response = await useAxios.post("/honor", data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const UpdateHonor = async (id, data) => {
    try {
        const response = await useAxios.put(`/honor/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const DeleteHonor = async (id) => {
    try {
        const response = await useAxios.delete(`/honor/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};