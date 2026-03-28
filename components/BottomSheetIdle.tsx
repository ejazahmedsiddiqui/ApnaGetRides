import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Keyboard,
} from 'react-native'
import { useTheme } from "react-native-zustand-theme";
import { useMemo, useState, useRef, useCallback } from 'react'
import RenderFormField from './RenderFormField';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface MapboxFeature {
    id: string;
    place_name: string;
    text: string;
    center: [number, number]; // [lng, lat]
}

interface SelectedLocation {
    label: string;
    placeName: string;
    coordinates: [number, number];
}

type ActiveField = 'pickup' | 'dropoff' | null;

interface BottomSheetIdleProps {
    onLocationsConfirmed?: (pickup: SelectedLocation, dropoff: SelectedLocation) => void;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MAPBOX_GEOCODING_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '';
const DEBOUNCE_MS = 350;

// ─── Component ───────────────────────────────────────────────────────────────

const BottomSheetIdle = ({ onLocationsConfirmed }: BottomSheetIdleProps) => {
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [pickupText, setPickupText] = useState('');
    const [dropoffText, setDropoffText] = useState('');
    const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
    const [activeField, setActiveField] = useState<ActiveField>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [pickupLocation, setPickupLocation] = useState<SelectedLocation | null>(null);
    const [dropoffLocation, setDropoffLocation] = useState<SelectedLocation | null>(null);

    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchSuggestions = useCallback(async (query: string) => {
        if (!query.trim() || query.length < 2) {
            setSuggestions([]);
            return;
        }
        setIsLoading(true);
        try {
            const url = `${MAPBOX_GEOCODING_URL}/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`;
            const res = await fetch(url);
            const data = await res.json();
            setSuggestions(data.features ?? []);
        } catch (e) {
            console.error('Mapbox geocoding error:', e);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const debouncedFetch = useCallback((query: string) => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => fetchSuggestions(query), DEBOUNCE_MS);
    }, [fetchSuggestions]);

    const handlePickupChange = (text: string) => {
        setPickupText(text);
        setPickupLocation(null);
        setActiveField('pickup');
        debouncedFetch(text);
    };

    const handleDropoffChange = (text: string) => {
        setDropoffText(text);
        setDropoffLocation(null);
        setActiveField('dropoff');
        debouncedFetch(text);
    };

    const handleSuggestionSelect = (feature: MapboxFeature) => {
        const location: SelectedLocation = {
            label: feature.text,
            placeName: feature.place_name,
            coordinates: feature.center,
        };

        if (activeField === 'pickup') {
            setPickupText(feature.place_name);
            setPickupLocation(location);
        } else if (activeField === 'dropoff') {
            setDropoffText(feature.place_name);
            setDropoffLocation(location);
        }

        setSuggestions([]);
        setActiveField(null);
        Keyboard.dismiss();
    };

    const handleConfirm = () => {
        if (pickupLocation && dropoffLocation && onLocationsConfirmed) {
            onLocationsConfirmed(pickupLocation, dropoffLocation);
        }
    };

    const clearField = (field: 'pickup' | 'dropoff') => {
        if (field === 'pickup') {
            setPickupText('');
            setPickupLocation(null);
        } else {
            setDropoffText('');
            setDropoffLocation(null);
        }
        setSuggestions([]);
        setActiveField(field);
    };

    const canConfirm = !!pickupLocation && !!dropoffLocation;
    const showDropdown = suggestions.length > 0 && activeField !== null;

    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Where are you going?</Text>
                <Text style={styles.headerSubtitle}>Set your pickup and drop-off</Text>
            </View>

            {/* Route line indicator */}
            <View style={styles.routeIndicator}>
                <View style={styles.routeDotPickup} />
                <View style={styles.routeLine} />
                <View style={styles.routeDotDropoff} />
            </View>

            {/* Fields */}
            <View style={styles.fieldsContainer}>

                {/* Pickup */}
                <View style={styles.fieldWrapper}>
                    <RenderFormField
                        label="Pickup Location"
                        labelColor={theme.colors.textSecondary}
                        labelColorActive={theme.colors.accent}
                        borderColorInactive={theme.colors.border}
                        borderColorActive={theme.colors.accent}
                        value={pickupText}
                        onChangeText={handlePickupChange}
                        placeholder="Enter pickup point"
                        placeholderTextColor={theme.colors.textMuted}
                        textColor={theme.colors.textPrimary}
                        onFocusFn={() => {
                            setActiveField('pickup');
                            if (pickupText) debouncedFetch(pickupText);
                        }}
                        icon={
                            <MaterialCommunityIcons
                                name="map-marker"
                                size={18}
                                color={theme.colors.accent}
                            />
                        }
                    />
                    {/* Clear button */}
                    {pickupText.length > 0 && (
                        <TouchableOpacity
                            style={styles.clearBtn}
                            onPress={() => clearField('pickup')}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <MaterialCommunityIcons
                                name="close-circle"
                                size={18}
                                color={theme.colors.textMuted}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Swap button */}
                <View style={styles.swapRow}>
                    <View style={styles.swapDivider} />
                    <TouchableOpacity
                        style={[styles.swapBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                        onPress={() => {
                            const tmpText = pickupText;
                            const tmpLoc = pickupLocation;
                            setPickupText(dropoffText);
                            setPickupLocation(dropoffLocation);
                            setDropoffText(tmpText);
                            setDropoffLocation(tmpLoc);
                            setSuggestions([]);
                        }}
                    >
                        <MaterialCommunityIcons
                            name="swap-vertical"
                            size={18}
                            color={theme.colors.accent}
                        />
                    </TouchableOpacity>
                    <View style={styles.swapDivider} />
                </View>

                {/* Dropoff */}
                <View style={styles.fieldWrapper}>
                    <RenderFormField
                        label="Drop-off Location"
                        labelColor={theme.colors.textSecondary}
                        labelColorActive={theme.colors.accent}
                        borderColorInactive={theme.colors.border}
                        borderColorActive={theme.colors.accent}
                        value={dropoffText}
                        onChangeText={handleDropoffChange}
                        placeholder="Enter destination"
                        placeholderTextColor={theme.colors.textMuted}
                        textColor={theme.colors.textPrimary}
                        onFocusFn={() => {
                            setActiveField('dropoff');
                            if (dropoffText) debouncedFetch(dropoffText);
                        }}
                        icon={
                            <MaterialCommunityIcons
                                name="map-marker-check"
                                size={18}
                                color="#E74C3C"
                            />
                        }
                    />
                    {dropoffText.length > 0 && (
                        <TouchableOpacity
                            style={styles.clearBtn}
                            onPress={() => clearField('dropoff')}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <MaterialCommunityIcons
                                name="close-circle"
                                size={18}
                                color={theme.colors.textMuted}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Suggestions Dropdown */}
            {(showDropdown || isLoading) && (
                <View style={[styles.dropdown, {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                    shadowColor: theme.colors.boxShadow,
                }]}>
                    {isLoading ? (
                        <View style={styles.loadingRow}>
                            <ActivityIndicator size="small" color={theme.colors.accent} />
                            <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>
                                Searching...
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={suggestions}
                            keyExtractor={(item) => item.id}
                            keyboardShouldPersistTaps="handled"
                            scrollEnabled={suggestions.length > 4}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.suggestionItem,
                                        index < suggestions.length - 1 && {
                                            borderBottomWidth: 1,
                                            borderBottomColor: theme.colors.border,
                                        }
                                    ]}
                                    onPress={() => handleSuggestionSelect(item)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.suggestionIcon, { backgroundColor: theme.colors.surface }]}>
                                        <MaterialCommunityIcons
                                            name="map-marker-outline"
                                            size={16}
                                            color={theme.colors.accent}
                                        />
                                    </View>
                                    <View style={styles.suggestionText}>
                                        <Text
                                            style={[styles.suggestionName, { color: theme.colors.textPrimary }]}
                                            numberOfLines={1}
                                        >
                                            {item.text}
                                        </Text>
                                        <Text
                                            style={[styles.suggestionAddress, { color: theme.colors.textMuted }]}
                                            numberOfLines={1}
                                        >
                                            {item.place_name}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
            )}

            {/* Confirm CTA */}
            <TouchableOpacity
                style={[
                    styles.confirmBtn,
                    { backgroundColor: canConfirm ? theme.colors.accent : theme.colors.border },
                ]}
                onPress={handleConfirm}
                disabled={!canConfirm}
                activeOpacity={0.85}
            >
                <MaterialCommunityIcons
                    name="arrow-right"
                    size={20}
                    color={theme.colors.accentText}
                    style={{ marginRight: 8 }}
                />
                <Text style={[styles.confirmBtnText, { color: theme.colors.accentText }]}>
                    {canConfirm ? 'Find a Ride' : 'Enter Locations'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default BottomSheetIdle;

// ─── Styles ──────────────────────────────────────────────────────────────────

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.sm,
        paddingBottom: theme.spacing.lg,
    },
    header: {
        marginBottom: theme.spacing.md,
    },
    headerTitle: {
        fontFamily: 'Montserrat',
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.textPrimary,
        letterSpacing: 0.2,
    },
    headerSubtitle: {
        fontFamily: 'Montserrat',
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.regular,
        color: theme.colors.textMuted,
        marginTop: 2,
    },

    // Route indicator
    routeIndicator: {
        position: 'absolute',
        left: theme.spacing.md - 2,
        top: 90,
        alignItems: 'center',
        zIndex: 1,
    },
    routeDotPickup: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.accent,
    },
    routeLine: {
        width: 2,
        height: 36,
        backgroundColor: theme.colors.border,
        marginVertical: 2,
    },
    routeDotDropoff: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#E74C3C',
    },

    // Fields
    fieldsContainer: {
        width: '100%',
    },
    fieldWrapper: {
        position: 'relative',
        width: '100%',
    },
    clearBtn: {
        position: 'absolute',
        right: 12,
        bottom: 14,
        zIndex: 10,
    },

    // Swap
    swapRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
        paddingHorizontal: 4,
    },
    swapDivider: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.border,
    },
    swapBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },

    // Dropdown
    dropdown: {
        width: '100%',
        borderWidth: 1,
        borderRadius: theme.radius.md,
        marginTop: 4,
        marginBottom: theme.spacing.sm,
        overflow: 'hidden',
        maxHeight: 240,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 6,
    },
    loadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        gap: 10,
    },
    loadingText: {
        fontFamily: 'Montserrat',
        fontSize: theme.fontSize.sm,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 12,
        gap: 12,
    },
    suggestionIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    suggestionText: {
        flex: 1,
    },
    suggestionName: {
        fontFamily: 'Montserrat',
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium,
    },
    suggestionAddress: {
        fontFamily: 'Montserrat',
        fontSize: theme.fontSize.sm,
        marginTop: 1,
    },

    // CTA
    confirmBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing.md,
        paddingVertical: 14,
        borderRadius: theme.radius.md,
    },
    confirmBtnText: {
        fontFamily: 'Montserrat',
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.bold,
        letterSpacing: 0.3,
    },
});