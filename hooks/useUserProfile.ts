import { useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { getUserProfile, updateUserProfile, updateUserProfilePicture } from "@/api/auth";
import { useUser } from "@/context/UserContext";

const SECURE_KEYS = { TOKEN: "userToken" } as const;

interface UserProfileData {
    name: string | null;
    email: string | null;
    gender: string | null;
    phone: string | null;
    profilePicture: string | null;
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
}

interface HookState<T> {
    data: T;
    loading: boolean;
    error: { errorMessage: string; errorStatus: number } | null;
}

interface EditPayload {
    name: string;
    email: string;
    gender: string;
    phone: string;
}

// ─── Helper: get token or return null ────────────────────────────────────────
const getToken = async () => SecureStore.getItemAsync(SECURE_KEYS.TOKEN);

// ─── Fetch profile ────────────────────────────────────────────────────────────
export const useGetUserProfile = () => {
    const { logout } = useUser();

    const [state, setState] = useState<HookState<UserProfileData>>({
        data: {
            name: null,
            email: null,
            gender: null,
            phone: null,
            profilePicture: null,
            isEmailVerified: false,
            isPhoneVerified: false,
        },
        loading: false,
        error: null,
    });

    const fetchProfile = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const token = await getToken();
        if (!token) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: { errorMessage: "Auth token not found. Please login and try again.", errorStatus: 401 },
            }));
            logout();
            return;
        }

        const result = await getUserProfile();

        if (!result.success) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: { errorMessage: "Failed to fetch profile. Please try again.", errorStatus: 500 },
            }));
            return;
        }

        const p = result.data;
        setState({
            data: {
                name: p.name ?? null,
                email: p.email ?? null,
                gender: p.gender ?? null,
                phone: p.phone ?? null,
                profilePicture: p.profilePicture ?? null,
                isEmailVerified: p.isEmailVerified ?? false,
                isPhoneVerified: p.isPhoneVerified ?? false,
            },
            loading: false,
            error: null,
        });
    }, [logout]);

    return { profile: state.data, loading: state.loading, error: state.error, fetchProfile };
};

// ─── Edit profile (text fields only, no image) ────────────────────────────────
export const useEditUserProfile = () => {
    const { logout, refreshProfile } = useUser();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ errorMessage: string; errorStatus: number } | null>(null);
    const [success, setSuccess] = useState(false);

    const editProfile = useCallback(async (payload: EditPayload) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const token = await getToken();
        if (!token) {
            setError({ errorMessage: "Auth token not found. Please login and try again.", errorStatus: 401 });
            setLoading(false);
            logout();
            return false;
        }

        const result = await updateUserProfile(payload);

        if (!result.success) {
            setError({
                errorMessage: "Failed to update profile. Please try again.",
                errorStatus: result.error?.status ?? 500,
            });
            setLoading(false);
            return false;
        }

        await refreshProfile();
        setSuccess(true);
        setLoading(false);
        return true;
    }, [logout, refreshProfile]);

    return { editProfile, loading, error, success };
};

// ─── Upload profile picture (separate API) ────────────────────────────────────
export const useUploadProfilePicture = () => {
    const { logout, refreshProfile } = useUser();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ errorMessage: string; errorStatus: number } | null>(null);

    const uploadPicture = useCallback(async (imageUri: string) => {
        setLoading(true);
        setError(null);

        const token = await getToken();
        if (!token) {
            setError({ errorMessage: "Auth token not found. Please login and try again.", errorStatus: 401 });
            setLoading(false);
            logout();
            return false;
        }

        // Build the file object that FormData expects for React Native
        const filename = imageUri.split('/').pop() ?? 'photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const mimeType = match ? `image/${match[1] === 'jpg' ? 'jpeg' : match[1]}` : 'image/jpeg';

        const filePayload = {
            uri: imageUri,
            name: filename,
            type: mimeType,
        } as any;

        const result = await updateUserProfilePicture(filePayload);

        if (!result.success) {
            setError({
                errorMessage: "Failed to upload photo. Please try again.",
                errorStatus: result.error?.status ?? 500,
            });
            setLoading(false);
            return false;
        }

        // Sync context so the avatar updates everywhere
        await refreshProfile();
        setLoading(false);
        return true;
    }, [logout, refreshProfile]);

    return { uploadPicture, loading, error };
};