import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Calendar, Search} from "lucide-react-native";
import {useTheme} from "react-native-zustand-theme";
import {useMemo} from "react";
import {router} from "expo-router";
import Footer from "@/components/Footer";
import './ReactotronConfig';

export default function Index() {
    const {theme, toggleMode, isDark} = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.heroSection}>
                <Text style={styles.headline}>
                    Go anywhere with confidence.
                </Text>

                <Text style={styles.subHeadline}>
                    Request a ride, hop in, and go.
                </Text>

                {/* Floating Search Card */}
                <View style={styles.searchCard}>
                    <TouchableOpacity style={styles.searchRow}
                                      onPress={() => router.push('/SearchPage')}>
                        <Search size={20} color={theme.colors.textSecondary}/>
                        <Text style={styles.searchText}>
                            Enter pickup location
                        </Text>
                    </TouchableOpacity>

                    {/*<View style={styles.divider}/>*/}

                    {/*<TouchableOpacity style={styles.searchRow}>*/}
                    {/*    <Calendar size={20} color={theme.colors.textSecondary}/>*/}
                    {/*    <Text style={styles.searchText}>*/}
                    {/*        Schedule for later*/}
                    {/*    </Text>*/}
                    {/*</TouchableOpacity>*/}
                </View>

                {/* CTA */}
                <TouchableOpacity style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>
                        See prices
                    </Text>
                </TouchableOpacity>

                {/* Optional theme toggle */}
                <TouchableOpacity onPress={toggleMode}>
                    <Text style={styles.toggleText}>
                        {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/Login')}
                    style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.push('/Profile')}
                    style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Profile Section</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const createStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            paddingHorizontal: theme.spacing.lg,
        },

        heroSection: {
            marginTop: theme.spacing.xl,
            flex: 1,
        },

        headline: {
            fontSize: theme.fontSize.xxxxl,
            fontWeight: theme.fontWeight.bold,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.md,
            lineHeight: 38,
        },

        subHeadline: {
            fontSize: theme.fontSize.lg,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.xl,
        },

        searchCard: {
            backgroundColor: theme.colors.card,
            borderRadius: theme.radius.md,
            borderWidth: 2,
            borderColor: theme.colors.border,
            paddingVertical: theme.spacing.sm,
            marginBottom: theme.spacing.lg,
        },

        searchRow: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.lg,
            gap: theme.spacing.md,
        },

        searchText: {
            fontSize: theme.fontSize.lg,
            color: theme.colors.textPrimary,
            fontWeight: theme.fontWeight.medium,
        },

        divider: {
            height: 1,
            backgroundColor: theme.colors.border,
            marginHorizontal: theme.spacing.lg,
        },

        primaryButton: {
            backgroundColor: theme.colors.accent,
            paddingVertical: theme.spacing.md,
            borderRadius: theme.radius.md,
            alignItems: "center",
            marginBottom: theme.spacing.lg,
        },

        primaryButtonText: {
            color: theme.colors.accentText,
            fontSize: theme.fontSize.lg,
            fontWeight: theme.fontWeight.bold,
        },

        toggleText: {
            color: theme.colors.textMuted,
            fontSize: theme.fontSize.sm,
            textAlign: "center",
        },
        loginButton: {
            backgroundColor: theme.colors.accent,
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.lg,
            marginVertical: theme.spacing.xl,
            alignSelf: 'center',
            borderRadius: theme.radius.sm
        },
        loginButtonText: {
            color: theme.colors.accentText,
            fontSize: theme.fontSize.xl,
        }
    });
