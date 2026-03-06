import {StyleSheet} from "react-native";
import {useTheme} from "react-native-zustand-theme";
import {useEffect, useMemo, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import PersonalDetails from "@/components/PersonalDetails";
import PersonalSecurity from "@/components/PersonalSecurity";
import ProfileHeader from "@/components/PersonalHeader";
import Animated, {FadeIn, FadeOut, SlideInRight, SlideOutLeft} from "react-native-reanimated";

const Profile = () => {
    const {theme} = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [tabs, setTabs] = useState<'details' | 'security'>('details');

    useEffect(() => {
        console.log('Tabs value is : ', tabs);
    }, [tabs]);
    return (
        <SafeAreaView style={styles.container}>
            <ProfileHeader activeTab={tabs} onTabChange={setTabs}/>
            {tabs === "details" ? (
                <PersonalDetails/>
            ) : (
                <PersonalSecurity/>
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