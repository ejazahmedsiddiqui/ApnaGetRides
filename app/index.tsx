import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    ActivityIndicator
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Search, MapPin, Clock, ChevronRight} from "lucide-react-native";
import {useTheme} from "react-native-zustand-theme";
import React, {useEffect, useMemo} from "react";
import {router} from "expo-router";
import './ReactotronConfig';
import HeroCarousels from "@/components/HeroCarousels";
import {useHeroList} from "@/hooks/useHeroList";


export default function Index() {
    const {theme, toggleMode, isDark} = useTheme();
    const styles = useMemo(() =>
        createStyles(theme, isDark), [theme, isDark]);

    const { data, getHeroList, loading, error} = useHeroList();
    useEffect(() => {
        console.log('Data is : ', data)
    }, [data]);
    const quickDestinations = [
        {id: '1', label: 'Home', icon: '🏠'},
        {id: '2', label: 'Work', icon: '💼'},
        {id: '3', label: 'Gym', icon: '🏋️'},
    ];

    const services = [
        {id: '1', emoji: '🚗', label: 'Ride'},
        {id: '2', emoji: '📦', label: 'Package'},
        {id: '3', emoji: '🍔', label: 'Eats'},
        {id: '4', emoji: '🛵', label: 'Auto'},
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'}/>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>

                {/* ── Header ── */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Good morning 👋</Text>
                        <Text style={styles.headerTitle}>Where to?</Text>
                    </View>
                    <TouchableOpacity onPress={toggleMode} style={styles.avatarButton}>
                        <Text style={styles.avatarText}>{isDark ? '☀️' : '🌙'}</Text>
                    </TouchableOpacity>
                </View>
                {/* ── Search Bar ── */}
                <TouchableOpacity
                    style={styles.searchBar}
                    onPress={() => router.push('/SearchPage')}
                    activeOpacity={0.85}>
                    <View style={styles.searchIconWrap}>
                        <Search size={18} color={isDark ? '#fff' : '#000'} strokeWidth={2.5}/>
                    </View>
                    <Text style={styles.searchPlaceholder}>Enter pickup location</Text>
                    <ChevronRight size={18} color={theme.colors.textSecondary}/>
                </TouchableOpacity>

                {/* ── Quick Destinations ── */}
                <View style={styles.quickRow}>
                    {quickDestinations.map(dest => (
                        <TouchableOpacity key={dest.id} style={styles.quickChip} activeOpacity={0.75}>
                            <Text style={styles.quickChipIcon}>{dest.icon}</Text>
                            <Text style={styles.quickChipLabel}>{dest.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* ── Services Grid ── */}
                <Text style={styles.sectionLabel}>Our Services</Text>
                <View style={styles.servicesRow}>
                    {services.map(s => (
                        <TouchableOpacity key={s.id} style={styles.serviceCard} activeOpacity={0.8}>
                            <View style={styles.serviceIconWrap}>
                                <Text style={styles.serviceEmoji}>{s.emoji}</Text>
                            </View>
                            <Text style={styles.serviceLabel}>{s.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <HeroCarousels/>

                {/* ── Recent Trips ── */}
                <View style={styles.recentSection}>
                    <View style={styles.sectionRow}>
                        <Text style={styles.sectionLabel}>Recent</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>See all</Text>
                        </TouchableOpacity>
                    </View>
                    {['Airport Terminal 2', 'Central Mall'].map((place, i) => (
                        <TouchableOpacity key={i} style={styles.recentItem} activeOpacity={0.75}>
                            <View style={styles.recentIconWrap}>
                                <Clock size={16} color={theme.colors.textSecondary}/>
                            </View>
                            <View style={styles.recentInfo}>
                                <Text style={styles.recentTitle}>{place}</Text>
                                <Text style={styles.recentSub}>Tap to ride again</Text>
                            </View>
                            <ChevronRight size={16} color={theme.colors.textSecondary}/>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* ── CTA Button ── */}
                <TouchableOpacity
                    style={styles.primaryButton}
                    activeOpacity={0.9}
                    onPress={() => router.push('/SearchPage')}>
                    <MapPin size={18} color={isDark ? '#000' : '#fff'} strokeWidth={2.5}/>
                    <Text style={styles.primaryButtonText}>See prices near you</Text>
                </TouchableOpacity>

                {/* ── Auth Buttons ── */}
                <View style={styles.authRow}>
                    <TouchableOpacity
                        onPress={() => router.push('/Login')}
                        style={[styles.authButton, styles.authOutline]}>
                        <Text style={[styles.authButtonText, styles.authOutlineText]}>Log in</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push('/Profile')}
                        style={[styles.authButton, styles.authFill]}>
                        <Text style={[styles.authButtonText, styles.authFillText]}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const createStyles = (theme: any, isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        scrollContent: {
            paddingHorizontal: 24,
            paddingBottom: 40,
        },

        /* Header */
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
            marginBottom: 20,
        },
        greeting: {
            fontSize: 13,
            color: theme.colors.textSecondary,
            fontWeight: '500',
            marginBottom: 2,
        },
        headerTitle: {
            fontSize: 30,
            fontWeight: '800',
            color: theme.colors.textPrimary,
            letterSpacing: -0.5,
        },
        avatarButton: {
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: theme.colors.card,
            borderWidth: 1.5,
            borderColor: theme.colors.border,
            justifyContent: 'center',
            alignItems: 'center',
        },
        avatarText: {
            fontSize: 18,
        },

        /* Search */
        searchBar: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.card,
            borderRadius: 14,
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderWidth: 1.5,
            borderColor: theme.colors.border,
            gap: 12,
            marginBottom: 14,
        },
        searchIconWrap: {
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        searchPlaceholder: {
            flex: 1,
            fontSize: 15,
            color: theme.colors.textSecondary,
            fontWeight: '500',
        },

        /* Quick Chips */
        quickRow: {
            flexDirection: 'row',
            gap: 10,
            marginBottom: 28,
        },
        quickChip: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: theme.colors.card,
            borderRadius: 20,
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        quickChipIcon: {fontSize: 14},
        quickChipLabel: {
            fontSize: 13,
            fontWeight: '600',
            color: theme.colors.textPrimary,
        },

        /* Section Label */
        sectionLabel: {
            fontSize: 17,
            fontWeight: '700',
            color: theme.colors.textPrimary,
            marginBottom: 14,
            letterSpacing: -0.2,
        },
        activityStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        /* Services */
        servicesRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 28,
        },
        serviceCard: {
            alignItems: 'center',
            gap: 8,
            flex: 1,
        },
        serviceIconWrap: {
            width: 60,
            height: 60,
            borderRadius: 18,
            backgroundColor: theme.colors.card,
            borderWidth: 1.5,
            borderColor: theme.colors.border,
            justifyContent: 'center',
            alignItems: 'center',
        },
        serviceEmoji: {fontSize: 24},
        serviceLabel: {
            fontSize: 12,
            fontWeight: '600',
            color: theme.colors.textPrimary,
        },

        /* Recent */
        recentSection: {
            marginTop: 8,
            marginBottom: 24,
        },
        sectionRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
        },
        seeAll: {
            fontSize: 13,
            fontWeight: '600',
            color: theme.colors.accent,
        },
        recentItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        recentIconWrap: {
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
            justifyContent: 'center',
            alignItems: 'center',
        },
        recentInfo: {flex: 1},
        recentTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.textPrimary,
        },
        recentSub: {
            fontSize: 12,
            color: theme.colors.textSecondary,
            marginTop: 2,
        },

        /* Primary CTA */
        primaryButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            backgroundColor: isDark ? '#ffffff' : '#000000',
            paddingVertical: 16,
            borderRadius: 14,
            marginBottom: 16,
        },
        primaryButtonText: {
            color: isDark ? '#000000' : '#ffffff',
            fontSize: 16,
            fontWeight: '700',
            letterSpacing: -0.2,
        },

        /* Auth */
        authRow: {
            flexDirection: 'row',
            gap: 12,
        },
        authButton: {
            flex: 1,
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: 'center',
        },
        authOutline: {
            borderWidth: 1.5,
            borderColor: theme.colors.border,
            backgroundColor: 'transparent',
        },
        authFill: {
            backgroundColor: theme.colors.accent,
        },
        authButtonText: {
            fontSize: 15,
            fontWeight: '700',
        },
        authOutlineText: {
            color: theme.colors.textPrimary,
        },
        authFillText: {
            color: theme.colors.accentText,
        },
    });