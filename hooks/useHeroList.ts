import { useQuery } from "@tanstack/react-query";
import { heroList } from "@/api/hero";

type SliderType = "home" | "promo" | "banner" | "services";

const useAllSliders = () =>
    useQuery({
        queryKey: ["heroList"],
        queryFn: heroList,
    });

export const useHeroList = (sliderType: SliderType) => {
    const { data, isLoading, error, refetch } = useAllSliders();

    return {
        data: (data ?? []).filter((item: any) => item.sliderType === sliderType),
        loading: isLoading,
        error,
        getHeroList: refetch,
    };
};

export const useHomeSlider     = () => useHeroList("home");
export const usePromoSlider    = () => useHeroList("promo");
export const useBannerSlider   = () => useHeroList("banner");
export const useServicesSlider = () => useHeroList("services");