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
export const useOtpLogin = () => {
    const [data, setData] = useState <dataType | null>(null);
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getOtp = async (identifier: string) => {
        setLoading(true);
        setError(null);

        const result: any = await userLoginGetOtp(identifier);
        if (result.success) {
            setIdentifier(identifier)
            setData(result.data);
        } else {
            setError(result.error)
        }
        setLoading(false);
    };
    const verifyOtp = async (otp: string|number) => {
        setLoading(true);
        setError(null);
        const result: any = await
            userLoginVerifyOtp(identifier, otp);
        if (result.success) {
            setData(result.data);
        } else {
            setError(result.error)
        }
        setLoading(false)
    }
    return {data, getOtp, verifyOtp, loading, error}
}