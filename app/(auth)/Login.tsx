import {SafeAreaView} from "react-native-safe-area-context";
import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import RenderFormField from "@/components/RenderFormField";
import {useEffect, useState} from "react";
import {router} from "expo-router";

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(0);
    const [resendTimer, setResendTimer] = useState(0);
    const [errors, setErrors] = useState({phone: "", otp: ""});

    useEffect(() => {
        let interval: number = 0;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleLoginButtonPress = () => {
        switch (step) {
            case 0:
                if (phoneNumber.length !== 10) {
                    Alert.alert('Error', `Please Enter 10-digit phone number`);
                    return;
                }
                setStep(1);
                setResendTimer(30);
                break;
            case 1:
                if (otp.length !== 6) {
                    Alert.alert('Error', `Please Enter 6-digit OTP`);
                    return;
                }
                router.push('/')
                break;
            default:
                setStep(0);
                setResendTimer(0);
                break;
        }
    };

    const handleResendOTP = () => {
        if (resendTimer > 0) return;
        setOtp("");
        setErrors({...errors, otp: ""});
        setResendTimer(30);
    };
    return (
        <>
            <StatusBar style={'light'}/>
            <SafeAreaView style={styles.container}>
                    <View style={styles.background}>
                        <View style={{
                            marginTop: '30%',
                            alignItems: 'center'
                        }}>
                            <Text style={styles.companyTitle}>Apna</Text>
                            <Text style={styles.appTitle}>GetRide</Text>
                        </View>
                        <View style={styles.loginContainer}>
                            <View style={styles.formField}>
                                {step === 0 && (<RenderFormField
                                    label={'Phone Number'}
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    inputType={'numeric'}
                                    maxLength={10}
                                    placeholder={'Enter your 10-digit phone number'}
                                    labelColorActive={'#9ef0ff'}
                                />)}
                                {step === 1 && (<RenderFormField
                                    label={'Enter your OTP'}
                                    value={otp}
                                    onChangeText={setOtp}
                                    inputType={'numeric'}
                                    maxLength={6}
                                    placeholder={`Enter your 6-digit OTP received on ${phoneNumber}`}
                                    labelColorActive={'#9ef0ff'}
                                />)}
                            </View>
                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={handleLoginButtonPress}
                            >
                                <Text style={styles.loginButtonText}>{step === 0 ? 'Get OTP' : 'Login'}</Text>
                            </TouchableOpacity>
                            {step !== 0 && <View style={styles.otherOptions}>
                                <TouchableOpacity
                                    style={styles.subOption}
                                    onPress={() => setStep(0)}
                                >
                                    <Text style={styles.subOptionText}>
                                        Change Phone Number?
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleResendOTP}
                                    disabled={resendTimer > 0}
                                >
                                    <Text
                                        style={[
                                            styles.resendLink,
                                            resendTimer > 0 && styles.resendDisabled,
                                        ]}
                                    >
                                        {resendTimer > 0
                                            ? `Resend in ${resendTimer}s`
                                            : "Resend OTP"}
                                    </Text>
                                </TouchableOpacity>
                            </View>}
                        </View>
                    </View>
            </SafeAreaView>
        </>
    )
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e'
    },
    background: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
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
    },
    loginContainer: {
        marginTop: '30%',
        paddingHorizontal: 20,
        flex: 1,
        alignItems: 'center',
    },
    formField: {
        // flex: 1,
        marginVertical: 20,
    },
    loginButton: {
        width: '100%',
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderColor: '#6c6c6c',
        borderWidth: 1,
        boxShadow: '2px 4px 8px rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'semibold',
        lineHeight: 24,
    },
    otherOptions: {
        width: '100%',
        marginTop: '4%',
        paddingHorizontal: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subOption: {},
    subOptionText: {
        fontSize: 12,
        color: '#3998ff'
    },
    resendLink: {
        fontSize: 12,
        color: '#3998ff',
    },

    resendDisabled: {
        color: '#ccc',
    },
})