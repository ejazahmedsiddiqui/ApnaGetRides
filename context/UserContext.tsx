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
    profileImage: string | null;
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
    PROFILE_IMAGE: "userProfilePicture",
} as const;

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserState>({
        phone: null,
        gender: null,
        email: null,
        fullName: null,
        profileImage: null,
        isAuthenticated: false,
    });

    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    console.log('@/context/UserContext Accessed.');

    // 1. Initial Load Logic
    const loadStorageData = useCallback(async () => {
        setMessage('Loading User Data...');
        setIsLoading(true);
        try {
            const token = await SecureStore.getItemAsync(SECURE_KEYS.TOKEN);
            const phone = storage.getString(STORAGE_KEYS.PHONE);

            if (token && phone) {
                setUser({
                    phone,
                    gender: storage.getString(STORAGE_KEYS.GENDER) ?? null,
                    email: storage.getString(STORAGE_KEYS.EMAIL) ?? null,
                    fullName: storage.getString(STORAGE_KEYS.FULL_NAME) ?? null,
                    profileImage: storage.getString(STORAGE_KEYS.PROFILE_IMAGE) ?? null,
                    isAuthenticated: true,
                });
            } else {
                setUser(prev => ({ ...prev, isAuthenticated: false }));
            }
        } catch (e) {
            setUser(prev => ({ ...prev, isAuthenticated: false }));
        } finally {
            setMessage('');
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStorageData();
    }, [loadStorageData]);

    // Login Workflow: Verify OTP -> Save Token -> Fetch Profile -> Save Profile
    const login = async (phone: string, otp: string): Promise<LoginResult> => {
        setIsLoading(true);
        try {
            setMessage('Verifying OTP');
            const authResult = await userLoginVerifyOtp(phone, otp);

            if (!authResult.success) {
                return { success: false, errorMessage: authResult.errorMessage, errorStatus: authResult.errorStatus };
            }

            const token = authResult.data.access_token;
            await SecureStore.setItemAsync(SECURE_KEYS.TOKEN, token);
            storage.set(STORAGE_KEYS.PHONE, phone);

            setMessage('Fetching Profile');
            const profileResult = await getUserProfile();
            if (!profileResult.success) {
                return { success: false, errorMessage: "Failed to fetch profile" };
            }

            const p = profileResult.data;
            console.log('Profile Fetched is: ',p)
            if (p.gender) storage.set(STORAGE_KEYS.GENDER, p.gender);
            if (p.email) storage.set(STORAGE_KEYS.EMAIL, p.email);
            if (p.name) storage.set(STORAGE_KEYS.FULL_NAME, p.name);
            if (p.profileImage) storage.set(STORAGE_KEYS.PROFILE_IMAGE, p.profileImage);

            setUser({
                phone,
                gender: p.gender || null,
                email: p.email || null,
                fullName: p.name || null,
                profileImage: p.profileImage || null,
                isAuthenticated: true,
            });
            return { success: true };
        } catch (error) {
            console.error("Login Error:", error);
            return { success: false, error };
        } finally {
            setIsLoading(false);
            setMessage('');
        }
    };

    const logout = async () => {
        setIsLoading(true);
        setMessage('Logging Out...');
        await SecureStore.deleteItemAsync(SECURE_KEYS.TOKEN);
        storage.clearAll();
        setMessage('Cleared Credentials...');
        setUser({
            phone: null,
            gender: null,
            email: null,
            fullName: null,
            profileImage: null,
            isAuthenticated: false,
        });
        setMessage('');
        setIsLoading(false);
    };

    // Refetches from server, updates both MMKV and React state
    const refreshProfile = useCallback(async () => {
        const token = await SecureStore.getItemAsync(SECURE_KEYS.TOKEN);
        console.log('Token is: ', token)
        if (!token) return;

        setIsLoading(true);
        setMessage('Refreshing profile...');

        try {
            const res = await getUserProfile();
            if (!res.success) return;

            const p = res.data;
            console.log('Profile Fetched is: ',p)
            // Persist fresh values to MMKV (only overwrite if server returned a value)
            if (p.gender) storage.set(STORAGE_KEYS.GENDER, p.gender);
            if (p.email) storage.set(STORAGE_KEYS.EMAIL, p.email);
            if (p.name) storage.set(STORAGE_KEYS.FULL_NAME, p.name);
            if (p.profileImage) storage.set(STORAGE_KEYS.PROFILE_IMAGE, p.profileImage);

            // Sync React state so every consumer re-renders with fresh data
            setUser(prev => ({
                ...prev,
                gender: p.gender ?? prev.gender,
                email: p.email ?? prev.email,
                fullName: p.name ?? prev.fullName,
                profileImage: p.profileImage ?? prev.profileImage,
            }));
        } catch (e) {
            console.error('refreshProfile error:', e);
        } finally {
            setMessage('');
            setIsLoading(false);
        }
    }, []);

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