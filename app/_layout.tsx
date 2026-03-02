import {Stack} from "expo-router";
import { ThemeProvider } from "react-native-zustand-theme";

const App = () =>  {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name={'index'} options={{title: 'Home'}}/>
            <Stack.Screen name={'(auth)'}/>
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
