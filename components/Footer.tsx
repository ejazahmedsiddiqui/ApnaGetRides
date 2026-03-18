import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-zustand-theme";
import { useMemo } from "react";
import { useRouter, usePathname } from "expo-router";
import { useUser } from "@/context/UserContext";
import { Car, Grid, Home, User, UserPlusIcon } from "lucide-react-native";

const links = [
    { id: 'home',     icon: Home,        label: 'Home',     route: '/'           },
    { id: 'services', icon: Grid,        label: 'Services', route: '/SearchPage' },
    { id: 'rides',    icon: Car,         label: 'Rides',    route: '/ProfileEdit'},
    { id: 'profile',  icon: User,        label: 'Profile',  route: '/Profile'    },
    { id: 'login',    icon: UserPlusIcon,label: 'Login',    route: '/Login'      },
];

const Footer = () => {
    const router = useRouter();
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const pathname = usePathname();
    const { isAuthenticated } = useUser();

    const isActive = (route: string): boolean => {
        if (route === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(route);
    };

    const handleNavigation = (route: string) => {
        router.replace(route as any);
    };

    // Hide login link if authenticated
    const visibleLinks = isAuthenticated
        ? links.filter(link => link.id !== 'login')
        : links.filter(link => link.id !== 'profile');

    return (

        <View style={styles.footerContainer}>
            {visibleLinks.map((item) => {
                const active = isActive(item.route);
                return (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => handleNavigation(item.route)}
                        activeOpacity={0.6}
                        style={[
                            styles.item,
                            active && styles.activeItem
                        ]}
                    >
                        <View style={styles.iconContainer}>
                            <item.icon
                                size={24}
                                color={active ? theme.colors.accent : theme.colors.inverted}
                            />
                        </View>
                        <Text style={[
                            styles.label,
                            active && styles.activeLabel
                        ]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    footerContainer: {
        height: 'auto',
        maxHeight: '10%',
        paddingVertical: theme.spacing.sm,
        justifyContent: 'space-evenly',
        paddingHorizontal: theme.spacing.sm,
        backgroundColor: theme.colors.background,
        bottom: 0,
        right: 0,
        left: 0,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        flex: 1,
    },
    item: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.sm,
        borderRadius: theme.radius.sm
    },
    activeItem: {
        backgroundColor: theme.colors.invertedExtraMuted,
    },
    iconContainer: {
        position: 'relative',
    },
    label: {
        color: theme.colors.inverted,
        fontSize: theme.fontSize.sm,
        marginTop: theme.spacing.xs,
    },
    activeLabel: {
        color: theme.colors.accent,
        fontWeight: theme.fontWeight.bold,
    }
});

export default Footer;