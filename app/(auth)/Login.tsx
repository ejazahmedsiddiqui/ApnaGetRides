import {SafeAreaView} from "react-native-safe-area-context";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {ImageBackground} from "expo-image";
import {StatusBar} from "expo-status-bar";
import RenderFormField from "@/components/RenderFormField";
import {useState} from "react";

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    return (
        <>
            <StatusBar style={'light'}/>
            <SafeAreaView style={styles.container}>

                <ImageBackground
                    source={{
                        uri: "https://images.unsplash.com/photo-1561819510-d31fda2bd345?w=800&h=800&fit=crop",
                    }}
                    contentFit="cover"
                    style={styles.background}
                >
                    <View style={{
                        backgroundColor: 'rgba(0,0,0,0.82)',
                        flex: 1,
                        paddingVertical: 20,
                        paddingHorizontal: 12,
                    }}>
                        <View style={{
                            marginTop: '30%',
                            alignItems: 'center'
                        }}>
                            <Text style={styles.companyTitle}>Apna</Text>
                            <Text style={styles.appTitle}>GetRide</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <View style={{flex: 1}}>
                                <View style={{flex: 1}}>
                                    <RenderFormField
                                        label={'Phone Number'}
                                        value={phoneNumber}
                                        onChangeText={setPhoneNumber}
                                    />
                                </View>
                                <View>
                                    <Text>Enter Phone Number</Text>
                                </View>
                            </View>
                            <TouchableOpacity>
                                <Text>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </SafeAreaView>
        </>
    )
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    companyTitle: {
        fontSize: 24,
        color: '#cacaca',
        fontWeight: 'semibold'
    },
    appTitle: {
        fontSize: 80,
        color: '#fff',
        fontWeight: 'bold',
    }
})