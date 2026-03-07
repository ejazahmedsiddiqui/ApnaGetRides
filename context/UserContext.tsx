import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Types
interface UserState {
    phone: string | null;
    token: string | null;
    gender: string | null;
    email: string | null;
    fullName: string | null;
    profilePicture: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface UserContextType extends UserState {
    login: (phone: string, token: string) => Promise<{ success: boolean; data: string }>;
    logout: () => Promise<{ success: boolean }>;
    updateToken: (newToken: string) => Promise<void>;
    updateProfile: (profile: Partial<Pick<UserState, "gender" | "email" | "fullName" | "profilePicture">>) => Promise<void>;
}

interface UserProviderProps {
    children: ReactNode;
}

const STORAGE_KEYS = {
    PHONE: "userPhone",
    TOKEN: "userToken",
    GENDER: "userGender",
    EMAIL: "userEmail",
    FULL_NAME: "userFullName",
    PROFILE_PICTURE: "userProfilePicture",
} as const;

// Context
const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<UserState>({
        phone: null,
        token: null,
        gender: null,
        email: null,
        fullName: null,
        profilePicture: null,
        isAuthenticated: false,
        isLoading: true,
    });

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async (): Promise<void> => {
        try {
            const [storedPhone, storedToken, storedGender, storedEmail, storedFullName, storedProfilePicture] =
                await AsyncStorage.multiGet(Object.values(STORAGE_KEYS));

            const phone = storedPhone[1];
            const token = storedToken[1];

            if (phone && token) {
                setUser({
                    phone,
                    token,
                    gender: storedGender[1],
                    email: storedEmail[1],
                    fullName: storedFullName[1],
                    profilePicture: storedProfilePicture[1],
                    isAuthenticated: true,
                    isLoading: false,
                });
            } else {
                setUser((prev) => ({ ...prev, isLoading: false }));
            }
        } catch (error) {
            console.error("Error loading user data:", error);
            setUser((prev) => ({ ...prev, isLoading: false }));
        }
    };

    const login = async (phone: string, token: string): Promise<{ success: boolean; data: string }> => {
        try {
            await AsyncStorage.multiSet([
                [STORAGE_KEYS.PHONE, phone],
                [STORAGE_KEYS.TOKEN, token],
            ]);

            setUser((prev) => ({
                ...prev,
                phone,
                token,
                isAuthenticated: true,
                isLoading: false,
            }));
            return { success: true, data: token };
        } catch (error) {
            console.error("Error saving user data:", error);
            throw error;
        }
    };

    const logout = async (): Promise<{ success: boolean }> => {
        try {
            await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));

            setUser({
                phone: null,
                token: null,
                gender: null,
                email: null,
                fullName: null,
                profilePicture: null,
                isAuthenticated: false,
                isLoading: false,
            });
            return { success: true };
        } catch (error) {
            console.error("Error clearing user data:", error);
            throw error;
        }
    };

    const updateToken = async (newToken: string): Promise<void> => {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
            setUser((prev) => ({ ...prev, token: newToken }));
        } catch (error) {
            console.error("Error updating token:", error);
            throw error;
        }
    };

    const updateProfile = async (
        profile: Partial<Pick<UserState, "gender" | "email" | "fullName" | "profilePicture">>
    ): Promise<void> => {
        try {
            const storageMap: Record<string, string> = {
                gender: STORAGE_KEYS.GENDER,
                email: STORAGE_KEYS.EMAIL,
                fullName: STORAGE_KEYS.FULL_NAME,
                profilePicture: STORAGE_KEYS.PROFILE_PICTURE,
            };

            const pairs = Object.entries(profile)
                .filter(([, value]) => value !== undefined && value !== null)
                .map(([key, value]) => [storageMap[key], value as string] as [string, string]);

            if (pairs.length > 0) {
                await AsyncStorage.multiSet(pairs);
            }

            setUser((prev) => ({ ...prev, ...profile }));
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    };

    const value: UserContextType = {
        phone: user.phone,
        token: user.token,
        gender: user.gender,
        email: user.email,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
        isAuthenticated: user.isAuthenticated,
        isLoading: user.isLoading,
        login,
        logout,
        updateToken,
        updateProfile,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export default UserContext;