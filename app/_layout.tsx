import {Stack} from "expo-router";
import {ThemeProvider} from "react-native-zustand-theme";
import Mapbox from "@rnmapbox/maps";
import {ActivityIndicator, Platform, UIManager, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Footer from "@/components/Footer";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {UserProvider, useUser} from "@/context/UserContext";
import {SafeAreaView} from "react-native-safe-area-context";
import {useEffect} from "react";

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const queryClient = new QueryClient();
const App = () => {
    const { isAuthenticated, isLoading } = useUser();
    useEffect(() => {
        console.log('Authentication Status: ', isAuthenticated);
    }, [isAuthenticated]);

    if (isLoading) {
        return (
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <ActivityIndicator size={24} color={'lime'} />
            </SafeAreaView>
        )
    }
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
