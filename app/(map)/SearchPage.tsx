import React, {useMemo, useState, useEffect, useRef, useCallback} from "react";
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert, Platform, PermissionsAndroid,
} from "react-native";
import Mapbox, {Camera, MapView, UserLocation, UserTrackingMode} from '@rnmapbox/maps';
import {SafeAreaView} from "react-native-safe-area-context";
import {useTheme} from "react-native-zustand-theme";
import {ChevronLeft, LocateFixed} from "lucide-react-native";
import {router} from "expo-router";
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';

const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
};
requestLocationPermission().catch((error) => {
    console.log(error);
});

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
    const [isFollowing, setIsFollowing] = useState<boolean>(true);
    const [userLocation, setUserLocation] = useState<Mapbox.Location>()

    const cameraRef = useRef<Mapbox.Camera>(null)
    const bottomSheetRef = useRef<BottomSheet>(null);

    const snapPoints = useMemo(() => ['15%', '45%', '90%'], [])

    console.log('@/app/map/SearchPage Accessed.');
    const recenterMap = useCallback(() => {
        console.log('recenterMap');
        if (!userLocation) return
        cameraRef.current?.setCamera({
            centerCoordinate: [
                userLocation.coords.longitude,
                userLocation.coords.latitude
            ],
            zoomLevel: 17,
            animationDuration: 700
        })
    }, [userLocation, cameraRef])

    const handleCameraChange = (event: any) => {
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

    useEffect(() => {
        console.log('User Location is: ', userLocation);
    }, [userLocation]);

    const searchPlaces = async (text: string) => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=${mapboxToken}&limit=5`
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
                onCameraChanged={handleCameraChange}
                onRegionDidChange={() => {
                    if (!userLocation) return
                    setIsFollowing(false)
                }}
            >

                <Camera
                    followUserLocation={isFollowing}
                    followZoomLevel={17}
                    followUserMode={UserTrackingMode.FollowWithCourse}
                    animationMode={'easeTo'}
                    ref={cameraRef}
                />

                <UserLocation
                    visible={true}
                    animated={true}
                    androidRenderMode="gps"
                    onUpdate={(location) => setUserLocation(location)}
                />
            </MapView>


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
            {router.canGoBack() &&
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <ChevronLeft size={theme.fontSize.xxl} color={theme.colors.textPrimary}/>
                </TouchableOpacity>}

            <TouchableOpacity
                onPress={recenterMap}
                style={styles.recenterButton}
            >
                <LocateFixed size={24} color={theme.colors.textPrimary}/>
            </TouchableOpacity>
            <BottomSheet
                ref={bottomSheetRef}
                index={2}
                snapPoints={snapPoints}
                enablePanDownToClose={false} keyboardBehavior={'extend'}
                handleIndicatorStyle={{backgroundColor: theme.colors.textPrimary}}
                handleStyle={{backgroundColor: theme.colors.background}}
            >
                <BottomSheetView
                    style={styles.bottomSheet}
                >
                    <Text style={{color: theme.colors.textPrimary}}>This is a bottom Sheet</Text>
                </BottomSheetView>
            </BottomSheet>
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
        backButton: {
            marginTop: 20,
            position: 'absolute',
            top: 20,
            left: 12,
            height: 50,
            width: 50,
            borderRadius: 25,
            backgroundColor: theme.colors.background,
            justifyContent: 'center',
            alignItems: 'center'
        },
        recenterButton: {
            position: 'absolute',
            bottom: 120,
            right: 20,
            backgroundColor: 'white',
            padding: 12,
            borderRadius: 10
        },
        bottomSheet: {
            height: "100%",
            backgroundColor: theme.colors.card,
            paddingVertical: theme.spacing.lg,
            paddingHorizontal: theme.spacing.lg,
        }
    });