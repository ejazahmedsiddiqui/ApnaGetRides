import apiClient from './client';

export const userLoginGetOtp = async (identifier) => {
    console.log('@/api/auth/userLoginGetOtp Accessed');
    try {
        console.log('Identifier is : ', identifier, typeof identifier);
        const response = await apiClient.post('/auth/send-otp', {identifier: identifier});
        console.log('OTP is: ', response.data)
        return {success: true, data: response.data}
    } catch (error) {
        console.log('Error caught in userLogin try/catch ⟼ ', error);
        return {success: false, errorMessage: error.message, errorStatus: error.status};
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
        console.log('@/api/auth/userLoginVerifyOtp response data is: ', response.data)
        return {success: true, data: response.data}
    } catch (error) {
        console.log('Error caught in userLogin try/catch ⟼ ', error.data);
        return {success: false, errorMessage: error.message, errorStatus: error.status }
    }
};

export const getUserProfile = async () => {
    console.log('@/api/auth/getUserProfile Accessed');
    try {
        const response = await apiClient.get('/auth/profile');
        return {success: true, data: response.data, token: response.data.access_token}
    } catch (error) {
        console.log('Error caught in getUserProfile try/catch ⟼ ', error);
        return {success: false, error}
    }
}

export const updateUserProfile = async (userData) => {
    console.log('@/api/auth/updateUserProfile Accessed');
    const formData = new FormData();
    if(userData.name) formData.append('name', userData.name);
    if(userData.email) formData.append('email', userData.email);
    if(userData.gender) formData.append('gender', userData.gender);
    if(userData.phone) formData.append('phone', userData.phone);
    if(userData.image) formData.append('profilePicture', userData.image);
    console.log(formData)
    try {
        const response = await apiClient.patch('/auth/profile', formData);
        return { success: true, data: response.data, token: response.data.access_token }
    } catch (error) {
        console.log('@/api/auth/updateUserProfile ⟼ an error occurred: ', error);
        return { success: false, error: error.data}
    }
}

