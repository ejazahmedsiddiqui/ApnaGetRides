import {Text, View, StyleSheet, TouchableOpacity, TextInput} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";
import {Calendar, SearchAlertIcon} from "lucide-react-native";


export default function Index() {
    console.log('This is the index page')
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <TouchableOpacity >
                    <SearchAlertIcon size={24} color={'#eee'}/>
                    <Text>Enter Your Pickup Location</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Calendar size={24} color={'#eee'}/>
                    <Text>Later</Text>
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
        backgroundColor: '#1e1e1e'
    },
});
