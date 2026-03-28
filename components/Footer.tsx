import { StyleSheet, Text, TouchableOpacity, View, Platform } from "react-native";
import { useTheme } from "react-native-zustand-theme";
import React, { useMemo } from "react";
import { useRouter, usePathname } from "expo-router";
import { useUser } from "@/context/UserContext";
import { Car, Grid, Home, User, UserPlusIcon } from "lucide-react-native";
import { BlurView } from "expo-blur";

type FooterProps = {
    blurTargetRef: React.RefObject<View | null>;
};

const links = [
    { id: 'home',     icon: Home,         label: 'Home',     route: '/'            },
    { id: 'services', icon: Grid,         label: 'Services', route: '/SearchPage'  },
    { id: 'rides',    icon: Car,          label: 'Rides',    route: '/ProfileEdit' },
    { id: 'profile',  icon: User,         label: 'Profile',  route: '/Profile'     },
    { id: 'login',    icon: UserPlusIcon, label: 'Login',    route: '/Login'       },
];

const Footer = ({ blurTargetRef }: FooterProps) => {
    const router = useRouter();
    const { theme, isDark } = useTheme();
    const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);
    const pathname = usePathname();
    const { isAuthenticated } = useUser();

    const isActive = (route: string): boolean => {
        if (route === '/') return pathname === '/';
        return pathname.startsWith(route);
    };

    const handleNavigation = (route: string) => {
        router.replace(route as any);
    };

    const visibleLinks = isAuthenticated
        ? links.filter(link => link.id !== 'login')
        : links.filter(link => link.id !== 'profile');

    return (
        <View style={styles.wrapper}>
            <BlurView
                style={styles.blurContainer}
                blurTarget={blurTargetRef}
                intensity={isDark ? 30 : 50}
                tint={isDark ? "dark" : "light"}
                blurMethod="dimezisBlurViewSdk31Plus"
            >
                {/* Glass tint overlay */}
                <View style={styles.tintOverlay} pointerEvents="none" />

                {/* Top border shine */}
                <View style={styles.topBorder} pointerEvents="none" />

                {visibleLinks.map((item) => {
                    const active = isActive(item.route);
                    const IconComp = item.icon;
                    return (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => handleNavigation(item.route)}
                            activeOpacity={0.7}
                            style={styles.item}
                        >
                            <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                                <IconComp
                                    size={20}
                                    color={
                                        active
                                            ? (theme.colors.textPrimary)
                                            : (theme.colors.textSecondary)
                                    }
                                    strokeWidth={active ? 2.5 : 1.8}
                                />
                            </View>

                            <Text style={[styles.label, active && styles.labelActive]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </BlurView>
        </View>
    );
};

const createStyles = (theme: any, isDark: boolean) => StyleSheet.create({
    wrapper: {
        // Floating pill — sits above content
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: Platform.OS === 'android' ? 8 : 0,
    },
    blurContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 0,
        paddingTop: 10,
        paddingBottom: Platform.OS === 'android' ? 10 : 24,
        overflow: 'hidden',
        borderTopWidth: 0,
        borderTopColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    },
    tintOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: isDark
            ? 'rgba(10, 10, 10, 0.45)'
            : 'rgba(255, 255, 255, 0.35)',
    },
    topBorder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: isDark
            ? 'rgba(255,255,255,0.12)'
            : 'rgba(255,255,255,0.8)',
    },
    item: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingVertical: 4,
        position: 'relative',
    },
    iconWrap: {
        width: 40,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapActive: {
        backgroundColor: isDark
            ? 'rgba(255,255,255,0.22)'
            : 'rgba(0,0,0,0.17)',
        borderRadius: 12,
    },
    label: {
        fontSize: 10,
        fontWeight: '500',
        color: theme.colors.textPrimary,
        letterSpacing: 0.2,
    },
    labelActive: {
        color: theme.colors.textPrimary,
        fontWeight: '700',
    },
});

export default Footer;