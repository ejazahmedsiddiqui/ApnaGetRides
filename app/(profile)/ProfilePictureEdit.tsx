import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "react-native-zustand-theme";
import { useEffect, useMemo, useState } from "react";
import { Pen, ChevronLeft, Check } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetUserProfile, useEditUserProfile, useUploadProfilePicture } from "@/hooks/useUserProfile";
import * as ImagePicker from 'expo-image-picker';

const ProfilePictureEdit = () => {
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const { profile, loading: profileLoading, error: profileError, fetchProfile } = useGetUserProfile();
    const { uploadPicture, loading: uploadingPhoto, error: uploadError } = useUploadProfilePicture();
    return (
        <SafeAreaView>

        </SafeAreaView>
    )
};
export default ProfilePictureEdit;

const createStyles = (theme: any) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        root: { flex: 1, backgroundColor: theme.colors.background },
        centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
        statusText: { fontSize: 14, color: theme.colors.textSecondary },
        errorText: { fontSize: 14, color: '#e74c3c', textAlign: 'center', paddingHorizontal: 24 },
        retryBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, backgroundColor: theme.colors.inverted },
        retryBtnText: { color: theme.colors.background, fontWeight: '600' },

        header: {
            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
            paddingHorizontal: 16, paddingVertical: 14,
            borderBottomWidth: 1, borderBottomColor: theme.colors.border,
            backgroundColor: theme.colors.card,
        },
        headerBtn: {
            width: 36, height: 36, borderRadius: 10,
            alignItems: "center", justifyContent: "center",
            backgroundColor: theme.colors.surface,
        },
        saveBtn: { backgroundColor: theme.colors.inverted },
        headerTitle: { fontSize: 16, fontWeight: "700", color: theme.colors.textPrimary, letterSpacing: -0.2 },

        scroll: { flex: 1 },
        content: { paddingBottom: 48 },

        avatarSection: { alignItems: "center", paddingVertical: 28, paddingHorizontal: 20 },
        avatarWrapper: { position: "relative", marginBottom: 10 },
        avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: theme.colors.border },
        avatarUploadOverlay: {
            ...StyleSheet.absoluteFillObject,
            borderRadius: 48,
            backgroundColor: 'rgba(0,0,0,0.45)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        avatarBadge: {
            position: "absolute", bottom: 0, right: 0,
            width: 30, height: 30, borderRadius: 15,
            backgroundColor: theme.colors.surface,
            alignItems: "center", justifyContent: "center",
            borderWidth: 2, borderColor: theme.colors.border,
        },
        avatarHint: { fontSize: 12, color: theme.colors.textSecondary },

        divider: { height: 8, backgroundColor: theme.colors.surface },

        card: { backgroundColor: theme.colors.card, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
        sectionLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.8, color: theme.colors.textSecondary, marginBottom: 14 },
        fieldGroup: { paddingVertical: 14 },
        fieldLabel: { fontSize: 12, color: theme.colors.textSecondary, marginBottom: 6 },
        input: {
            fontSize: 15, fontWeight: "500", color: theme.colors.textPrimary,
            paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10,
            backgroundColor: theme.colors.surface,
            borderWidth: 1, borderColor: theme.colors.border,
        },
        separator: { height: 1, backgroundColor: theme.colors.border },

        selectRow: {
            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
            paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10,
            backgroundColor: theme.colors.surface,
            borderWidth: 1, borderColor: theme.colors.border,
        },
        selectValue: { fontSize: 15, fontWeight: "500", color: theme.colors.textPrimary },
        placeholder: { color: theme.colors.textSecondary },
        chevron: { fontSize: 20, color: theme.colors.textSecondary, transform: [{ rotate: "90deg" }], lineHeight: 22 },
        chevronOpen: { transform: [{ rotate: "270deg" }] },
        dropdownList: {
            marginTop: 6, borderRadius: 10,
            borderWidth: 1, borderColor: theme.colors.border,
            backgroundColor: theme.colors.card, overflow: "hidden",
        },
        dropdownItem: {
            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
            paddingVertical: 12, paddingHorizontal: 14,
        },
        dropdownItemActive: { backgroundColor: theme.colors.inverted },
        dropdownItemText: { fontSize: 14, fontWeight: "500", color: theme.colors.textPrimary },
        dropdownItemTextActive: { color: theme.colors.background },

        saveRow: { paddingHorizontal: 20, paddingTop: 24, gap: 12 },
        savePrimary: { backgroundColor: theme.colors.inverted, paddingVertical: 15, borderRadius: 12, alignItems: "center" },
        savePrimaryDisabled: { opacity: 0.6 },
        savePrimaryText: { fontSize: 15, fontWeight: "700", color: theme.colors.background, letterSpacing: -0.2 },
        cancelBtn: {
            paddingVertical: 15, borderRadius: 12, alignItems: "center",
            borderWidth: 1, borderColor: theme.colors.border,
            backgroundColor: theme.colors.card,
        },
        cancelBtnText: { fontSize: 15, fontWeight: "600", color: theme.colors.textPrimary },
    });