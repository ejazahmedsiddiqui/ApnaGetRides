import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {useTheme} from "react-native-zustand-theme";
import {useMemo} from "react";
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

const USER = {
    name: "Jordan Avery",
    gender: "Female",
    email: "jordan.avery@example.com",
    phone: "+1 (555) 012-3456",
    avatarUri: "https://i.pravatar.cc/200?img=47",
};

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
    const {profilePicture, fullName, email, gender, phone} = useUser();

    const swipeGesture = Gesture.Pan()
        .onEnd((event) => {
            if (event.translationX < -50 && activeTab === 'details') {
                scheduleOnRN(onTabChange, 'security')
            }
        })

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
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Avatar section */}
                        <View style={styles.avatarSection}>
                            <View style={styles.avatarWrapper}>
                                <Image source={{uri: USER.avatarUri}} style={styles.avatar}/>
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
                                params: USER
                            })} activeOpacity={0.6} style={styles.editBtn}>
                                <Text style={styles.editBtnText}>Edit</Text>
                            </TouchableOpacity>
                            </View>
                            <Field
                                label="Full Name"
                                value={USER.name}
                                styles={styles}

                            />
                            <View style={styles.separator}/>
                            <Field
                                label="Gender"
                                value={USER.gender}
                                styles={styles}

                            />
                            <View style={styles.separator}/>
                            <Field
                                label="Email Address"
                                value={USER.email}
                                styles={styles}

                            />
                            <View style={styles.separator}/>
                            <Field
                                label="Phone Number"
                                value={USER.phone}
                                styles={styles}

                            />
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
    });