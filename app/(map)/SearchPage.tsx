import React, {useMemo, useState, useEffect} from "react";
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    ActivityIndicator, Alert, Platform, PermissionsAndroid,
} from "react-native";
import Mapbox, { Camera, MapView, UserLocation, UserTrackingMode } from '@rnmapbox/maps';import {SafeAreaView} from "react-native-safe-area-context";
import {useTheme} from "react-native-zustand-theme";

const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
};
requestLocationPermission().catch((error) => {console.log(error);});

const mapboxToken: string | null = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || null

Mapbox.setAccessToken(mapboxToken)
    .then(() => console.log('Mapbox connected'))
    .catch((error) => {
        Alert.alert('Error', 'Unable to load Map. Check your connection and try again.')
        console.log(error);
    });

const SearchPage = () => {
    const {theme} = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const [isFollowing, setIsFollowing] = useState<boolean | any>(true);

    const handleCameraChange = (event: any) => {
        // event.gesture indicates if the user moved the map with their finger
        if (event.gesture) {
            setIsFollowing(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const delay = setTimeout(() => {
            if (query.length > 2) {
                searchPlaces(query);
            } else {
                setResults([]);
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [query]);

    const searchPlaces = async (text: string) => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=YOUR_MAPBOX_ACCESS_TOKEN&limit=5`
            );
            const data = await response.json();
            setResults(data.features || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (item: any) => {
        setSelectedLocation(item);
        setResults([]);
        setQuery(item.place_name);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* MAP */}
            <MapView
                style={styles.map}
                onCameraChanged={handleCameraChange} // Replacement for onDragStart
            >
                <Camera
                    followUserLocation={isFollowing}
                    followZoomLevel={17}
                    // Use the UserTrackingMode enum to satisfy TypeScript
                    followUserMode={UserTrackingMode.FollowWithCourse}
                    animationMode={'easeTo'}
                />

                <UserLocation
                    visible={true}
                    animated={true}
                    androidRenderMode="gps"
                />
            </MapView>

            {/* SEARCH OVERLAY */}
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Where to?"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={query}
                    onChangeText={setQuery}
                    style={styles.input}
                />
                {loading && <ActivityIndicator size="small" />}
            </View>

            {/* RESULTS LIST */}
            {results.length > 0 && (
                <View style={styles.resultsContainer}>
                    <FlatList
                        data={results}
                        keyExtractor={(item) => item.id}
                        renderItem={({item}) => (
                            <TouchableOpacity
                                style={styles.resultItem}
                                onPress={() => handleSelect(item)}
                            >
                                <Text style={styles.resultText}>
                                    {item.place_name}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

export default SearchPage;

const createStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        map: {
            flex: 1,
        },
        markerContainer: {
            alignItems: "center",
            justifyContent: "center",
        },
        marker: {
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: "#000",
            borderWidth: 3,
            borderColor: "#fff",
        },
        searchContainer: {
            position: "absolute",
            top: 20,
            left: 16,
            right: 16,
            backgroundColor: theme.colors.card,
            borderRadius: 12,
            padding: 12,
            elevation: 6,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 8,
        },
        input: {
            fontSize: 16,
            color: theme.colors.textPrimary,
        },
        resultsContainer: {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: 300,
            backgroundColor: theme.colors.card,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingVertical: 12,
        },
        resultItem: {
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        resultText: {
            color: theme.colors.textPrimary,
            fontSize: 14,
        },
    });