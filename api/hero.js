import { apiClient } from "./index";

export const heroList = async () => {
    console.log('@/api/hero/heroList ⟼ accessed');
    const response = await apiClient.get('/slider');
    return response.data;
};