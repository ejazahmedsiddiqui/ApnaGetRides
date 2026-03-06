import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {useTheme} from "react-native-zustand-theme";
import React, {useCallback, useMemo, useState} from "react";
import Animated, {
    BounceIn,
    BounceOut,
    useSharedValue,
    withSpring,
    interpolate,
    useAnimatedStyle,
    SlideInDown, SlideOutDown, SlideOutLeft, SlideInRight
} from 'react-native-reanimated';

const DEVICES = [
    {id: "1", name: "iPhone 15 Pro", location: "New York, US", lastActive: "Now", current: true},
    {id: "2", name: "MacBook Pro", location: "New York, US", lastActive: "2h ago", current: false},
    {id: "3", name: "iPad Air", location: "Chicago, US", lastActive: "3 days ago", current: false},
];

const CURRENT_DEVICE = {
    model: "iPhone 15 Pro",
    os: "iOS 17.4",
    ip: "192.168.1.42",
    lastLogin: "Today at 9:14 AM",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const Section = ({
                     title,
                     children,
                     styles,
                 }: {
    title: string;
    children: React.ReactNode;
    styles: ReturnType<typeof createStyles>;
}) => (
    <View style={styles.section}>
        <Text style={styles.sectionLabel}>{title}</Text>
        <View style={styles.card}>{children}</View>
    </View>
);

const Row = ({
                 icon,
                 label,
                 sub,
                 right,
                 onPress,
                 styles,
                 danger,
             }: {
    icon: string;
    label: string;
    sub?: string;
    right?: React.ReactNode;
    onPress?: () => void;
    styles: ReturnType<typeof createStyles>;
    danger?: boolean;
}) => (
    <TouchableOpacity
        style={styles.row}
        onPress={onPress}
        activeOpacity={onPress ? 0.6 : 1}
        disabled={!onPress}
    >
        <View style={styles.rowIcon}>
            <Text style={styles.rowEmoji}>{icon}</Text>
        </View>
        <View style={styles.rowBody}>
            <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>{label}</Text>
            {sub ? <Text style={styles.rowSub}>{sub}</Text> : null}
        </View>
        {right ?? null}
    </TouchableOpacity>
);

const Separator = ({styles}: { styles: ReturnType<typeof createStyles> }) => (
    <View style={styles.separator}/>
);

// ─── 2FA Expandable panel ─────────────────────────────────────────────────────
const TwoFAPanel = ({
                        styles,
                        theme,
                    }: {
    styles: ReturnType<typeof createStyles>;
    theme: any;
}) => {
    const [expanded, setExpanded] = useState(false);
    const [enabled, setEnabled] = useState(false);

    const progress = useSharedValue(0);

    const toggle = useCallback(() => {
        const next = !expanded;
        setExpanded(next);

        progress.value = withSpring(next ? 1 : 0, {
            stiffness: 140,
        });
    }, [expanded, progress]);

    const animatedPanelStyle = useAnimatedStyle(() => {
        const height = interpolate(progress.value, [0, 1], [0, 130]);

        return {
            height,
            overflow: "hidden",
        };
    });

    return (
        <>
            <Row
                icon="🔐"
                label="Two-Factor Authentication"
                sub={enabled ? "Enabled · SMS" : "Not enabled"}
                right={
                    <TouchableOpacity
                        onPress={toggle}
                        style={styles.expandBtn}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.expandBtnText}>{expanded ? "▲" : "▼"}</Text>
                    </TouchableOpacity>
                }
                onPress={toggle}
                styles={styles}
            />

            <Animated.View style={[styles.twoFAPanel, animatedPanelStyle]}>
                <View style={styles.twoFAInner}>
                    <View style={styles.twoFARow}>
                        <View>
                            <Text style={styles.twoFATitle}>Enable via SMS</Text>
                            <Text style={styles.twoFASub}>
                                Receive a code on your phone
                            </Text>
                        </View>

                        <Switch
                            value={enabled}
                            onValueChange={setEnabled}
                            trackColor={{
                                false: theme.colors.border ?? "#D1D5DB",
                                true: theme.colors.primary ?? "#6366F1",
                            }}
                            thumbColor="#fff"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.authenticatorBtn}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.authenticatorBtnText}>
                            🔑 Set up Authenticator App
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </>
    );
};

