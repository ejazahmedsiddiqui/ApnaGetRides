import {Text, View, StyleSheet, TouchableOpacity, TextInput} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";
import {Calendar, Search} from "lucide-react-native";
import {useTheme} from "react-native-zustand-theme"

export default function Index() {

    const {theme, toggleMode, isDark} = useTheme();

    console.log('This is the index page');

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
            <View>
                <TouchableOpacity>
                    <Search size={24} color={theme.colors.textSecondary}/>
                    <Text style={{color: theme.colors.textPrimary}}>Enter Your Pickup Location</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Calendar size={24} color={theme.colors.textSecondary}/>
                    <Text>Later</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleMode}>
                    <Text style={{color: theme.colors.textPrimary}}>{isDark ? 'Light Mode' : 'Dark Mode'}</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Text>MAP VIEW</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
});
