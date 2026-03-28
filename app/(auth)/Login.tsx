import {SafeAreaView} from "react-native-safe-area-context";
import {ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import RenderFormField from "@/components/RenderFormField";
import {useEffect, useMemo, useState} from "react";
import {router} from "expo-router";
import {useTheme} from "react-native-zustand-theme";
import {useOtpLogin} from "@/hooks/useOtpLogin";
import {AlertTriangle, CheckCircle, Loader} from "lucide-react-native";
import {useUser} from "@/context/UserContext";
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

const useCardFlip = () => {
    const flip1 = useSharedValue(0);
    const flip2 = useSharedValue(0);

    const flipTo = (page: 0 | 1 | 2) => {
        const cfg = {duration: 700, easing: Easing.bezier(0.4, 0, 0.2, 1)};
        if (page === 0) {
            flip1.value = withTiming(0, cfg);
            flip2.value = withTiming(0, cfg);
        } else if (page === 1) {
            flip1.value = withTiming(1, cfg);
            flip2.value = withTiming(0, cfg);
        } else {
            flip1.value = withTiming(1, cfg);
            flip2.value = withTiming(1, cfg);
        }
    };

    return {flip1, flip2, flipTo};
};

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
    const {flip1, flip2, flipTo} = useCardFlip();
    const styles = useMemo(() => createStyles(theme), [theme]);

    useEffect(() => {
        titleValue.value = withSpring(1, {
            mass: 1,
            stiffness: 100,
            damping: 10,
            overshootClamping: false,
        });
    }, []);

    const titleAnimStyle = useAnimatedStyle(() => ({
        transform: [{translateY: interpolate(titleValue.value, [0, 1], [380, 0])}],
        opacity: interpolate(titleValue.value, [0, 1], [0, 1]),
    }));

    const phoneStyle = useAnimatedStyle(() => ({
        transform: [
            {perspective: 900},
            {rotateX: `${interpolate(flip1.value, [0, 1], [0, 180])}deg`},
        ],
        pointerEvents: flip1.value > 0.5 ? 'none' : 'auto',
    }));

    const otpStyle = useAnimatedStyle(() => ({
        transform: [
            {perspective: 900},
            {
                rotateX: `${
                    interpolate(flip1.value, [0, 1], [180, 360]) +
                    interpolate(flip2.value, [0, 1], [0, 180])
                }deg`,
            },
        ],
        pointerEvents: flip1.value < 0.5 || flip2.value > 0.5 ? 'none' : 'auto',
    }));

    const loadingStyle = useAnimatedStyle(() => ({
        transform: [
            {perspective: 900},
            {rotateX: `${interpolate(flip2.value, [0, 1], [180, 360])}deg`},
        ],
        pointerEvents: flip2.value < 0.5 ? 'none' : 'auto',
    }));

    useEffect(() => {
        let interval: any = 0;
        if (resendTimer > 0) {
            interval = setInterval(() => setResendTimer((p) => p - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleLoginButtonPress = async () => {
        switch (step) {
            case 0:
                if (phoneNumber.length !== 10) return;
                const otpSent = await getOtp(phoneNumber);
                if (otpSent) {
                    setStep(1);
                    flipTo(1);
                    setResendTimer(30);
                }
                break;

            case 1:
                if (otp.length < 4) return;
                flipTo(2);
                const result = await login(phoneNumber, otp);
                if (!result.success) {
                    Alert.alert('Error', result.errorMessage || 'An error occurred: ' + result?.error?.message);
                    flipTo(1);
                    setStep(1);
                } else {
                    router.replace('/');
                }
                break;

            default:
                setStep(0);
                flipTo(0);
                break;
        }
    };

    const handleResendOTP = () => {
        if (resendTimer > 0) return;
        setOtp('');
        setErrors({...errors});
        setResendTimer(30);
    };

    const isGetOtpDisabled = phoneNumber.length !== 10 || loading;
    const isLoginDisabled = otp.length !== 4 || loading;

    return (
        <>
            <StatusBar style={'light'}/>
            <SafeAreaView style={styles.container}>
                <Animated.View style={[styles.titleView, titleAnimStyle]}>
                    <View style={styles.background}>

                        <View style={{marginTop: '30%', alignItems: 'center'}}>
                            <Text style={styles.companyTitle}>Apna</Text>
                            <Text style={styles.appTitle}>GetRide</Text>
                        </View>

                        {error?.message && !loading && !isLoading && (
                            <View style={styles.errorBanner}>
                                <View style={styles.errorIconWrap}>
                                    <AlertTriangle size={18} color={'#ff4d4d'} fill={'#ff4d4d22'}/>
                                </View>
                                <Text style={styles.errorBannerText} numberOfLines={2}>
                                    {error.message}
                                </Text>
                                <View style={styles.errorPulse}/>
                            </View>
                        )}

                        {!error?.message && (
                            <View style={styles.loginContainer}>
                                <View style={styles.formField}>

                                    <Animated.View style={[styles.face, phoneStyle]}>
                                        <RenderFormField
                                            label={'Phone Number'}
                                            value={phoneNumber}
                                            onChangeText={setPhoneNumber}
                                            inputType={'numeric'}
                                            maxLength={10}
                                            placeholder={'Enter your 10-digit phone number'}
                                            labelColor={theme.colors.textSecondary}
                                            labelColorActive={theme.colors.textPrimary}
                                            inputStyle={{
                                                backgroundColor: theme.colors.background,
                                            }}
                                            textColor={theme.colors.textSecondary}
                                            borderColorActive={theme.colors.textPrimary}
                                            borderColorInactive={theme.colors.border}
                                        />
                                        <TouchableOpacity
                                            style={[styles.loginButton, isGetOtpDisabled && styles.loginButtonDisabled]}
                                            onPress={handleLoginButtonPress}
                                            disabled={isGetOtpDisabled}
                                        >
                                            <Text
                                                style={[styles.loginButtonText, isGetOtpDisabled && styles.loginButtonTextDisabled]}>
                                                {loading ? 'Sending…' : 'Get OTP'}
                                            </Text>
                                        </TouchableOpacity>
                                    </Animated.View>

                                    <Animated.View style={[styles.face, otpStyle]}>
                                        <RenderFormField
                                            label={'Enter your OTP'}
                                            value={otp}
                                            onChangeText={setOtp}
                                            inputType={'numeric'}
                                            maxLength={4}
                                            placeholder={`OTP sent to ${phoneNumber}`}
                                            labelColor={theme.colors.textSecondary}
                                            labelColorActive={theme.colors.textPrimary}
                                            inputStyle={{
                                                backgroundColor: theme.colors.background,
                                                paddingLeft: 4,
                                            }}
                                            textColor={theme.colors.textSecondary}
                                            borderColorActive={theme.colors.textPrimary}
                                            borderColorInactive={theme.colors.border}
                                        />
                                        <TouchableOpacity
                                            style={[styles.loginButton, isLoginDisabled && styles.loginButtonDisabled]}
                                            onPress={handleLoginButtonPress}
                                            disabled={isLoginDisabled}
                                        >
                                            <Text
                                                style={[styles.loginButtonText, isLoginDisabled && styles.loginButtonTextDisabled]}>
                                                {loading ? 'Verifying…' : 'Verify OTP'}
                                            </Text>
                                        </TouchableOpacity>
                                        <View style={styles.otherOptions}>
                                            <TouchableOpacity
                                                style={styles.subOption}
                                                onPress={() => {
                                                    setStep(0);
                                                    flipTo(0);
                                                }}
                                            >
                                                <Text style={styles.subOptionText}>Change Number?</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={handleResendOTP} disabled={resendTimer > 0}>
                                                <Text
                                                    style={[styles.resendLink, resendTimer > 0 && styles.resendDisabled]}>
                                                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </Animated.View>

                                    <Animated.View style={[styles.face, loadingStyle]}>
                                        <View style={styles.loadingCard}>
                                            <View style={styles.loadingRingOuter}>
                                                <View style={styles.loadingRingInner}>
                                                    <ActivityIndicator
                                                        size={28}
                                                        color={theme.colors.accent}
                                                    />
                                                </View>
                                            </View>

                                            <Text style={[styles.loadingTitle, {color: theme.colors.textPrimary}]}>
                                                Verifying
                                            </Text>

                                            {message ? (
                                                <View style={styles.loadingMessageRow}>
                                                    <CheckCircle size={13} color={theme.colors.textSecondary}/>
                                                    <Text
                                                        style={[styles.loadingMessage, {color: theme.colors.textSecondary}]}>
                                                        {message}
                                                    </Text>
                                                </View>
                                            ) : (
                                                <Text
                                                    style={[styles.loadingSubtitle, {color: theme.colors.textSecondary}]}>
                                                    Hang tight, this takes a moment…
                                                </Text>
                                            )}

                                            <View style={styles.loadingDots}>
                                                {[0, 1, 2].map((i) => (
                                                    <View
                                                        key={i}
                                                        style={[
                                                            styles.dot,
                                                            {
                                                                backgroundColor: theme.colors.accent,
                                                                opacity: 0.3 + i * 0.3
                                                            },
                                                        ]}
                                                    />
                                                ))}
                                            </View>
                                        </View>
                                    </Animated.View>

                                </View>
                            </View>
                        )}

                    </View>
                </Animated.View>
            </SafeAreaView>
        </>
    );
};

export default Login;

const createStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        background: {
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 20,
        },
        titleView: {
            flex: 1,
            width: '100%',
        },
        companyTitle: {
            fontSize: 24,
            color: theme.colors.textSecondary,
            fontWeight: 'semibold',
        },
        appTitle: {
            fontSize: 80,
            color: theme.colors.textPrimary,
            fontWeight: 'bold',
        },

        errorBanner: {
            marginTop: 20,
            marginHorizontal: 4,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderRadius: 16,
            backgroundColor: '#1a0a0a',
            borderWidth: 1,
            borderColor: '#ff4d4d55',
            overflow: 'hidden',
        },
        errorPulse: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: '#ff4d4d',
            opacity: 0.7,
        },
        errorIconWrap: {
            width: 32,
            height: 32,
            borderRadius: 10,
            backgroundColor: '#ff4d4d18',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#ff4d4d33',
            flexShrink: 0,
        },
        errorBannerText: {
            flex: 1,
            fontSize: 13,
            color: '#ff8080',
            lineHeight: 18,
            letterSpacing: 0.2,
        },

        loginContainer: {
            paddingHorizontal: 20,
            flex: 1,
            alignItems: 'center',
        },
        formField: {
            width: '100%',
            height: '40%',
            transform: [{perspective: 900}],
        },
        face: {
            ...StyleSheet.absoluteFillObject,
            borderRadius: 20,
            backfaceVisibility: 'hidden',
            justifyContent: 'flex-start',
            gap: 12,
        },

        loadingCard: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            paddingVertical: 24,
            paddingHorizontal: 20,
            borderRadius: 20,
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        loadingRingOuter: {
            width: 72,
            height: 72,
            borderRadius: 36,
            borderWidth: 1,
            borderColor: theme.colors.border,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 4,
        },
        loadingRingInner: {
            width: 52,
            height: 52,
            borderRadius: 26,
            borderWidth: 1.5,
            borderColor: theme.colors.accent + '55',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.accent + '0f',
        },
        loadingTitle: {
            fontSize: 17,
            fontWeight: '600',
            letterSpacing: 0.4,
        },
        loadingSubtitle: {
            fontSize: 12,
            letterSpacing: 0.2,
            textAlign: 'center',
            opacity: 0.7,
        },
        loadingMessageRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        loadingMessage: {
            fontSize: 12,
            letterSpacing: 0.2,
        },
        loadingDots: {
            flexDirection: 'row',
            gap: 6,
            marginTop: 8,
        },
        dot: {
            width: 5,
            height: 5,
            borderRadius: 3,
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
            paddingHorizontal: 4,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        subOption: {},
        subOptionText: {
            fontSize: 12,
            color: '#3998ff',
        },
        resendLink: {
            fontSize: 12,
            color: '#3998ff',
        },
        resendDisabled: {
            color: theme.colors.textSecondary,
        },
    });