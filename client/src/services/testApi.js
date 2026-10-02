import api from "./api.js";

export const testApi = async () => {
    const response = await api.get("/jobs");

    return response.data;
};