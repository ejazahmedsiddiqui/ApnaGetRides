import {Stack} from "expo-router";
import {ThemeProvider} from "react-native-zustand-theme";
import Mapbox from "@rnmapbox/maps";
import {Platform, UIManager, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {UserProvider} from '@/context/UserContext';
import Footer from "@/components/Footer";

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}
const App = () => {
    Mapbox.setTelemetryEnabled(false);
    return (
        <View style={{flex :1}}>
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
            <UserProvider>
                <ThemeProvider>
                    <App/>
                </ThemeProvider>
            </UserProvider>
        </GestureHandlerRootView>
    )
}
