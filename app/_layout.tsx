import {Stack} from "expo-router";
import {ThemeProvider} from "react-native-zustand-theme";
import Mapbox from "@rnmapbox/maps";
import { Platform, UIManager, View, } from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Footer from "@/components/Footer";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {UserProvider, useUser} from "@/context/UserContext";
import {useEffect} from "react";
import * as SplashScreen from "expo-splash-screen";
import { Inter_900Black, useFonts} from '@expo-google-fonts/inter'

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync().catch(() => {});

const App = () => {
    const {  isLoading } = useUser();
    const [loaded, error] = useFonts({
        Inter_900Black,
    });
    useEffect(() => {
        if (!isLoading && ( !loaded && !error)) {
            SplashScreen.hideAsync()
        }
    }, [error, isLoading, loaded]);

    if (!loaded && !error) {
        return null;
    }

    Mapbox.setTelemetryEnabled(false);
    return (
        <View style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(map)" />
                <Stack.Screen name="(profile)" />
            </Stack>
            <Footer />
        </View>
    );
};
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