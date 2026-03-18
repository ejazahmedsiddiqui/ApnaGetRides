import {useState} from 'react';
import {userLoginGetOtp, userLoginVerifyOtp} from "@/api";
type dataType = {
    otp: string,
    identifier : string,
    access_token: string,
    user : string,
    id: string,
    role : string,
}
type errorType = {
    message: string,
    status: string,
}

export const useOtpLogin = () => {
    const [data, setData] = useState <dataType | null>(null);
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<errorType |null>(null);
    const getOtp = async (identifier: string) => {
        setLoading(true);
        setError(null);
        try {
            const result: any = await userLoginGetOtp(identifier);
            if (result.success) {
                setIdentifier(identifier);
                setData(result.data);
            } else {
                setError({ message: result?.errorMessage || 'Unexpected error', status: result?.errorStatus || 0 });
            }
            return result.success;
        } catch (err: any) {
            setError({ message: err?.errorMessage || 'Unexpected error', status: err?.status || 0 });
            return false;
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (otp: string | number) => {
        setLoading(true);
        setError(null);
        try {
            const result: any = await userLoginVerifyOtp(identifier, otp);
            if (result.success) {
                setData(result.data);
            } else {
                setError(result.error);
            }
        } catch (err: any) {
            setError({ message: err?.message || 'Unexpected error', status: err?.status || 0 });
        } finally {
            setLoading(false);
        }
    };
    return {data, getOtp, verifyOtp, loading, error}
}