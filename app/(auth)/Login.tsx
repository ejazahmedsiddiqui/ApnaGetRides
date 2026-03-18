import {SafeAreaView} from "react-native-safe-area-context";
import {ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import RenderFormField from "@/components/RenderFormField";
import {useEffect, useMemo, useState} from "react";
import {router} from "expo-router";
import {useTheme} from "react-native-zustand-theme";
import {useOtpLogin} from "@/hooks/useOtpLogin";
import {AlertTriangle} from "lucide-react-native";
import {useUser} from "@/context/UserContext";

const Login = () => {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(0);
    const [resendTimer, setResendTimer] = useState(0);
    const [errors, setErrors] = useState([]);
    const {theme, isDark} = useTheme();

    const {login, isLoading, message, isAuthenticated} = useUser();
    const {loading, getOtp, error} = useOtpLogin();
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

    useEffect(() => {
        if(isAuthenticated)
            router.replace('/Profile')
    }, [isAuthenticated]);


    const handleLoginButtonPress = async () => {
        switch (step) {
            case 0:
                if (phoneNumber.length !== 10) {
                    Alert.alert('Error', `Please Enter 10-digit phone number`);
                    return;
                }
                // Send OTP via your existing hook logic
                const otpSent = await getOtp(phoneNumber)
                    .then();
                if (otpSent) {
                    setStep(1);
                    setResendTimer(30);
                }
                break;

            case 1:
                if (otp.length < 4) { // Adjust based on your API (4 or 6)
                    Alert.alert('Error', `Please Enter a valid OTP`);
                    return;
                }

                // 3. Use the Context Login to handle verification and profile fetching
                const result: { success: boolean; error?: any; errorMessage?: string; errorStatus?: number } = await login(phoneNumber, otp);

                if (result.success) {
                    // Navigate home - UserContext now holds the profile and token
                    router.replace('/');
                } else {
                    Alert.alert('Login Failed', result.errorMessage || 'An error occurred');
                }
                break;

            default:
                setStep(0);
                break;
        }
    };

    const handleResendOTP = () => {
        if (resendTimer > 0) return;
        setOtp("");
        setErrors({...errors});
        setOtp('')
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
                    {error?.message && !loading && !isLoading && (
                        <View style={styles.formField}>
                            <View style={styles.errorContainer}>
                                <AlertTriangle size={24} color={'yellow'} fill={'red'}/>
                                <Text style={styles.errorText}>{error.message}</Text>
                                <AlertTriangle size={24} color={'yellow'} fill={'red'}/>
                            </View>
                        </View>
                    )}
                    {
                        !error?.message
                        && !loading
                        && !isLoading
                        && <View style={styles.loginContainer}>
                            <View style={styles.formField}>
                                {step === 0 && (<RenderFormField
                                    label={'Phone Number'}
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    inputType={'numeric'}
                                    maxLength={10}
                                    placeholder={'Enter your 10-digit phone number'}
                                    labelColorActive={isDark ? '#00859e' : '#9efffc'}
                                />)}
                                {step === 1 && !loading && (<RenderFormField
                                    label={'Enter your OTP'}
                                    value={otp}
                                    onChangeText={setOtp}
                                    inputType={'numeric'}
                                    maxLength={4}
                                    placeholder={`Enter your 6-digit OTP received on ${phoneNumber}`}
                                    labelColorActive={isDark ? '#002127' : '#9efffc'}                                />)}
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
                        </View>}
                    {(loading || isLoading) && <SafeAreaView style={styles.container}>
                        <View style={{
                            flex: 1,
                            justifyContent: 'flex-start',
                            alignItems: 'center'
                        }}>
                            <ActivityIndicator size={50} color={theme.colors.textPrimary}/>
                            {message && <Text style={styles.resendLink}>{message}</Text>}
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
        fontSize: 12,
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