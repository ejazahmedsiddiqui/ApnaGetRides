import { apiClient } from "./index";

export const heroList = async () => {
    const response = await apiClient.get('/slider');
    return response.data;
};