// ─── Main component ───────────────────────────────────────────────────────────
const PersonalSecurity = () => {
    const {theme} = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <Animated.View
            key="security"
            style={{ flex: 1, overflow: 'hidden' }}
            entering={SlideInRight.duration(300)}
            exiting={SlideOutLeft.duration(300)}
        >
        <View
            style={styles.safeArea}
        >
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Login devices ── */}
                <Section title="ACTIVE SESSIONS" styles={styles}>
                    {DEVICES.map((device, idx) => (
                        <View key={device.id}>
                            <Row
                                icon={device.name.includes("iPhone") ? "📱" : device.name.includes("Mac") ? "💻" : "📟"}
                                label={device.name + (device.current ? "  ✦" : "")}
                                sub={`${device.location} · ${device.lastActive}`}
                                right={
                                    !device.current ? (
                                        <TouchableOpacity style={styles.revokeBtn} activeOpacity={0.7}>
                                            <Text style={styles.revokeBtnText}>Remove</Text>
                                        </TouchableOpacity>
                                    ) : undefined
                                }
                                styles={styles}
                            />
                            {idx < DEVICES.length - 1 && <Separator styles={styles}/>}
                        </View>
                    ))}
                </Section>

                {/* ── Recovery ── */}
                <Section title="ACCOUNT RECOVERY" styles={styles}>
                    <Row
                        icon="📞"
                        label="Recovery Phone Number"
                        sub="+1 (555) ••• ••34"
                        onPress={() => {
                        }}
                        right={<Text style={styles.chevron}>›</Text>}
                        styles={styles}
                    />
                </Section>

                {/* ── 2FA ── */}
                <Section title="TWO-FACTOR AUTHENTICATION" styles={styles}>
                    <TwoFAPanel styles={styles} theme={theme}/>
                </Section>

                {/* ── Current device ── */}
                <Section title="CURRENT DEVICE" styles={styles}>
                    {Object.entries({
                        Model: CURRENT_DEVICE.model,
                        "Operating System": CURRENT_DEVICE.os,
                        "IP Address": CURRENT_DEVICE.ip,
                        "Last Login": CURRENT_DEVICE.lastLogin,
                    }).map(([label, value], idx, arr) => (
                        <View key={label}>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>{label}</Text>
                                <Text style={styles.infoValue}>{value}</Text>
                            </View>
                            {idx < arr.length - 1 && <Separator styles={styles}/>}
                        </View>
                    ))}
                </Section>

                {/* ── Danger zone ── */}
                <Section title="DANGER ZONE" styles={styles}>
                    <Row
                        icon="🔓"
                        label="Sign Out of All Devices"
                        onPress={() => {
                        }}
                        styles={styles}
                        danger
                    />
                    <Separator styles={styles}/>
                    <Row
                        icon="🗑️"
                        label="Delete Account"
                        onPress={() => {
                        }}
                        styles={styles}
                        danger
                    />
                </Section>
            </ScrollView>
        </View>
        </Animated.View>
    );
};

export default PersonalSecurity;

// ─── Styles ───────────────────────────────────────────────────────────────────
const createStyles = (theme: any) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: theme.colors.surface,
        },
        scroll: {flex: 1},
        content: {paddingBottom: 48},

        section: {marginTop: 20, paddingHorizontal: 16},
        sectionLabel: {
            fontSize: 11,
            fontWeight: "700",
            letterSpacing: 0.9,
            color: theme.colors.textSecondary ?? "#9CA3AF",
            marginBottom: 8,
            marginLeft: 4,
        },
        card: {
            backgroundColor: theme.colors.surface ?? theme.colors.background,
            borderRadius: 14,
            overflow: "hidden",
        },

        // Row
        row: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 13,
            paddingHorizontal: 14,
        },
        rowIcon: {
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: (theme.colors.primary ?? "#6366F1") + "14",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
        },
        rowEmoji: {fontSize: 17},
        rowBody: {flex: 1},
        rowLabel: {
            fontSize: 15,
            fontWeight: "500",
            color: theme.colors.textPrimary,
        },
        rowLabelDanger: {color: "#EF4444"},
        rowSub: {
            fontSize: 12,
            color: theme.colors.textSecondary ?? "#9CA3AF",
            marginTop: 2,
        },
        separator: {
            height: 1,
            backgroundColor: theme.colors.border ?? "#E5E7EB",
            marginLeft: 62,
        },
        chevron: {
            fontSize: 22,
            color: theme.colors.textSecondary ?? "#C0C0C0",
            marginLeft: 4,
        },

        // Revoke
        revokeBtn: {
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 7,
            backgroundColor: "#EF444418",
        },
        revokeBtnText: {
            fontSize: 12,
            fontWeight: "600",
            color: "#EF4444",
        },

        // Expand button
        expandBtn: {padding: 6},
        expandBtnText: {
            fontSize: 12,
            color: theme.colors.textSecondary ?? "#9CA3AF",
        },

        // 2FA panel
        twoFAPanel: {
            backgroundColor: (theme.colors.primary ?? "#6366F1") + "09",
        },
        twoFAInner: {
            paddingHorizontal: 16,
            paddingVertical: 12,
            gap: 12,
        },
        twoFARow: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        twoFATitle: {
            fontSize: 14,
            fontWeight: "600",
            color: theme.colors.textPrimary,
        },
        twoFASub: {
            fontSize: 12,
            color: theme.colors.textSecondary ?? "#9CA3AF",
            marginTop: 2,
        },
        authenticatorBtn: {
            backgroundColor: theme.colors.primary ?? "#6366F1",
            borderRadius: 10,
            paddingVertical: 10,
            alignItems: "center",
        },
        authenticatorBtnText: {
            color: "#fff",
            fontWeight: "600",
            fontSize: 14,
        },

        // Info rows (current device)
        infoRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 14,
            paddingVertical: 13,
        },
        infoLabel: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        infoValue: {
            fontSize: 14,
            fontWeight: "500",
            color: theme.colors.textPrimary,
        },
    });