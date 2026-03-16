import {useState, useEffect} from "react";
import {heroList} from "@/api/hero";

export const useHeroList = () => {
        const [data, setData] = useState([]);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState<Error | null>(null);

        const getHeroList = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await heroList();
                setData(res.data)
            } catch (err) {
                if (err instanceof Error) {
                    setError(err);
                } else {
                    setError(new Error("An unknown error occurred"));
                }
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            getHeroList();
        }, []);

        return {data, getHeroList, loading, error};
    }
;