import React, {useMemo} from "react";
import {View, Image, Text, StyleSheet, Dimensions, FlatList, ActivityIndicator} from "react-native";
import {useBannerSlider} from "@/hooks/useHeroList";
import {useTheme} from "react-native-zustand-theme";
import {usePromoSlider} from "../hooks/useHeroList";

const {width: SCREEN_WIDTH} = Dimensions.get("window");

const CARD_WIDTH = SCREEN_WIDTH * 0.75;

const BannerCard = ({item}) => {
    const {theme} = useTheme();
    const styles = useMemo(() =>
        createStyles(theme), [theme]);
    return (
        <View style={styles.card}>
            <Image
                source={{uri: item.image}}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    )
}

export const PromoCarousel = () => {
    const {data, loading} = usePromoSlider();
    const {theme} = useTheme();
    const styles = useMemo(() =>
        createStyles(theme), [theme]);

    const sliderData = data?.[0];           // the banner slider object
    const items = sliderData?.items ?? [];  // the actual array of cards

    if (loading) return <ActivityIndicator size={24} colors={theme.colors.textPrimary} /> ;
    if (!items.length) return null;

    return (
        <View>
            {sliderData?.sectionTitle && (
                <Text style={styles.sectionLabel}>{sliderData.sectionTitle}</Text>
            )}
            <FlatList
                data={items}
                keyExtractor={(item) => item._id}
                renderItem={({item}) => <BannerCard item={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + 12}   // card width + gap
                snapToAlignment="start"
                decelerationRate="fast"
                contentContainerStyle={styles.flatListContent}
            />
        </View>
    );
};

const createStyles = (theme) => StyleSheet.create({
    sectionLabel: {
        alignSelf: 'flex-start',
        fontSize: 17,
        fontWeight: '700',
        color: theme.colors.textPrimary,
        marginBottom: 8,
        marginTop: 8,
        letterSpacing: -0.2,
    },
    flatListContent: {
        paddingRight: 12,
        gap: 12,
    },
    card: {
        width: CARD_WIDTH,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "#1a1a1a",
    },
    image: {
        width: "100%",
        height: 160,
    },
    textContainer: {
        padding: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: "#fff",
    },
    description: {
        fontSize: 13,
        color: "#ccc",
        marginTop: 4,
    },
});