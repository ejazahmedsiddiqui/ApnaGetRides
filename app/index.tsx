import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";
export default function Index() {
    console.log('This is the index page')
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>This is a text area</Text>
                <TouchableOpacity
                    onPress={() => {
                        router.push('/Login');
                    }}
                    style={styles.loginButton}
                >
                    <Text style={styles.loginButtonText}>Go To Login Page</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    map: {
        height: 200,
    },
    header: {
        backgroundColor: '#000',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '800'
    },
    loginButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginTop: 12,
        backgroundColor: '#44a2ee',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#b9dfff',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    }
});
