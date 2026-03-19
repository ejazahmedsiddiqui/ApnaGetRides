import {Stack} from "expo-router";
import {ThemeProvider, useTheme} from "react-native-zustand-theme";
import Mapbox from "@rnmapbox/maps";
import {Platform, StyleSheet, UIManager, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Footer from "@/components/Footer";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {UserProvider, useUser} from "@/context/UserContext";
import {useEffect, useMemo} from "react";

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const queryClient = new QueryClient();
const App = () => {
    const { isAuthenticated } = useUser();
    const {theme, isDark} = useTheme();

    const styles = useMemo(() => createStyles(theme), [theme]);

    useEffect(() => {
        console.log('Authentication Status: ', isAuthenticated);
    }, [isAuthenticated]);

    Mapbox.setTelemetryEnabled(false);
    return (
        <View style={{flex: 1}}>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name={'index'} options={{title: 'Home'}}/>
                <Stack.Screen name={'(auth)'}/>
                <Stack.Screen name={'(map)'}/>
                <Stack.Screen name={'(profile)'}/>
            </Stack>
            <Footer/>
        </View>
    )
}

export default function RootLayout() {


    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <QueryClientProvider client={queryClient}>
                <UserProvider>
                    <ThemeProvider>
                        <App/>
                    </ThemeProvider>
                </UserProvider>
            </QueryClientProvider>
        </GestureHandlerRootView>
    )
}

const createStyles = (theme:any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: theme.colors.textPrimary,
        fontSize: theme.fontSize.md,
        fontWeight: "700"
    }
})