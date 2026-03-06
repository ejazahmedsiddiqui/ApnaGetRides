import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useTheme} from "react-native-zustand-theme";
import {useMemo} from "react";
import {router} from "expo-router";
import {ChevronLeft} from "lucide-react-native";

type Tab = "details" | "security";

interface ProfileHeaderProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

const ProfileHeader = ({activeTab, onTabChange}: ProfileHeaderProps) => {
    const {theme} = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    return (
        <View style={styles.wrapper}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingVertical: 12,
            }}>
                <TouchableOpacity
                    style={{
                    }}
                    onPress={() => router.back()}>
                    <ChevronLeft size={22} color={theme.colors.textPrimary} style={{
                        marginLeft: '4%',
                    }}/>
                </TouchableOpacity>
                <Text style={styles.title}>My Account</Text>
            </View>
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
            height: '12%',
            backgroundColor: theme.colors.background,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border
        },
        title: {
            fontSize: 22,
            fontWeight: "700",
            color: theme.colors.textPrimary,
            letterSpacing: -0.4,
        },
        tabBar: {
            flex: 1,
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