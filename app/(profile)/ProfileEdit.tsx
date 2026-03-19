import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
} from "react-native";
import {useTheme} from "react-native-zustand-theme";
import {useMemo, useState} from "react";
import {Pen, ChevronLeft, Check} from "lucide-react-native";
import Animated, {FadeInDown} from "react-native-reanimated";
import {router, useLocalSearchParams} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";

type UserParams = {
    name: string;
    gender: string;
    email: string;
    phone: string;
    avatarUri: string;
};

const GENDER_OPTIONS = ["Male", "Female", "Non-binary", "Prefer not to say"];

const ProfileEdit = () => {
    const {theme} = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const params = useLocalSearchParams<UserParams>();

    const [name, setName] = useState(params.name ?? "");
    const [gender, setGender] = useState(params.gender ?? "");
    const [email, setEmail] = useState(params.email ?? "");
    const [phone, setPhone] = useState(params.phone ?? "");
    const [avatarUri] = useState(params.avatarUri ?? "");
    const [genderOpen, setGenderOpen] = useState(false);

    console.log('@/app/profile/ProfileEdit Accessed.');
    const handleSave = () => {
        if (!name.trim()) {
            Alert.alert("Validation", "Full name cannot be empty.");
            return;
        }
        if (!email.trim() || !email.includes("@")) {
            Alert.alert("Validation", "Please enter a valid email address.");
            return;
        }
        // TODO: persist changes
        router.back();
    };

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
                    >
                        <ChevronLeft size={22} color={theme.colors.textPrimary}/>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <TouchableOpacity
                        onPress={handleSave}
                        style={[styles.headerBtn, styles.saveBtn]}
                        activeOpacity={0.7}
                    >
                        <Check size={18} color={theme.colors.background}/>
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
                            <Image source={{uri: avatarUri}} style={styles.avatar}/>
                            <TouchableOpacity style={styles.avatarBadge} activeOpacity={0.7}>
                                <Pen
                                    size={16}
                                    color={theme.colors.textPrimary}
                                    style={{transform: [{rotate: "270deg"}]}}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.avatarHint}>Tap to change photo</Text>
                    </Animated.View>

                    {/* Divider */}
                    <View style={styles.divider}/>

                    {/* Form Fields */}
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
                        />

                        <View style={styles.separator}/>

                        {/* Gender picker */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.fieldLabel}>Gender</Text>
                            <TouchableOpacity
                                style={styles.selectRow}
                                activeOpacity={0.7}
                                onPress={() => setGenderOpen((v) => !v)}
                            >
                                <Text style={[styles.selectValue, !gender && styles.placeholder]}>
                                    {gender || "Select gender"}
                                </Text>
                                <Text style={[styles.chevron, genderOpen && styles.chevronOpen]}>›</Text>
                            </TouchableOpacity>
                            {genderOpen && (
                                <View style={styles.dropdownList}>
                                    {GENDER_OPTIONS.map((opt) => (
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
                                            <Text
                                                style={[
                                                    styles.dropdownItemText,
                                                    gender === opt && styles.dropdownItemTextActive,
                                                ]}
                                            >
                                                {opt}
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

                        <InputField
                            label="Email Address"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            styles={styles}
                            theme={theme}
                        />

                        <View style={styles.separator}/>

                        <InputField
                            label="Phone Number"
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter your phone number"
                            keyboardType="phone-pad"
                            styles={styles}
                            theme={theme}
                        />
                    </Animated.View>

                    {/* Save button */}
                    <Animated.View entering={FadeInDown.duration(300).delay(150)} style={styles.saveRow}>
                        <TouchableOpacity style={styles.savePrimary} onPress={handleSave} activeOpacity={0.8}>
                            <Text style={styles.savePrimaryText}>Save Changes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => router.back()}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// ─── Sub-component ────────────────────────────────────────────────────────────

const InputField = ({
                        label,
                        value,
                        onChangeText,
                        placeholder,
                        keyboardType,
                        autoCapitalize,
                        styles,
                        theme,
                    }: {
    label: string;
    value: string;
    onChangeText: (t: string) => void;
    placeholder?: string;
    keyboardType?: any;
    autoCapitalize?: any;
    styles: ReturnType<typeof createStyles>;
    theme: any;
}) => (
    <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType={keyboardType ?? "default"}
            autoCapitalize={autoCapitalize ?? "sentences"}
            selectionColor={theme.colors.textPrimary}
        />
    </View>
);

export default ProfileEdit;

// ─── Styles ───────────────────────────────────────────────────────────────────

const createStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background
        },
        root: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },

        // Header
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
            backgroundColor: theme.colors.inverted,
        },
        headerTitle: {
            fontSize: 16,
            fontWeight: "700",
            color: theme.colors.textPrimary,
            letterSpacing: -0.2,
        },

        // Scroll / layout
        scroll: {
            flex: 1,
        },
        content: {
            paddingBottom: 48,
        },

        // Avatar
        avatarSection: {
            alignItems: "center",
            paddingVertical: 28,
            paddingHorizontal: 20,
        },
        avatarWrapper: {
            position: "relative",
            marginBottom: 10,
        },
        avatar: {
            width: 96,
            height: 96,
            borderRadius: 48,
            borderWidth: 3,
            borderColor: theme.colors.border,
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
            color: theme.colors.textSecondary,
        },

        // Divider
        divider: {
            height: 8,
            backgroundColor: theme.colors.surface,
        },

        // Card
        card: {
            backgroundColor: theme.colors.card,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 8,
        },
        sectionLabel: {
            fontSize: 11,
            fontWeight: "700",
            letterSpacing: 0.8,
            color: theme.colors.textSecondary,
            marginBottom: 14,
        },

        // Field groups
        fieldGroup: {
            paddingVertical: 14,
        },
        fieldLabel: {
            fontSize: 12,
            color: theme.colors.textSecondary,
            marginBottom: 6,
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
        },

        // Gender select
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
            color: theme.colors.textPrimary,
        },
        placeholder: {
            color: theme.colors.textSecondary,
        },
        chevron: {
            fontSize: 20,
            color: theme.colors.textSecondary,
            transform: [{rotate: "90deg"}],
            lineHeight: 22,
        },
        chevronOpen: {
            transform: [{rotate: "270deg"}],
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
            backgroundColor: theme.colors.inverted,
        },
        dropdownItemText: {
            fontSize: 14,
            fontWeight: "500",
            color: theme.colors.textPrimary,
        },
        dropdownItemTextActive: {
            color: theme.colors.background,
        },

        // Save / Cancel
        saveRow: {
            paddingHorizontal: 20,
            paddingTop: 24,
            gap: 12,
        },
        savePrimary: {
            backgroundColor: theme.colors.inverted,
            paddingVertical: 15,
            borderRadius: 12,
            alignItems: "center",
        },
        savePrimaryText: {
            fontSize: 15,
            fontWeight: "700",
            color: theme.colors.background,
            letterSpacing: -0.2,
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
            color: theme.colors.textPrimary,
        },
    });