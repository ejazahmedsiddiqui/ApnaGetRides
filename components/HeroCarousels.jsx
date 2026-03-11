import Carousel from 'react-native-reanimated-carousel';
import {View, Text, Dimensions, Image, TouchableOpacity, ActivityIndicator, StyleSheet} from 'react-native';
import {useEffect, useState} from 'react';
import {heroList} from '@/api/hero';
import {useTheme} from "react-native-zustand-theme";

const {width} = Dimensions.get('window');

const CARD_WIDTH = width - 48;
const CARD_HEIGHT = 180;

export default function HeroCarousels() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const {theme } = useTheme()
    useEffect(() => {
        const fetchHero = async () => {
            const result = await heroList();
            if (result?.success && result?.data?.length) {
                setData(result.data.filter(item => item.isActive));
            }
            setLoading(false);
        };
        fetchHero().catch((error) => {console.log('An error occurred in fetchHero: ', error)});
    }, []);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="small" color={theme.colors.textPrimary} />
            </View>
        );
    }

    if (!data.length) return null;

    return (
        <View style={styles.wrapper}>
            <Carousel
                data={data}
                width={CARD_WIDTH + 16}
                height={CARD_HEIGHT}
                loop
                autoPlay
                autoPlayInterval={3500}
                scrollAnimationDuration={600}
                style={styles.carousel}
                renderItem={({item}) => (
                    <View style={[styles.card, {backgroundColor: item.backgroundColor}]}>
                        {/* Text Content */}
                        <View style={styles.textContent}>
                            <Text
                                style={[styles.cardTitle, {color: item.titleColor}]}
                                numberOfLines={3}>
                                {item.title}
                            </Text>
                            <TouchableOpacity
                                style={[styles.ctaButton, {backgroundColor: item.buttonColor}]}
                                activeOpacity={0.85}>
                                <Text style={[styles.ctaText, {color: item.buttonTextColor}]}>
                                    {item.buttonText}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Image */}
                        <Image
                            source={{uri: item.image}}
                            style={styles.cardImage}
                            resizeMode="cover"
                            onLoad={() => console.log('✅ Image loaded:')}
                            onError={(e) => console.log('❌ Image failed:', item.image, e.nativeEvent.error)}
                        />
                    </View>
                )}
            />

            {/* Dot Indicators */}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 20,
        marginBottom: 4,
        alignItems: 'center',
    },
    loaderContainer: {
        height: CARD_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    carousel: {
        alignSelf: 'center',
    },
    card: {
        flex: 1,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'stretch',
        overflow: 'hidden',
        paddingLeft: 22,
        paddingRight: 0,
        marginHorizontal: 8,
    },
    textContent: {
        flex: 1,
        justifyContent: 'center',
        gap: 14,
        zIndex: 2,
        paddingVertical: 20,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '800',
        lineHeight: 20,
        letterSpacing: -0.3,
        maxWidth: 140,
    },
    ctaButton: {
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 24,
    },
    ctaText: {
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    cardImage: {
        width: 155,
        alignSelf: 'stretch',
    },
});