import {StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import React, { useState} from 'react';
import {MaterialCommunityIcons} from "@expo/vector-icons";

type InputType = 'default' | 'numeric' | 'alphabetic' | 'alphanumeric' | 'pincode' | 'phone' | 'aadhaar';

interface RenderFormFieldProps {
    label?: string;
    labelColor?: string;
    labelColorActive?: string;
    borderColorInactive?: string;
    borderColorActive?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    placeholderTextColor?: string;
    editable?: boolean;
    secureTextEntry?: boolean;
    children?: React.ReactNode;
    style?: object;
    inputStyle?: object;
    textColor?: string;
    error?: string;
    icon?: React.ReactElement<{ color?: string }> | null;
    maxLength?: number | null;
    inputType?: InputType;
    onFocusFn?: () => void
}

const RenderFormField = ({
                             label,
                             labelColor = '#fff',
                             labelColorActive = '#5B5FED',
                             borderColorInactive = '#e0e0e0',
                             borderColorActive = '#5B5FED',
                             value,
                             onChangeText,
                             placeholder,
                             keyboardType = 'default',
                             autoCapitalize = 'sentences',
                             placeholderTextColor = '#999',
                             editable = true,
                             secureTextEntry = false,
                             children,
                             style,
                             inputStyle,
                             textColor = '#fff',
                             error = '',
                             icon = null,
                             maxLength = null,
                             inputType = 'default',
                             onFocusFn = () => null,
                         }: RenderFormFieldProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const activeLabelColor = isFocused || value ? labelColorActive : labelColor;

    const handleTextChange = (text: string) => {
        let validatedText = text;

        switch (inputType) {
            case 'numeric':
                validatedText = text.replace(/[^0-9]/g, '');
                break;
            case 'alphabetic':
                validatedText = text.replace(/[^a-zA-Z\s]/g, '');
                break;
            case 'alphanumeric':
                validatedText = text.replace(/[^a-zA-Z0-9\s]/g, '');
                break;
            case 'pincode':
                validatedText = text.replace(/[^0-9]/g, '').slice(0, 6);
                break;
            case 'phone':
                validatedText = text.replace(/[^0-9]/g, '').slice(0, 10);
                break;
            case 'aadhaar':
                validatedText = text.replace(/[^0-9]/g, '').slice(0, 12);
                break;
            default:
                validatedText = text;
        }

        if (maxLength && validatedText.length > maxLength) {
            validatedText = validatedText.slice(0, maxLength);
        }

        onChangeText(validatedText);
    };

    const getKeyboardType = (): RenderFormFieldProps['keyboardType'] => {
        if (keyboardType !== 'default') return keyboardType;

        switch (inputType) {
            case 'numeric':
            case 'pincode':
            case 'phone':
            case 'aadhaar':
                return 'number-pad';
            default:
                return 'default';
        }
    };

    const iconWithColor = icon && React.cloneElement(icon, {
        color: isFocused ? '#5B5FED' : '#9CA3AF'
    });

    return (
        <View style={styles.container}>
            <View style={[styles.formField, style]}>
                {label && (
                    <View style={styles.inputHeader}>
                        <Text style={[styles.inputHeading, {color: activeLabelColor}]}>
                            {label}
                            {maxLength && value && (
                                <Text style={styles.charCount}> ({value.length}/{maxLength})</Text>
                            )}
                        </Text>
                    </View>
                )}
                {children ? (
                    children
                ) : (
                    <View style={[styles.inputField, error && styles.inputFieldError]}>
                        {icon && (
                            <View style={styles.iconContainer}>
                                {iconWithColor}
                            </View>
                        )}
                        <TextInput
                            style={[
                                styles.inputText,
                                inputStyle,
                                {color: textColor},
                                icon && styles.inputWithIcon,
                            ]}
                            value={value}
                            onChangeText={handleTextChange}
                            placeholder={placeholder}
                            placeholderTextColor={placeholderTextColor}
                            keyboardType={getKeyboardType()}
                            autoCapitalize={autoCapitalize}
                            editable={editable}
                            secureTextEntry={secureTextEntry && !showPassword}
                            onFocus={() => {
                                setIsFocused(true)
                                onFocusFn()
                            }}
                            onBlur={() => setIsFocused(false)}
                            maxLength={maxLength ?? undefined}
                        />
                        {secureTextEntry && (
                            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
                                <MaterialCommunityIcons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={22}
                                    color={isFocused ? '#5B5FED' : '#9CA3AF'}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : null}
            </View>
        </View>
    );
};

export default RenderFormField;

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    formField: {
        width: '100%',
    },
    inputHeader: {
        marginBottom: '2%',
    },
    inputHeading: {
        fontFamily: 'Montserrat',
        fontSize: 14,
        fontWeight: '900',
        color: '#6B7280',
        letterSpacing: 0.3,
    },
    charCount: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '400',
    },
    inputField: {
        width: '100%',
        borderWidth: 1.5,
        borderRadius: 8,
        borderColor: '#E5E7EB',
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputFieldError: {
        borderColor: '#DC2626',
        backgroundColor: '#FEF2F2',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        width: 20,
        height: 20,
    },
    inputText: {
        flex: 1,
        color: '#111827',
        fontSize: 15,
        fontWeight: "500",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
    },
    inputWithIcon: {
        paddingLeft: 0,
    },
    errorText: {
        fontFamily: 'Montserrat',
        fontSize: 12,
        fontWeight: '500',
        color: '#DC2626',
        marginTop: 6,
        paddingHorizontal: 4,
    },
    eyeIconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
});