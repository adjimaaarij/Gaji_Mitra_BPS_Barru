import useAxios from "./Local_Api";

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${sessionStorage.getItem("token")}`,
});

// ✅ Get all tim_survei
export const GetTimSurvei = async () => {
  try {
    const response = await useAxios.get("/tim_survei", { headers: headers() });
    console.log("Raw responses tim_survei:", response.data);
    return response.data?.data ?? []; // selalu array
  } catch (error) {
    console.error("Error fetching tim_survei:", error);
    throw error.response?.data || error.message;
  }
};

// ✅ Get tim_survei by ID
export const GetTimSurveisById = async (id) => {
  try {
    const response = await useAxios.get(`/tim_survei/${id}`, { headers: headers() });
    console.log("Raw responses tim_survei by ID:", response.data);
    return response.data?.data ?? null; // objek / null
  } catch (error) {
    console.error("Error fetching tim_survei by ID:", error);
    throw error.response?.data || error.message;
  }
};

// ✅ Create tim_survei
export const CreateTimSurvei = async (data) => {
  try {
    const response = await useAxios.post("/tim_survei", data, { headers: headers() });
    console.log("Raw responses tim_survei create:", response.data);
    return response.data?.data ?? null;
  } catch (error) {
    console.error("Error creating tim_survei:", error);
    throw error.response?.data || error.message;
  }
};

// ✅ Update tim_survei
export const UpdateTimSurvei = async (id, data) => {
  try {
    const response = await useAxios.put(`/tim_survei/${id}`, data, { headers: headers() });
    console.log("Raw responses tim_survei update:", response.data);
    return response.data?.data ?? null;
  } catch (error) {
    console.error("Error updating tim_survei:", error);
    throw error.response?.data || error.message;
  }
};

// ✅ Delete tim_survei
export const DeleteTimSurvei = async (id) => {
  try {
    const response = await useAxios.delete(`/tim_survei/${id}`, { headers: headers() });
    console.log("Raw responses tim_survei delete:", response.data);
    return response.data?.data ?? null;
  } catch (error) {
    console.error("Error deleting tim_survei:", error);
    throw error.response?.data || error.message;
  }
};
