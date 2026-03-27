import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {useTheme} from "react-native-zustand-theme";
import {useEffect, useMemo} from "react";
import {Pen} from "lucide-react-native";
import Animated, {
    SlideInLeft, SlideOutRight
} from 'react-native-reanimated';
import {router} from "expo-router";
import {GestureDetector, Gesture} from 'react-native-gesture-handler'
import {scheduleOnRN} from 'react-native-worklets';
import {useUser} from "@/context/UserContext";

type Tab = "details" | "security";

interface ProfileHeaderProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

const Field = ({
                   label,
                   value,
                   styles,
               }: {
    label: string;
    value: string;
    styles: ReturnType<typeof createStyles>;

}) => (
    <View style={styles.fieldRow}>
        <View style={styles.fieldLeft}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <Text style={styles.fieldValue}>{value}</Text>
        </View>

    </View>
);

const PersonalDetails = ({activeTab, onTabChange}: ProfileHeaderProps) => {
    const {theme} = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const {isAuthenticated, profileImage, fullName, email, gender, phone, isLoading, logout, message} = useUser();

    useEffect(() => {
        if (!isAuthenticated)
            router.replace('/Login')
    }, [isAuthenticated]);

    const swipeGesture = Gesture.Pan()
        .activeOffsetX([-20, 20])      // ← Only activate after 20px horizontal movement
        .failOffsetY([-10, 10])        // ← Fail/cancel if vertical movement detected first
        .onEnd((event) => {
            if (event.translationX < -50 && activeTab === 'details') {
                scheduleOnRN(onTabChange, 'security');
            }
        });

    if (isLoading) {
        return (

            <View style={styles.safeArea}>
                <ActivityIndicator size={'large'} color={theme.colors.textSecondary}/>
                {message &&
                    <Text style={styles.sectionLabel}>{message}</Text>}
            </View>

        )
    }
    if (!isAuthenticated) return null;
    return (
        <View
            style={styles.safeArea}
        >
            <GestureDetector gesture={swipeGesture}>
                <Animated.View
                    key="details"
                    style={{flex: 1, overflow: 'hidden'}}
                    entering={SlideInLeft.duration(300)}
                    exiting={SlideOutRight.duration(300)}
                >
                    <ScrollView
                        style={styles.scroll}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Avatar section */}
                        <View style={styles.avatarSection}>
                            <View style={styles.avatarWrapper}>
                                <Image
                                    source={{uri: profileImage || 'https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?ga=GA1.1.1874108308.1765959492&semt=ais_hybrid&w=740&q=80'}}
                                    style={styles.avatar}/>
                                <TouchableOpacity style={styles.avatarBadge} activeOpacity={0.7}>
                                    <Pen size={20} color={theme.colors.textPrimary} style={{
                                        transform: [
                                            {rotate: '270deg'}
                                        ]
                                    }}/>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.avatarName}>{fullName}</Text>
                            <Text style={styles.avatarSub}>Tap the icon to change your photo</Text>
                        </View>

                        {/* Fields */}
                        <View style={styles.card}>
                            <View
                                style={{
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexDirection: 'row'
                                }}
                            >

                                <Text style={styles.sectionLabel}>PROFILE INFO</Text>
                                <TouchableOpacity onPress={() => router.push({
                                    pathname: '/ProfileEdit',
                                    params: {}
                                })} activeOpacity={0.6} style={styles.editBtn}>
                                    <Text style={styles.editBtnText}>Edit</Text>
                                </TouchableOpacity>
                            </View>
                            <Field
                                label="Full Name"
                                value={fullName ?? 'Not available'}
                                styles={styles}

                            />
                            <View style={styles.separator}/>
                            <Field
                                label="Gender"
                                value={gender ?? 'Not available'}
                                styles={styles}

                            />
                            <View style={styles.separator}/>
                            <Field
                                label="Email Address"
                                value={email ?? 'Not available'}
                                styles={styles}

                            />
                            <View style={styles.separator}/>
                            <Field
                                label="Phone Number"
                                value={phone ?? 'Not available'}
                                styles={styles}

                            />
                            <TouchableOpacity
                                style={styles.logoutButton}
                                onPress={logout}
                            >
                                <Text style={styles.logoutButtonText}>Logout</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </Animated.View>
            </GestureDetector>
        </View>
    );
};

export default PersonalDetails;

const createStyles = (theme: any) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        scroll: {
            flex: 1,
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

        // Card / fields
        card: {
            paddingHorizontal: 20,
            paddingVertical: 20,
        },
        sectionLabel: {
            fontSize: 11,
            fontWeight: "700",
            letterSpacing: 0.8,
            color: theme.colors.textSecondary,
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
        circle: {
            height: 120,
            width: 120,
            backgroundColor: '#b58df1',
            borderRadius: 500,
        },
        logoutButton: {
            backgroundColor: theme.colors.surface,
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginVertical: 12,
            width: '40%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        logoutButtonText: {
            color: theme.colors.textPrimary,
            fontSize: 16,
        }
    });