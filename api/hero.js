import {apiClient} from "./index";

export const heroList = async () => {
    console.log('@/api/heroList accessed');
    try {
        const response = await apiClient.get('/slider');
        if (299 >= response.status <= 200) {
            console.log('Hero list fetched successfully');
        } else {
            console.error('Hero list fetch failed:', response.status);
        }
        return {success: true, data: response.data};
    } catch (error) {
        console.log(error)
    }
};
