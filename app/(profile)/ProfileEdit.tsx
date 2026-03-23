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
import { useGetUserProfile, useEditUserProfile } from "@/hooks/useUserProfile";

const GENDER_OPTIONS = ["male", "female"];

// ─── Local state shape mirrors the edit form ──────────────────────────────────

const ProfileEdit = () => {
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    // Fetch current profile to pre-fill the form
    const { profile, loading: profileLoading, error: profileError, fetchProfile } = useGetUserProfile();

    // Edit / submit hook
    const { editProfile, loading: saving, error: saveError } = useEditUserProfile();

    // Local controlled form state
    const [name, setName] = useStateString('');
    const [email, setEmail] = useStateString('');
    const [gender, setGender] = useStateString('');
    const [phone, setPhone] = useStateString('');
    const [genderOpen, setGenderOpen] = useStateBool(false);

    // Fetch on mount
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Pre-fill form once profile arrives
    useEffect(() => {
        if (profile.name) setName(profile.name);
        if (profile.email) setEmail(profile.email);
        if (profile.gender) setGender(profile.gender);
        if (profile.phone) setPhone(profile.phone);
        console.log('Verification - phone: '+ profile.isPhoneVerified + '\n email: ' + profile.isEmailVerified);
    }, [profile]);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert("Validation", "Full name cannot be empty.");
            return;
        }
        if (!email.trim() || !email.includes("@")) {
            Alert.alert("Validation", "Please enter a valid email address.");
            return;
        }

        const ok = await editProfile({
            name: name.trim(),
            email: email.trim(),
            gender,
            phone: phone.trim(),
            image: profile.profilePicture ?? undefined,
        });

        if (ok) {
            // refreshProfile was already called inside editProfile → UserContext is up to date
            router.back();
        } else {
            Alert.alert(
                "Update Failed",
                saveError?.errorMessage ?? "Something went wrong. Please try again."
            );
        }
    };

    // ── Loading / error states ────────────────────────────────────────────────

    if (profileLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={theme.colors.textSecondary} />
                    <Text style={styles.statusText}>Loading profile…</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (profileError) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <Text style={styles.errorText}>{profileError.errorMessage}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={fetchProfile}>
                        <Text style={styles.retryBtnText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.root}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.headerBtn}
                        activeOpacity={0.7}
                        disabled={saving}
                    >
                        <ChevronLeft size={22} color={theme.colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <TouchableOpacity
                        onPress={handleSave}
                        style={[styles.headerBtn, styles.saveBtn]}
                        activeOpacity={0.7}
                        disabled={saving}
                    >
                        {saving
                            ? <ActivityIndicator size="small" color={theme.colors.background} />
                            : <Check size={18} color={theme.colors.background} />
                        }
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Avatar */}
                    <Animated.View entering={FadeInDown.duration(300).delay(50)} style={styles.avatarSection}>
                        <View style={styles.avatarWrapper}>
                            <Image
                                source={{
                                    uri: profile.profilePicture ??
                                        'https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg',
                                }}
                                style={styles.avatar}
                            />
                            <TouchableOpacity style={styles.avatarBadge} activeOpacity={0.7}>
                                <Pen
                                    size={16}
                                    color={theme.colors.textPrimary}
                                    style={{ transform: [{ rotate: "270deg" }] }}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.avatarHint}>Tap to change photo</Text>
                    </Animated.View>

                    <View style={styles.divider} />

                    {/* Form */}
                    <Animated.View entering={FadeInDown.duration(300).delay(100)} style={styles.card}>
                        <Text style={styles.sectionLabel}>PROFILE INFO</Text>

                        <InputField
                            label="Full Name"
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your full name"
                            autoCapitalize="words"
                            styles={styles}
                            theme={theme}
                            editable={!saving}
                        />

                        <View style={styles.separator} />

                        {/* Gender picker */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.fieldLabel}>Gender</Text>
                            <TouchableOpacity
                                style={styles.selectRow}
                                activeOpacity={0.7}
                                onPress={() => !saving && setGenderOpen(v => !v)}
                            >
                                <Text style={[styles.selectValue, !gender && styles.placeholder]}>
                                    {gender || "Select gender"}
                                </Text>
                                <Text style={[styles.chevron, genderOpen && styles.chevronOpen]}>›</Text>
                            </TouchableOpacity>
                            {genderOpen && (
                                <View style={styles.dropdownList}>
                                    {GENDER_OPTIONS.map(opt => (
                                        <TouchableOpacity
                                            key={opt}
                                            style={[
                                                styles.dropdownItem,
                                                gender === opt && styles.dropdownItemActive,
                                            ]}
                                            activeOpacity={0.7}
                                            onPress={() => {
                                                setGender(opt);
                                                setGenderOpen(false);
                                            }}
                                        >
                                            <Text style={[
                                                styles.dropdownItemText,
                                                gender === opt && styles.dropdownItemTextActive,
                                            ]}>
                                                {opt}
                                            </Text>
                                            {gender === opt && (
                                                <Check size={14} color={theme.colors.background} />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        <View style={styles.separator} />

                        <InputField
                            label="Email Address"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            styles={styles}
                            theme={theme}
                            editable={!saving && !profile.isEmailVerified}
                        />

                        <View style={styles.separator} />

                        <InputField
                            label="Phone Number"
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter your phone number"
                            keyboardType="phone-pad"
                            styles={styles}
                            theme={theme}
                            editable={!saving && !profile?.isPhoneVerified}
                        />
                    </Animated.View>

                    {/* Save / Cancel */}
                    <Animated.View entering={FadeInDown.duration(300).delay(150)} style={styles.saveRow}>
                        <TouchableOpacity
                            style={[styles.savePrimary, saving && styles.savePrimaryDisabled]}
                            onPress={handleSave}
                            activeOpacity={0.8}
                            disabled={saving}
                        >
                            {saving
                                ? <ActivityIndicator color={theme.colors.background} />
                                : <Text style={styles.savePrimaryText}>Save Changes</Text>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => router.back()}
                            activeOpacity={0.7}
                            disabled={saving}
                        >
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
const useStateString = (init: string): [string, React.Dispatch<React.SetStateAction<string>>] => useState(init);
const useStateBool = (init: boolean): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => useState(init);


const InputField = ({
                        label, value, onChangeText, placeholder,
                        keyboardType, autoCapitalize, styles, theme, editable = true,
                    }: {
    label: string;
    value: string;
    onChangeText: (v: string) => void;
    placeholder?: string;
    keyboardType?: any;
    autoCapitalize?: any;
    styles: ReturnType<typeof createStyles>;
    theme: any;
    editable?: boolean;
}) => (
    <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TextInput
            style={[styles.input, !editable && { opacity: 0.5 }]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            editable={editable}
        />
    </View>
);

export default ProfileEdit;



const createStyles = (theme: any) =>
    StyleSheet.create({
        container: {
                flex: 1,
                backgroundColor: theme.colors.background
            },
        root: {
            flex: 1, backgroundColor: theme.colors.background },
        centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
        statusText: { fontSize: 14, color: theme.colors.textSecondary },
        errorText: { fontSize: 14, color: '#e74c3c', textAlign: 'center', paddingHorizontal: 24 },
        retryBtn: {
            paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8,
            backgroundColor: theme.colors.inverted,
        },
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
        headerTitle: {
            fontSize: 16, fontWeight: "700",
            color: theme.colors.textPrimary, letterSpacing: -0.2,
        },

        scroll: { flex: 1 },
        content: { paddingBottom: 48 },

        avatarSection: { alignItems: "center", paddingVertical: 28, paddingHorizontal: 20 },
        avatarWrapper: { position: "relative", marginBottom: 10 },
        avatar: {
            width: 96, height: 96, borderRadius: 48,
            borderWidth: 3, borderColor: theme.colors.border,
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

        card: {
            backgroundColor: theme.colors.card,
            paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8,
        },
        sectionLabel: {
            fontSize: 11, fontWeight: "700", letterSpacing: 0.8,
            color: theme.colors.textSecondary, marginBottom: 14,
        },
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
        chevron: {
            fontSize: 20, color: theme.colors.textSecondary,
            transform: [{ rotate: "90deg" }], lineHeight: 22,
        },
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
        savePrimary: {
            backgroundColor: theme.colors.inverted,
            paddingVertical: 15, borderRadius: 12, alignItems: "center",
        },
        savePrimaryDisabled: { opacity: 0.6 },
        savePrimaryText: {
            fontSize: 15, fontWeight: "700",
            color: theme.colors.background, letterSpacing: -0.2,
        },
        cancelBtn: {
            paddingVertical: 15, borderRadius: 12, alignItems: "center",
            borderWidth: 1, borderColor: theme.colors.border,
            backgroundColor: theme.colors.card,
        },
        cancelBtnText: { fontSize: 15, fontWeight: "600", color: theme.colors.textPrimary },
    });