import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-zustand-theme";
import { useMemo } from "react";

type Tab = "details" | "security";

interface ProfileHeaderProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

const ProfileHeader = ({ activeTab, onTabChange }: ProfileHeaderProps) => {
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={styles.wrapper}>
            <Text style={styles.title}>My Account</Text>
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === "details" && styles.tabActive]}
                    onPress={() => onTabChange("details")}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.tabText, activeTab === "details" && styles.tabTextActive]}>
                        Personal Details
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === "security" && styles.tabActive]}
                    onPress={() => onTabChange("security")}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.tabText, activeTab === "security" && styles.tabTextActive]}>
                        Security
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ProfileHeader;

const createStyles = (theme: any) =>
    StyleSheet.create({
        wrapper: {
            backgroundColor: theme.colors.background,
            paddingTop: 12,
            paddingBottom: 0,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border
        },
        title: {
            fontSize: 22,
            marginLeft: '4%',
            fontWeight: "700",
            color: theme.colors.textPrimary,
            marginBottom: 16,
            letterSpacing: -0.4,
        },
        tabBar: {
            flexDirection: "row",
            gap: 4,
        },
        tab: {
            flex: 1,
            paddingVertical: 10,
            alignItems: "center",
            borderBottomWidth: 2,
            borderBottomColor: "transparent",
        },
        tabActive: {
            borderBottomColor: theme.colors.invertedMuted,
            backgroundColor: theme.colors.surface
        },
        tabText: {
            fontSize: 14,
            fontWeight: "500",
            color: theme.colors.textSecondary ?? "#9CA3AF",
        },
        tabTextActive: {
            color: theme.colors.textPrimary,
            fontWeight: "600",
        },
    });