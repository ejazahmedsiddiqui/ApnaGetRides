import React, {useMemo, useState, useEffect, useRef, useCallback} from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Alert, Platform, PermissionsAndroid, AppState, AppStateStatus,
} from "react-native";
import Mapbox, {Camera, MapView, UserLocation, UserTrackingMode} from '@rnmapbox/maps';
import {SafeAreaView} from "react-native-safe-area-context";
import {useTheme} from "react-native-zustand-theme";
import {ChevronLeft, LocateFixed} from "lucide-react-native";
import {router} from "expo-router";
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import BottomSheetIdle from "@/components/BottomSheetIdle";

// Default coordinates: Red Fort, New Delhi
const RED_FORT_COORDS = {
    latitude: 28.6562,
    longitude: 77.2410,
};

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

    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [userLocation, setUserLocation] = useState<Mapbox.Location | undefined>(undefined);
    const [gpsAvailable, setGpsAvailable] = useState<boolean>(false);
    const cameraRef = useRef<Mapbox.Camera>(null)
    const bottomSheetRef = useRef<BottomSheet>(null);

    // Throttle config — only commit a new userLocation to state when the user
    // has moved at least MIN_DISTANCE_METRES *or* MIN_INTERVAL_MS has elapsed.
    // its own rendering; these thresholds only gate React state updates.
    const MIN_DISTANCE_METRES = 10;
    const MIN_INTERVAL_MS = 5000;
    const lastCommittedLocation = useRef<Mapbox.Location | null>(null);
    const lastCommittedTime = useRef<number>(0);

    const snapPoints = useMemo(() => ['15%', '45%', '90%'], [])

    const recenterMap = useCallback(() => {
        if (!userLocation) return;
        // Also re-enable follow mode so the camera keeps tracking the user
        setIsFollowing(true);
        cameraRef.current?.setCamera({
            centerCoordinate: [
                userLocation.coords.longitude,
                userLocation.coords.latitude
            ],
            zoomLevel: 17,
            animationDuration: 700
        });
    }, [userLocation]);

    const handleCameraChange = (event: any) => {
        // Only break follow mode on a real user gesture, not programmatic moves
        if (event.gesture) {
            setIsFollowing(false);
        }
    };

    // Haversine distance in metres between two lat/lng pairs
    const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371000;
        const toRad = (x: number) => (x * Math.PI) / 180;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    // When GPS comes online for the first time, snap to user and enable follow.
    // After that, only update state when the user has moved MIN_DISTANCE_METRES
    // or MIN_INTERVAL_MS has passed — whichever comes first.
    const handleLocationUpdate = useCallback((location: Mapbox.Location) => {
        const now = Date.now();
        const prev = lastCommittedLocation.current;

        if (!gpsAvailable) {
            // First fix ever, or GPS returning after being turned off —
            // always commit immediately and re-enable the UI
            lastCommittedLocation.current = location;
            lastCommittedTime.current = now;
            setUserLocation(location);
            setGpsAvailable(true);
            setIsFollowing(true);
            return;
        }

        const timeSinceLast = now - lastCommittedTime.current;
        const distanceMoved = prev
            ? haversineDistance(
                prev.coords.latitude, prev.coords.longitude,
                location.coords.latitude, location.coords.longitude
            )
            : Infinity;

        if (distanceMoved >= MIN_DISTANCE_METRES || timeSinceLast >= MIN_INTERVAL_MS) {
            lastCommittedLocation.current = location;
            lastCommittedTime.current = now;
            setUserLocation(location);
        }
    }, [gpsAvailable]);

    const GPS_TIMEOUT_MS = 15000; // if no update in 15s, consider GPS off

    useEffect(() => {
        const checkGpsAlive = () => {
            if (!gpsAvailable) return; // not yet acquired, nothing to revoke
            const elapsed = Date.now() - lastCommittedTime.current;
            if (elapsed > GPS_TIMEOUT_MS) {
                setGpsAvailable(false);
                setIsFollowing(false);
            }
        };

        // Re-check every time the app comes to the foreground
        const handleAppStateChange = (nextState: AppStateStatus) => {
            if (nextState === 'active') checkGpsAlive();
        };
        const appStateSub = AppState.addEventListener('change', handleAppStateChange);

        // Also poll every GPS_TIMEOUT_MS in case GPS dies without an app switch
        const interval = setInterval(checkGpsAlive, GPS_TIMEOUT_MS);

        return () => {
            appStateSub.remove();
            clearInterval(interval);
        };
    }, [gpsAvailable]);

    // Debounce search



    return (
        <SafeAreaView style={styles.container}>
            {/* MAP */}
            <MapView
                style={styles.map}
                onCameraChanged={handleCameraChange}
                // FIX: removed onMapIdle — it was firing immediately and killing isFollowing
                onMapIdle={() => {
                    if (!userLocation) return
                    setIsFollowing(false)
                }}
            >
                {userLocation ? <Camera
                        followUserLocation={isFollowing}
                        followZoomLevel={17}
                        followUserMode={UserTrackingMode.FollowWithCourse}
                        animationMode={'easeTo'}
                        ref={cameraRef}
                    /> :
                    <Camera
                        centerCoordinate={[RED_FORT_COORDS.longitude, RED_FORT_COORDS.latitude]}
                        zoomLevel={14}
                        followUserLocation={isFollowing}
                        followZoomLevel={17}
                        followUserMode={UserTrackingMode.FollowWithCourse}
                        animationMode={'easeTo'}
                        ref={cameraRef}
                    />}

                <UserLocation
                    visible={true}
                    animated={false}
                    androidRenderMode="gps"
                    onUpdate={handleLocationUpdate}
                />
            </MapView>

            {/* GPS status banner — only shown when location is off */}
            {!gpsAvailable && (
                <View style={styles.gpsBanner}>
                    <Text style={styles.gpsBannerText}>📍 Location / GPS is off</Text>
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
                // FIX: dim the button visually when GPS isn't available so user knows it won't work
                style={[styles.recenterButton, !gpsAvailable && styles.recenterButtonDisabled]}
                disabled={!gpsAvailable}
            >
                <LocateFixed size={24} color={gpsAvailable ? theme.colors.textPrimary : '#aaa'}/>
            </TouchableOpacity>

            <BottomSheet
                ref={bottomSheetRef}
                index={2}
                snapPoints={snapPoints}
                enablePanDownToClose={false}
                keyboardBehavior={'extend'}
                handleIndicatorStyle={{backgroundColor: theme.colors.textPrimary}}
                handleStyle={{backgroundColor: theme.colors.surface}}
            >
                <BottomSheetView style={styles.bottomSheet}>
                    <BottomSheetIdle />
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
            borderRadius: 10,
        },
        recenterButtonDisabled: {
            opacity: 0.4,
        },
        bottomSheet: {
            height: "100%",
            backgroundColor: theme.colors.card,
            paddingVertical: theme.spacing.lg,
            paddingHorizontal: theme.spacing.lg,
        },
        gpsBanner: {
            position: 'absolute',
            top: 80,
            alignSelf: 'center',
            backgroundColor: 'rgba(0,0,0,0.65)',
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 20,
        },
        gpsBannerText: {
            color: '#fff',
            fontSize: 13,
            fontWeight: '500',
        },
    });