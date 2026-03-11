import axios, {InternalAxiosRequestConfig} from "axios";
import * as Application from 'expo-application';
import {Platform} from "react-native";
import {createMMKV} from "react-native-mmkv";

//mmkv storage wrapper
export const storage = createMMKV();

const BASE_URL = process.env.EXPO_PUBLIC_API
console.log('baseURL', BASE_URL);
const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// let logoutHandler = null;
//
// let isLoggingOut = false;
//
// export const setLogoutHandler = (handler: any) => {
//     logoutHandler = handler;
// };
// export const setIsLoggingOut = (value: any) => {
//     isLoggingOut = value;
// };

apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const appName: string | null = 'Apna GetRide';
        const appVersion = Application.nativeApplicationVersion ?? null;
        const osVersion = Platform.Version;

        config.headers['User-Agent'] = `${appName}/${appVersion} (${Platform.OS}; ${osVersion})`;
        config.headers['Accept'] = 'application/json';
        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }
        console.log('@api/client.js apiClient.interceptors.request.use accessed');
        try {
            if (storage.contains('token')) {
                console.tron.log('User token found. ')
                const token = storage.getString('token');
                config.headers.Authorization = `Bearer ${token}`;
                config.headers.Accept = 'application/json';
            }
            // ==========================================
            // REACTOTRON LOGGING - REQUEST
            // ==========================================
            if (console.tron) {
                console.tron.display({
                    name: '📤 API REQUEST',
                    preview: `${config.method?.toUpperCase()} ${config.url}`,
                    value: {
                        method: config.method?.toUpperCase(),
                        url: `${config.baseURL}${config.url}`,
                        headers: {
                            ...config.headers,
                            Authorization: config.headers.Authorization
                                ? 'Bearer ***' + String(config.headers.Authorization).slice(-10)
                                : undefined
                        },
                        data: config.data instanceof FormData ? '📦 FormData (see below)' : config.data,
                    },
                });

                if (config.data instanceof FormData) {
                    const formDataContents = [];

                    try {
                        for (let pair of (config.data as any)._parts) {
                            const [key, value] = pair;

                            if (typeof value === 'object' && value !== null && value.uri) {
                                formDataContents.push({
                                    key,
                                    type: '📎 FILE',
                                    uri: value.uri?.substring(0, 80) + '...',
                                    name: value.name,
                                    mimeType: value.type,
                                });
                            } else {
                                formDataContents.push({
                                    key,
                                    value: value,
                                });
                            }
                        }

                        console.tron.display({
                            name: '📦 FORMDATA CONTENTS',
                            preview: `${formDataContents.length} fields`,
                            value: formDataContents,
                            important: true,
                        });
                    } catch (e) {
                        console.tron.error('Failed to parse FormData', e);
                    }
                }
            }
        } catch (error) {
            console.error('Error adding auth token:', error);

            if (console.tron) {
                console.tron.error(error, '❌ Request Interceptor Error');
            }
        }

        return config;
    },
    (error) => {
        if (console.tron) {
            console.tron.error(error, '❌ Request Setup Error');
        }
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use((response) => {
    console.log('@api/client.js apiClient.interceptors.response.use accessed');
    return response

}, async (error) => {
    console.log('@api/client.js apiClient.interceptors.response.use has an error', error);
    // ==========================================
    // REACTOTRON LOGGING - ERROR RESPONSE
    // ==========================================
    if (console.tron) {
        const errorInfo = {
            status: error.response?.status || 'Network Error',
            url: error.config?.url || 'Unknown URL',
            message: error.message,
            responseData: error.response?.data,
            requestData: error.config?.data instanceof FormData
                ? '📦 FormData was sent'
                : error.config?.data,
        };

        console.tron.display({
            name: '❌ API ERROR',
            preview: `${errorInfo.status} ${errorInfo.url}`,
            value: errorInfo,
            important: true,
        });

        // If it's a 401 error, highlight it
        if (error.response?.status === 401) {
            console.tron.display({
                name: '🚨 AUTHENTICATION ERROR',
                preview: 'Session expired or invalid token',
                value: {
                    status: 401,
                    message: error.response?.data?.message,
                    action: 'Logging out user...',
                },
                important: true,
            });
        }
    }
    if (error.response) {
        const {status, data} = error.response;
        console.log('@/api/client.js → apiClient.interceptors.response.use error.response: error: ', error);
        return Promise.reject({
            status,
            message: data?.message || data?.error || 'Something went wrong',
            errors: data?.errors,
            data: data
        });
    } else if (error.request) {
        return Promise.reject({
            status: 0,
            message: 'Network error. Please check your connection.'
        });
    } else {
        return Promise.reject({
            status: 0,
            message: error.message || 'An unexpected error occurred'
        });
    }
});
export default apiClient;