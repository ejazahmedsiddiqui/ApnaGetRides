import apiClient from './client';

export const userLoginGetOtp = async (identifier) => {
    console.log('@/api/auth/userLoginGetOtp Accessed');
    try {
        console.log('Identifier is : ', identifier, typeof identifier);
        const response = await apiClient.post('/auth/send-otp', {identifier: identifier});
        return {success: true, data: response.data}
    } catch (error) {
        console.log('Error caught in userLogin try/catch ⟼ ', error);
        return {success: false, error}
    }
};

export const userLoginVerifyOtp = async (identifier, otp) => {
    console.log('@/api/auth/userLoginVerifyOtp Accessed');
    try {
        console.log('Identifier, OTP is : ', identifier, otp);
        const response = await apiClient.post('/auth/verify-otp', {
            identifier: identifier,
            otp: otp
        });
        return {success: true, data: response.data}
    } catch (error) {
        console.log('Error caught in userLogin try/catch ⟼ ', error);
        return {success: false, error}
    }
};

export const getUserProfile = async (token) => {
    console.log('@/api/auth/getUserProfile Accessed');
    try {
        const response = await apiClient.get('/auth/profile');
        return {success: true, data: response.data}
    } catch (error) {
        console.log('Error caught in getUserProfile try/catch ⟼ ', error);
        return {success: false, error}
    }
}

