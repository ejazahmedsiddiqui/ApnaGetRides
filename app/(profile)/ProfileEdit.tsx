import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {useTheme} from "react-native-zustand-theme";
import {useEffect, useMemo, useState} from "react";
import {Pen, ChevronLeft, Check} from "lucide-react-native";
import Animated, {FadeInDown} from "react-native-reanimated";
import {router} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {useGetUserProfile, useEditUserProfile, useUploadProfilePicture} from "@/hooks/useUserProfile";
import * as ImagePicker from 'expo-image-picker';
import RenderFormField from "@/components/RenderFormField";

const GENDER_OPTIONS = ["male", "female"];

const ProfileEdit = () => {
    const {theme} = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const {profile, loading: profileLoading, error: profileError, fetchProfile} = useGetUserProfile();
    const {editProfile, loading: saving, error: saveError} = useEditUserProfile();
    const {uploadPicture, loading: uploadingPhoto, error: uploadError} = useUploadProfilePicture();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
    const [genderOpen, setGenderOpen] = useState(false);

    // Tracks a newly picked local URI; null means no change from server value
    const [pendingImageUri, setPendingImageUri] = useState<string | null>(null);

    // Combined saving state: text save OR photo upload in progress
    const isBusy = saving || uploadingPhoto;

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Pre-fill form once profile arrives
    useEffect(() => {
        if (profile.name) setName(profile.name);
        if (profile.email) setEmail(profile.email);
        if (profile.gender) setGender(profile.gender);
        if (profile.phone) setPhone(profile.phone);
        console.log('The profile details are: ', profile)
    }, [profile]);

    const handleChangePhoto = async () => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need camera roll permissions to change your photo.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            // Only stage the URI locally — upload happens on Save
            setPendingImageUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert("Validation", "Full name cannot be empty.");
            return;
        }
        if (!email.trim() || !email.includes("@")) {
            Alert.alert("Validation", "Please enter a valid email address.");
            return;
        }

        // 1️⃣ Upload photo first (only if user picked a new one)
        if (pendingImageUri) {
            const photoOk = await uploadPicture(pendingImageUri);
            if (!photoOk) {
                Alert.alert(
                    "Photo Upload Failed",
                    uploadError?.errorMessage ?? "Could not upload photo. Please try again."
                );
                return; // Don't proceed if photo failed
            }
        }

        const profileOk = await editProfile({
            name: name.trim(),
            email: email.trim(),
            gender,
            phone: phone.trim(),
        });

        if (profileOk) {
            router.back();
        } else {
            Alert.alert(
                "Update Failed",
                saveError?.errorMessage ?? "Something went wrong. Please try again."
            );
        }
    };

    // ─── Loading / error states ───────────────────────────────────────────────
    if (profileLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={theme.colors.textSecondary}/>
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

    // Displayed image: newly picked (local) > server value > placeholder
    const displayImage =
        pendingImageUri ??
        profile.profileImage ??
        'https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg';

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
                        disabled={isBusy}
                    >
                        <ChevronLeft size={22} color={theme.colors.textPrimary}/>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <TouchableOpacity
                        onPress={handleSave}
                        style={[styles.headerBtn, styles.saveBtn]}
                        activeOpacity={0.7}
                        disabled={isBusy}
                    >
                        {isBusy
                            ? <ActivityIndicator size="small" color={theme.colors.background}/>
                            : <Check size={18} color={theme.colors.background}/>
                        }
                    </TouchableOpacity>
                </View>

                {/* Single ScrollView — no nesting */}
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Avatar */}
                    <Animated.View entering={FadeInDown.duration(300).delay(50)} style={styles.avatarSection}>
                        <View style={styles.avatarWrapper}>
                            <Image source={{uri: displayImage}} style={styles.avatar}/>

                            {/* Show upload spinner over avatar while uploading */}
                            {uploadingPhoto && (
                                <View style={styles.avatarUploadOverlay}>
                                    <ActivityIndicator color="#fff"/>
                                </View>
                            )}

                            <TouchableOpacity
                                style={styles.avatarBadge}
                                activeOpacity={0.7}
                                onPress={handleChangePhoto}
                                disabled={isBusy}
                            >
                                <Pen
                                    size={16}
                                    color={theme.colors.textPrimary}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.avatarHint}>
                            {pendingImageUri ? "New photo selected — save to upload" : "Tap to change photo"}
                        </Text>
                    </Animated.View>

                    <View style={styles.divider}/>

                    {/* Form fields */}
                    <Animated.View entering={FadeInDown.duration(300).delay(100)} style={styles.card}>
                        <Text style={styles.sectionLabel}>PROFILE INFO</Text>

                        <RenderFormField
                            value={name}
                            onChangeText={setName}
                            label="Full Name"
                            placeholder="Enter your full name"
                            autoCapitalize="words"
                            editable={!isBusy}
                            labelColor={theme.colors.textSecondary}
                            labelColorActive={theme.colors.textPrimary}
                            inputStyle={{
                                backgroundColor: theme.colors.background,
                            }}
                            textColor={theme.colors.textSecondary}
                            borderColorActive={theme.colors.textPrimary}
                            borderColorInactive={theme.colors.border}
                        />
                        <View style={[styles.separator, { marginTop: 14}]}/>

                        {/* Gender picker */}
                        <View>
                            <Text style={styles.fieldLabel}>Gender</Text>
                            <TouchableOpacity
                                style={styles.selectRow}
                                activeOpacity={0.7}
                                onPress={() => !isBusy && setGenderOpen(v => !v)}
                            >
                                <Text style={[styles.selectValue, !gender && styles.placeholder]}>
                                    {gender.charAt(0).toUpperCase() + gender.slice(1) || "Select gender"}
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
                                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                            </Text>
                                            {gender === opt && (
                                                <Check size={14} color={theme.colors.background}/>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        <View style={styles.separator}/>

                        <RenderFormField
                            value={email}
                            onChangeText={setEmail}
                            editable={!isBusy && !profile.isEmailVerified}
                            label="Email"
                            placeholder="Enter your email"
                            labelColor={theme.colors.textSecondary}
                            labelColorActive={theme.colors.textPrimary}
                            inputStyle={{
                                backgroundColor: theme.colors.background,
                            }}
                            textColor={theme.colors.textSecondary}
                            borderColorActive={theme.colors.textPrimary}
                            borderColorInactive={theme.colors.border}
                        />

                        <View style={styles.separator}/>

                        <RenderFormField
                            label="Phone Number"
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter your phone number"
                            labelColor={theme.colors.textSecondary}
                            labelColorActive={theme.colors.textPrimary}
                            inputStyle={{
                                backgroundColor: theme.colors.background,
                            }}
                            textColor={theme.colors.textSecondary}
                            borderColorActive={theme.colors.textPrimary}
                            borderColorInactive={theme.colors.border}
                            editable={!isBusy && !profile.isPhoneVerified}
                        />
                    </Animated.View>

                    {/* Save / Cancel */}
                    <Animated.View entering={FadeInDown.duration(300).delay(150)} style={styles.saveRow}>
                        <TouchableOpacity
                            style={[styles.savePrimary, isBusy && styles.savePrimaryDisabled]}
                            onPress={handleSave}
                            activeOpacity={0.8}
                            disabled={isBusy}
                        >
                            {isBusy
                                ? <ActivityIndicator color={theme.colors.background}/>
                                : <Text style={styles.savePrimaryText}>Save Changes</Text>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => router.back()}
                            activeOpacity={0.7}
                            disabled={isBusy}
                        >
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ProfileEdit;

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background
    },
    root: {
        flex: 1,
        backgroundColor:
        theme.colors.background
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12
    },
    statusText: {
        fontSize: 14,
        color: theme.colors.textSecondary
    },
    errorText: {
        fontSize: 14,
        color: '#e74c3c',
        textAlign: 'center',
        paddingHorizontal: 24
    },
    retryBtn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: theme.colors.inverted
    },
    retryBtnText: {
        color: theme.colors.background,
        fontWeight: '600'
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.card,
    },
    headerBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.surface,
    },
    saveBtn: {
        backgroundColor: theme.colors.inverted
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: theme.colors.textPrimary,
        letterSpacing: -0.2
    },

    scroll: {
        flex: 1
    },
    content: {
        paddingBottom: 48
    },

    avatarSection: {
        alignItems: "center",
        paddingVertical: 28,
        paddingHorizontal: 20
    },
    avatarWrapper: {
        position: "relative",
        marginBottom: 10
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 3,
        borderColor: theme.colors.border
    },
    avatarUploadOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 48,
        backgroundColor: 'rgba(0,0,0,0.45)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: theme.colors.surface,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: theme.colors.border,
    },
    avatarHint: {
        fontSize: 12,
        color: theme.colors.textSecondary
    },

    divider: {
        height: 8,
        backgroundColor: theme.colors.surface
    },

    card: {
        backgroundColor: theme.colors.card,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 8
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 0.8,
        color: theme.colors.textSecondary,
        marginBottom: 14
    },
    fieldLabel: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginBottom: 6
    },
    input: {
        fontSize: 15,
        fontWeight: "500",
        color: theme.colors.textPrimary,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    separator: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: 14
    },

    selectRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    selectValue: {
        fontSize: 15,
        fontWeight: "500",
        color: theme.colors.textPrimary
    },
    placeholder: {
        color: theme.colors.textSecondary
    },
    chevron: {
        fontSize: 20,
        color: theme.colors.textSecondary,
        transform: [{rotate: "90deg"}],
        lineHeight: 22
    },
    chevronOpen: {
        transform: [{rotate: "270deg"}]
    },
    dropdownList: {
        marginTop: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.card,
        overflow: "hidden",
    },
    dropdownItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 14,
    },
    dropdownItemActive: {
        backgroundColor: theme.colors.inverted
    },
    dropdownItemText: {
        fontSize: 14,
        fontWeight: "500",
        color: theme.colors.textPrimary
    },
    dropdownItemTextActive: {
        color: theme.colors.background
    },

    saveRow: {
        paddingHorizontal: 20,
        paddingTop: 24,
        gap: 12
    },
    savePrimary: {
        backgroundColor: theme.colors.inverted,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center"
    },
    savePrimaryDisabled: {
        opacity: 0.6
    },
    savePrimaryText: {
        fontSize: 15,
        fontWeight: "700",
        color: theme.colors.background,
        letterSpacing: -0.2
    },
    cancelBtn: {
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.card,
    },
    cancelBtnText: {
        fontSize: 15,
        fontWeight: "600",
        color: theme.colors.textPrimary
    },
});