import {SafeAreaView} from "react-native-safe-area-context";
import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import RenderFormField from "@/components/RenderFormField";
import {useEffect, useMemo, useState} from "react";
import {router} from "expo-router";
import {useTheme} from "react-native-zustand-theme";

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(0);
    const [resendTimer, setResendTimer] = useState(0);
    const [errors, setErrors] = useState({phone: "", otp: ""});
    const { theme, isDark } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

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

    const isGetOtpDisabled = phoneNumber.length !== 10;
    const isLoginDisabled = otp.length !== 6;
    const isDisabled = step === 0 ? isGetOtpDisabled : isLoginDisabled;

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
                                    labelColorActive={isDark ? '#9ef0ff' : '#9eb1ff'}
                                />)}
                                {step === 1 && (<RenderFormField
                                    label={'Enter your OTP'}
                                    value={otp}
                                    onChangeText={setOtp}
                                    inputType={'numeric'}
                                    maxLength={6}
                                    placeholder={`Enter your 6-digit OTP received on ${phoneNumber}`}
                                    labelColorActive={isDark ? '#9ef0ff' : '#9eb1ff'}
                                />)}
                            </View>
                            <TouchableOpacity
                                style={[
                                    styles.loginButton,
                                    isDisabled && styles.loginButtonDisabled
                                ]}
                                onPress={handleLoginButtonPress}
                                disabled={isDisabled}
                            >
                                <Text
                                    style={[
                                        styles.loginButtonText,
                                        isDisabled && styles.loginButtonTextDisabled
                                    ]}
                                >
                                    {step === 0 ? 'Get OTP' : 'Login'}
                                </Text>
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

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background
    },
    background: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    companyTitle: {
        fontSize: 24,
        color: theme.colors.textSecondary,
        fontWeight: 'semibold'
    },
    appTitle: {
        fontSize: 80,
        color: theme.colors.textPrimary,
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
        paddingVertical: theme.spacing.md,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.accent,
        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: theme.colors.boxShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 4,
    },

    loginButtonDisabled: {
        backgroundColor: theme.colors.border,
        shadowOpacity: 0,
        elevation: 0,
    },

    loginButtonText: {
        color: theme.colors.accentText,
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
    },

    loginButtonTextDisabled: {
        color: theme.colors.textMuted,
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
        color: theme.colors.textSecondary,
    },

})