import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "react-native-zustand-theme";
import { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileHeader from './PersonalHeader';
import {Pen} from "lucide-react-native";

// Replace with your actual navigation / state management approach
interface PersonalDetailsProps {
    activeTab: "details" | "security";
    onTabChange: (tab: "details" | "security") => void;
}

const USER = {
    name: "Jordan Avery",
    gender: "Non-binary",
    email: "jordan.avery@example.com",
    phone: "+1 (555) 012-3456",
    avatarUri: "https://i.pravatar.cc/200?img=47",
};

const Field = ({
                   label,
                   value,
                   styles,
                   onEdit,
               }: {
    label: string;
    value: string;
    styles: ReturnType<typeof createStyles>;
    onEdit?: () => void;
}) => (
    <View style={styles.fieldRow}>
        <View style={styles.fieldLeft}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <Text style={styles.fieldValue}>{value}</Text>
        </View>
        {onEdit && (
            <TouchableOpacity onPress={onEdit} activeOpacity={0.6} style={styles.editBtn}>
                <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
        )}
    </View>
);

const PersonalDetails = () => {
    const { theme, toggleMode } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={styles.safeArea}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Avatar section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarWrapper}>
                        <Image source={{ uri: USER.avatarUri }} style={styles.avatar} />
                        <TouchableOpacity style={styles.avatarBadge} activeOpacity={0.7}>
                            <Pen size={20} color={theme.colors.textPrimary} style={{
                                transform: [
                                    {rotate: '270deg'}
                                ]
                            }}/>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.avatarName}>{USER.name}</Text>
                    <Text style={styles.avatarSub}>Tap the icon to change your photo</Text>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Fields */}
                <View style={styles.card}>
                    <Text style={styles.sectionLabel}>PROFILE INFO</Text>

                    <Field
                        label="Full Name"
                        value={USER.name}
                        styles={styles}
                        onEdit={() => {}}
                    />
                    <View style={styles.separator} />
                    <Field
                        label="Gender"
                        value={USER.gender}
                        styles={styles}
                        onEdit={() => {}}
                    />
                    <View style={styles.separator} />
                    <Field
                        label="Email Address"
                        value={USER.email}
                        styles={styles}
                        onEdit={() => {}}
                    />
                    <View style={styles.separator} />
                    <Field
                        label="Phone Number"
                        value={USER.phone}
                        styles={styles}
                        onEdit={() => {}}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default PersonalDetails;

// ─── Styles ───────────────────────────────────────────────────────────────────
const createStyles = (theme: any) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        scroll: {
            flex: 1,
        },
        content: {
            paddingBottom: 40,
        },

        // Avatar
        avatarSection: {
            alignItems: "center",
            paddingVertical: 28,
            paddingHorizontal: 20,
        },
        avatarWrapper: {
            position: "relative",
            marginBottom: 12,
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
            width: 32,
            height: 32,
            borderRadius: 14,
            backgroundColor: theme.colors.surface,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: theme.colors.border,
        },
        avatarBadgeText: {
            fontSize: 12,
        },
        avatarName: {
            fontSize: 20,
            fontWeight: "700",
            color: theme.colors.textPrimary,
            letterSpacing: -0.3,
        },
        avatarSub: {
            marginTop: 4,
            fontSize: 12,
            color: theme.colors.textSecondary
        },

        divider: {
            height: 8,
            backgroundColor: theme.colors.surface
        },

        // Card / fields
        card: {
            backgroundColor: theme.colors.card,
            paddingHorizontal: 20,
            paddingVertical: 20,
        },
        sectionLabel: {
            fontSize: 11,
            fontWeight: "700",
            letterSpacing: 0.8,
            color: theme.colors.textSecondary,
            marginBottom: 14,
        },
        fieldRow: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 24,
        },
        fieldLeft: {
            flex: 1,
        },
        fieldLabel: {
            fontSize: 12,
            color: theme.colors.textSecondary,
            marginBottom: 3,
        },
        fieldValue: {
            fontSize: 15,
            fontWeight: "500",
            color: theme.colors.textPrimary,
        },
        editBtn: {
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 8,
            backgroundColor: theme.colors.inverted
        },
        editBtnText: {
            fontSize: 13,
            fontWeight: "600",
            color: theme.colors.background,
        },
        separator: {
            height: 1,
            backgroundColor: theme.colors.border
        },
    });