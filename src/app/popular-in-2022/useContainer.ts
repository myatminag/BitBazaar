import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { getPopularIn2022 } from "@/services/service.games";
import useFilter from "@/hooks/useFilter";
import { useGetPopularIn2022 } from "@/api/games/popular-in-2022.query";

const useContainer = () => {
    const { ref, inView } = useInView();

    const { filterText, isDropDownOpen, handleDropDown, handleFilter } =
        useFilter("relevance", false);

    const previousYear = new Date().getFullYear() - 1;

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useGetPopularIn2022(12, filterText, previousYear);

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    const gamesData = (data?.pages || []).flatMap((page) => page.results || []);
    const formattedData = gamesData || [];

    return {
        isLoading,
        isError,
        isFetchingNextPage,
        hasNextPage,
        formattedData,
        filterText,
        isDropDownOpen,
        ref,
        handleDropDown,
        handleFilter,
    };
};

export default useContainer;
