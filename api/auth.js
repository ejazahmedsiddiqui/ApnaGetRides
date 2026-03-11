import apiClient from './client';

export const userLoginGetOtp = async (identifier) => {
    console.log('@/api/auth/userLoginGetOtp Accessed');
    try {
        console.log('Identifier is : ', identifier, typeof identifier);
        const response = await apiClient.post('/auth/send-otp', {identifier: identifier});
        return {success: true, data: response.data}
    } catch (error) {
        console.log('Error caught in userLogin try/catch ⟼ ', error);
        return {error}
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
        console.log('@/api/auth/userLoginVerifyOtp response is: ',response);
        return {success: true, data: response.data}
    } catch (error) {
        console.log('Error caught in userLogin try/catch ⟼ ', error);
        return {error}
    }
};


