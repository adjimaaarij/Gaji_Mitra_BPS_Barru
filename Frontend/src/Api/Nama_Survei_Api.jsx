import useAxios from "./Local_Api";

// ================== NAMA SURVEI ==================
export const GetNamaSurveis = async () => {
    try {
        const response = await useAxios.get("/nama_survei", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });

        console.log("Raw response nama_survei:", response.data);

        // fallback kalau backend tidak selalu punya key "data"
        return response.data.data || response.data;
    } catch (error) {
        console.error("Error GetNamaSurveis:", error);
        throw error.response?.data || error.message;
    }
};

export const GetNamaSurveiById = async (id) => {
    try {
        const response = await useAxios.get(`/nama_survei/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data.data;
    } catch (error) {
        console.error("Error GetNamaSurveiById:", error);
        throw error.response?.data || error.message;
    }
};

export const CreateNamaSurvei = async (data) => {
    try {
        const response = await useAxios.post("/nama_survei", data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error CreateNamaSurvei:", error);
        throw error.response?.data || error.message;
    }
};

export const UpdateNamaSurvei = async (id, data) => {
    try {
        const response = await useAxios.put(`/nama_survei/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error UpdateNamaSurvei:", error);
        throw error.response?.data || error.message;
    }
};

export const DeleteNamaSurvei = async (id) => {
    try {
        const response = await useAxios.delete(`/nama_survei/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error DeleteNamaSurvei:", error);
        throw error.response?.data || error.message;
    }
};
