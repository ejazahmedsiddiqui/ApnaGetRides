import {ActivityIndicator, FlatList, StyleSheet, TextInput, TouchableOpacity, View, Text} from "react-native";
import {useTheme} from "react-native-zustand-theme";
import {useEffect, useMemo, useState} from "react";
import Mapbox from "@rnmapbox/maps";

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN || null;
Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN).catch((err) => console.log('Access token Error' + err));

interface Suggestion {
    id: string;
    name: string;
    place_name: string;
    coordinates: [number, number];
}

const LocationSearch = ({
                            onLocationSelect
                        }: { onLocationSelect: (coords: [number, number]) => void }) => {
    const {theme} = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // 1. Setup the Debounce timer
        const timer = setTimeout(() => {
            if (query.length > 2) {
                fetchLocations(query);
            } else {
                setSuggestions([]);
            }
        }, 500); // Wait 500ms after last keystroke

        // 2. Cleanup timer if user types again before 500ms
        return () => clearTimeout(timer);
    }, [query]);

    const fetchLocations = async (searchText: string) => {
        setLoading(true);
        try {
            // Using Geocoding v6 endpoint
            const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(searchText)}&proximity=ip&access_token=${MAPBOX_ACCESS_TOKEN}`;

            const response = await fetch(url);
            const data = await response.json();

            const formatted = data.features.map((feature: any) => ({
                id: feature.id,
                name: feature.properties.name,
                place_name: feature.properties.full_address,
                coordinates: feature.geometry.coordinates, // [lng, lat]
            }));

            setSuggestions(formatted);
        } catch (error) {
            console.error("Search Error:", error);
        } finally {
            setLoading(false);
        }
    };
    // @ts-ignore
    return (
        <>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter drop-off location..."
                    value={query}
                    onChangeText={setQuery}
                />

                {loading && <ActivityIndicator style={{marginTop: 10}}/>}

                <FlatList
                    data={suggestions}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            style={styles.suggestionItem}
                            onPress={() => onLocationSelect(item.coordinates)}
                        >
                            <Text style={styles.suggestionTitle}>{item.name}</Text>
                            <Text style={styles.suggestionSub}>{item.place_name}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </>
    )
};

export default LocationSearch;

const createStyles = (theme: any) => StyleSheet.create({
    searchContainer: {
        padding: 20,
        backgroundColor: 'white',
        flex: 1
    },
    input: {height: 50, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 15},
    suggestionItem: {paddingVertical: 15, borderBottomWidth: 0.5, borderBottomColor: '#eee'},
    suggestionTitle: {fontWeight: '600', fontSize: 16},
    suggestionSub: {color: '#666', fontSize: 13},
})