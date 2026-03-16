import { apiClient } from "./index";

export const heroList = async () => {
    try {
        const response = await apiClient.get('/slider');
        const isSuccess = response.status >= 200 && response.status <= 299;
        if (isSuccess) {
            console.log('Hero list fetched successfully');
            return { success: true, data: response.data };
        } else {
            console.error('Hero list fetch failed:', response.status);
            return { success: false, data: null };
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Hero list fetch error:', error.message);
        }
        return { success: false, data: null, error: error.message };
    }
};