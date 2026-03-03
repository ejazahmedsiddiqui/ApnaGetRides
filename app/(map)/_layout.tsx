import {Stack} from "expo-router";

const MapLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name={'SearchPage'} options={{title: 'Search'}}/>
        </Stack>
    )
};
export default MapLayout;