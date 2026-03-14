import {SafeAreaView} from "react-native-safe-area-context";
import {ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import RenderFormField from "@/components/RenderFormField";
import {useEffect, useMemo, useState} from "react";
import {router} from "expo-router";
import {useTheme} from "react-native-zustand-theme";
import {useUser} from "@/context/UserContext";
import {useOtpLogin} from "@/hooks/useOtpLogin";
import {AlertTriangle} from "lucide-react-native";

const Login = () => {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(0);
    const [resendTimer, setResendTimer] = useState(0);
    const [errors, setErrors] = useState({phone: "", otp: ""});
    const {theme, isDark} = useTheme();
    const {login} = useUser();
    const {data, loading, getOtp, verifyOtp, error} = useOtpLogin()
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
                getOtp(phoneNumber).then(() => setStep(1))
                setResendTimer(30);
                break;
            case 1:
                if (otp.length !== 4) {
                    Alert.alert('Error', `Please Enter 6-digit OTP`);
                    return;
                }
                verifyOtp(otp)
                    .then(() => router.push('/'))
                    .catch((error) => console.log('@/app/auth/Login ⟼ verifyOtp Error is', error));
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
    const isLoginDisabled = otp.length !== 4;
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
                    {error && !loading && (
                        <View style={styles.formField}>
                            <View style={styles.errorContainer}>
                                <AlertTriangle size={24} color={'yellow'} fill={'red'}/>
                                <Text style={styles.errorText}>{error}</Text>
                                <AlertTriangle size={24} color={'yellow'} fill={'red'}/>
                            </View>
                        </View>
                    )}
                    {!error && !loading && <View style={styles.loginContainer}>
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
                            {step === 1 && !loading && (<RenderFormField
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
                            {data && data.otp && <Text style={{
                                color: theme.colors.textPrimary
                            }}>OTP is: {data?.otp}</Text>}
                        </View>}
                    </View>}
                    {loading && <SafeAreaView style={styles.container}>
                        <View style={{
                            flex: 1,
                            justifyContent: 'flex-start',
                            alignItems: 'center'
                        }}>
                            <ActivityIndicator size={50} color={theme.colors.textPrimary}/>
                        </View>
                    </SafeAreaView>}
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
        paddingHorizontal: 20,
        flex: 1,
        alignItems: 'center',
    },
    formField: {
        // flex: 1,
        marginVertical: 20,
    },
    errorContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: '4%',
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: theme.colors.border
    },
    errorText: {
        fontSize: 25,
        color: theme.colors.textPrimary
    },
    loginButton: {
        width: '100%',
        paddingVertical: theme.spacing.md,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.accent,
        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: theme.colors.boxShadow,
        shadowOffset: {width: 0, height: 4},
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