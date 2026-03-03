import {Stack} from "expo-router";
import { ThemeProvider } from "react-native-zustand-theme";
import Mapbox from "@rnmapbox/maps";

const App = () =>  {
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
        </Stack>
    )
}

export default function RootLayout() {
    return (
        <ThemeProvider>
            <App />
        </ThemeProvider>
    )
}
