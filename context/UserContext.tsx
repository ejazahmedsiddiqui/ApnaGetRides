import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { createMMKV } from "react-native-mmkv";
import * as SecureStore from "expo-secure-store";
import { getUserProfile, userLoginVerifyOtp } from "@/api/auth";

const storage = createMMKV({ id: 'user-storage' });

// Types
interface UserState {
    phone: string | null;
    gender: string | null;
    email: string | null;
    fullName: string | null;
    profilePicture: string | null;
    isAuthenticated: boolean;
}

interface LoginResult {
    success: boolean;
    error?: any;
    errorMessage?: string;
    errorStatus?: number;
}

interface UserContextType extends UserState {
    login: (phone: string, otp: string) => Promise<LoginResult>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    isLoading: boolean,
    message: string
}
const SECURE_KEYS = { TOKEN: "userToken" } as const;
const STORAGE_KEYS = {
    PHONE: "userPhone",
    GENDER: "userGender",
    EMAIL: "userEmail",
    FULL_NAME: "userFullName",
    PROFILE_PICTURE: "userProfilePicture",
} as const;

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserState>({
        phone: null,
        gender: null,
        email: null,
        fullName: null,
        profilePicture: null,
        isAuthenticated: false,
    });

    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // 1. Initial Load Logic
    const loadStorageData = useCallback(async () => {
        setMessage('Loading User Data...');
        setIsLoading(true)
        try {
            const token = await SecureStore.getItemAsync(SECURE_KEYS.TOKEN);
            const phone = storage.getString(STORAGE_KEYS.PHONE);

            if (token && phone) {
                setUser({
                    phone,
                    gender: storage.getString(STORAGE_KEYS.GENDER) ?? null,
                    email: storage.getString(STORAGE_KEYS.EMAIL) ?? null,
                    fullName: storage.getString(STORAGE_KEYS.FULL_NAME) ?? null,
                    profilePicture: storage.getString(STORAGE_KEYS.PROFILE_PICTURE) ?? null,
                    isAuthenticated: true,
                });
            } else {
                setUser(prev => ({ ...prev, isAuthenticated: false, }));
            }
        } catch (e) {
            setUser(prev => ({ ...prev, isAuthenticated: false}));
        } finally {
            setMessage('');
            setIsLoading(false)
        }
    }, []);

    useEffect(() => {
        loadStorageData();
    }, [loadStorageData]);

    // Login Workflow: Verify OTP -> Save Token -> Fetch Profile -> Save Profile
    const login = async (phone: string, otp: string) => {
        setIsLoading(true)
        try {
            setMessage('Verifying OTP');
            const authResult = await userLoginVerifyOtp(phone, otp);

            if (!authResult.success) return { success: false, errorMessage: authResult.errorMessage, errorStatus: authResult.errorStatus };

            const token = authResult.data.access_token; // Assuming your API returns { token: "..." }
            await SecureStore.setItemAsync(SECURE_KEYS.TOKEN, token);
            storage.set(STORAGE_KEYS.PHONE, phone);

            // Fetch profile immediately after token is secured
            setMessage('Fetching Profile');
            const profileResult = await getUserProfile(token);
            if (profileResult.success) {
                const p = profileResult.data;

                // Save to MMKV
                if (p.gender) storage.set(STORAGE_KEYS.GENDER, p.gender);
                if (p.email) storage.set(STORAGE_KEYS.EMAIL, p.email);
                if (p.name) storage.set(STORAGE_KEYS.FULL_NAME, p.name);
                if (p.profilePicture) storage.set(STORAGE_KEYS.PROFILE_PICTURE, p.profilePicture);

                setUser({
                    phone,
                    gender: p.gender || null,
                    email: p.email || null,
                    fullName: p.name || null,
                    profilePicture: p.profilePicture || null,
                    isAuthenticated: true,
                });
                return { success: true };
            }
            return { success: false, error: "Failed to fetch profile" };
        } catch (error) {
            console.error("Login Error:", error);
            return { success: false, error };
        } finally {
            setIsLoading(false)
            setMessage('')
        }
    };

    const logout = async () => {
        setIsLoading(true)
        await SecureStore.deleteItemAsync(SECURE_KEYS.TOKEN);
        storage.clearAll();
        setUser({
            phone: null,
            gender: null,
            email: null,
            fullName: null,
            profilePicture: null,
            isAuthenticated: false,
        });
        setIsLoading(false)
    };

    const refreshProfile = async () => {
        const token = await SecureStore.getItemAsync(SECURE_KEYS.TOKEN);
        if (!token) return;
        const res = await getUserProfile(token);
        if (res.success) {
            // Update state and storage logic here...
        }
    };

    return (
        <UserContext.Provider value={{ ...user, login, logout, refreshProfile, isLoading, message }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
};