import {StyleSheet, ActivityIndicator} from "react-native";
import {useTheme} from "react-native-zustand-theme";
import {useEffect, useMemo, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import PersonalDetails from "@/components/PersonalDetails";
import PersonalSecurity from "@/components/PersonalSecurity";
import ProfileHeader from "@/components/PersonalHeader";
import {useUser} from '@/context/UserContext'
import {router} from 'expo-router'

const Profile = () => {
    const {theme} = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [tabs, setTabs] = useState<'details' | 'security'>('details');
    const {isAuthenticated, isLoading,} = useUser();
    //
    // useEffect(() => {
    //     if (!isAuthenticated) router.replace('/Login')
    // }, [isAuthenticated]);

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
                <ActivityIndicator color={theme.colors.textPrimary} size={24}/>
            </SafeAreaView>
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            <ProfileHeader activeTab={tabs} onTabChange={setTabs}/>
            {tabs === "details" ? (
                <PersonalDetails activeTab={tabs} onTabChange={setTabs}/>
            ) : (
                <PersonalSecurity activeTab={tabs} onTabChange={setTabs}/>
            )}
        </SafeAreaView>
    )
};

export default Profile;

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background
    }
})