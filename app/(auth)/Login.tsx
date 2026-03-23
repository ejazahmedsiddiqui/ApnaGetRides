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
import Animated, {
    Easing,
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue, withSpring,
    withTiming
} from "react-native-reanimated";

const useCardFlip = () => {
    const isFlipped = useSharedValue(0);
    const flip = () => {
        isFlipped.value = withTiming(isFlipped.value === 0 ? 1 : 0, {
            duration: 700,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
        })
    }
    return {isFlipped, flip};
}
const Login = () => {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(0);
    const [resendTimer, setResendTimer] = useState(0);
    const [errors, setErrors] = useState([]);

    const titleValue = useSharedValue(0);


    const {loading, getOtp, error} = useOtpLogin();
    const {login, isLoading, message} = useUser();
    const {theme} = useTheme();
    const {isFlipped, flip} = useCardFlip();
    const styles = useMemo(() => createStyles(theme), [theme]);

    useEffect(() => {
        titleValue.value = withSpring(1, {
            mass: 1,
            stiffness: 100,
            damping: 10,
            overshootClamping: false,
        })
    }, []);

    const titleAnimStyle = useAnimatedStyle(() => ({
        transform: [{
            translateY: interpolate(
                titleValue.value, [0, 1], [80, 0]
            )
        }],
        opacity: interpolate(titleValue.value, [0, 1], [0, 1])
    }));


    const frontStyle = useAnimatedStyle(() => ({
        transform: [
            {perspective: 900},
            {rotateY: `${interpolate(isFlipped.value, [0, 1], [0, 180])}deg`}
        ],
        pointerEvents: isFlipped.value > 0.5 ? 'none' : 'auto',
    }));

    const backStyle = useAnimatedStyle(() => ({
        transform: [
            {perspective: 900},
            {rotateY: `${interpolate(isFlipped.value, [0, 1], [180, 360])}deg`}
        ],
        pointerEvents: isFlipped.value < 0.5 ? 'none' : 'auto',
    }));

    useEffect(() => {
        let interval: number = 0;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);


    const handleLoginButtonPress = async () => {
        switch (step) {
            case 0:
                if (phoneNumber.length !== 10) {
                    Alert.alert('Error', `Please Enter 10-digit phone number`);
                    return;
                }
                // Send OTP via your existing hook logic
                const otpSent = await getOtp(phoneNumber)
                if (otpSent) {
                    setStep(1);
                    flip()
                    setResendTimer(30);
                }
                break;

            case 1:
                if (otp.length < 4) { // Adjust based on your API (4 or 6)
                    Alert.alert('Error', `Please Enter a valid OTP`);
                    return;
                }

                const result = await login(phoneNumber, otp);

                if (!result.success) {
                    Alert.alert('Login Failed', result.errorMessage || 'An error occurred');
                    flip()
                    setStep(1);
                    return;
                } else {
                    router.replace('/Profile');
                }
                break;

            default:
                setStep(0);
                flip()
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

    const isGetOtpDisabled = phoneNumber.length !== 10 || loading;
    const isLoginDisabled = otp.length !== 4 || loading;
    const isDisabled = step === 0 ? isGetOtpDisabled : isLoginDisabled;
    return (
        <>
            <StatusBar style={'light'}/>
            <SafeAreaView style={styles.container}>
                <Animated.View style={[styles.titleView, titleAnimStyle]}>
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
                            && !isLoading
                            && <View style={styles.loginContainer}>
                                <View style={styles.formField}>
                                    <Animated.View style={[styles.face, frontStyle]}>
                                        <RenderFormField
                                            label={'Phone Number'}
                                            value={phoneNumber}
                                            onChangeText={setPhoneNumber}
                                            inputType={'numeric'}
                                            maxLength={10}
                                            placeholder={'Enter your 10-digit phone number'}
                                            labelColor={theme.colors.textSecondary}
                                            labelColorActive={theme.colors.textPrimary}
                                            borderColorInactive={theme.colors.border}
                                            borderColorActive={theme.colors.textSecondary}
                                        />
                                    </Animated.View>
                                    <Animated.View style={[styles.face, backStyle]}>
                                        <RenderFormField
                                            label={'Enter your OTP'}
                                            value={otp}
                                            onChangeText={setOtp}
                                            inputType={'numeric'}
                                            maxLength={4}
                                            placeholder={`Enter your 6-digit OTP received on ${phoneNumber}`}
                                            labelColor={theme.colors.textSecondary}
                                            labelColorActive={theme.colors.textPrimary}
                                            borderColorInactive={theme.colors.border}
                                            borderColorActive={theme.colors.textSecondary}
                                        />
                                    </Animated.View>
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
                                        {loading ? 'Loading...' : `${step === 0 ? 'Get OTP' : 'Login'}`}
                                    </Text>
                                </TouchableOpacity>
                                {step !== 0 && <View style={styles.otherOptions}>
                                    <TouchableOpacity
                                        style={styles.subOption}
                                        onPress={() => {
                                            setStep(0);
                                            flip()
                                        }}
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
                        {(isLoading) && <SafeAreaView style={styles.container}>
                            <View style={{
                                flex: 1,
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}>
                                <ActivityIndicator size={32} color={theme.colors.textPrimary}/>
                                {message &&
                                    <Text
                                        style={[styles.resendLink, {color: theme.colors.textSecondary}]}>{message}</Text>}
                            </View>
                        </SafeAreaView>}
                    </View>
                </Animated.View>
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
    titleView: {
        flex: 1,
        width: '100%'
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
        width: '100%',
        height: 70,
        marginVertical: 20,
        transform: [{perspective: 900}],
    },
    face: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 20,
        backfaceVisibility: 'hidden',
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
        marginTop: 12,
        fontSize: 12,
        color: '#3998ff',
    },
    resendDisabled: {
        color: theme.colors.textSecondary,
    },

})