import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useTheme} from "react-native-zustand-theme";
import {useEffect, useMemo} from "react";
import {router} from "expo-router";
import {ChevronLeft} from "lucide-react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";

type Tab = "details" | "security";

interface ProfileHeaderProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

const ProfileHeader = ({activeTab, onTabChange}: ProfileHeaderProps) => {
    const {theme} = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const tabWidth = useSharedValue(0);
    const translateX = useSharedValue(0);
    useEffect(() => {
        const index = activeTab === "details" ? 0 : 1;
        translateX.value = withTiming(index * tabWidth.value, {
            duration: 250,
        });
    }, [activeTab]);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateX: translateX.value}],
        };
    });
    return (
        <View style={styles.wrapper}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingVertical: 12,
            }}>
                <TouchableOpacity
                    style={{}}
                    onPress={() => router.back()}>
                    <ChevronLeft size={22} color={theme.colors.textPrimary} style={{
                        marginLeft: '4%',
                    }}/>
                </TouchableOpacity>
                <Text style={styles.title}>My Account</Text>
            </View>
            <View style={styles.tabBar}
                  onLayout={(e) => {
                      tabWidth.value = e.nativeEvent.layout.width / 2;
                  }}>
                <Animated.View
                    style={[
                        styles.activeIndicator,
                        animatedStyle,
                        {
                            width: "50%",
                        },
                    ]}
                />
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => onTabChange("details")}
                >
                    <Text style={[styles.tabText, activeTab === "details" && styles.tabTextActive]}>
                        Personal Details
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => onTabChange("security")}
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
        activeIndicator: {
            position: "absolute",
            height: "100%",
            backgroundColor: theme.colors.surface,
            borderBottomWidth: 2,
            borderBottomColor: theme.colors.invertedMuted,
            left: 0,
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