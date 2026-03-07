import {Stack} from "expo-router";
import {ThemeProvider} from "react-native-zustand-theme";
import Mapbox from "@rnmapbox/maps";
import {Platform, UIManager} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {UserProvider} from '@/context/UserContext';
if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}
const App = () => {
    Mapbox.setTelemetryEnabled(false);
    return (
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
