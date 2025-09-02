import useAxios from "./Local_Api";

// ================== SURVEI ==================
export const GetSurveis = async () => {
    try {
        const response = await useAxios.get("/log/survei", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });

        console.log("Raw response survei:", response.data);

        // handle case kalau backend return {data: [...]} atau langsung [...]
        return response.data.data || response.data;
    } catch (error) {
        console.error("Error GetSurveis:", error);
        throw error.response?.data || error.message;
    }
};


export const GetSurveiById = async (id) => {
    try {
        const response = await useAxios.get(`/log/survei/${id}`, {
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

export const CreateSurvei = async (data) => {
    try {
        const response = await useAxios.post("/log/survei", data, {
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

export const UpdateSurvei = async (id, data) => {
    try {
        const response = await useAxios.put(`/log/survei/${id}`, data, {
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

export const DeleteSurvei = async (id) => {
    try {
        const response = await useAxios.delete(`/log/survei/${id}`, {
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