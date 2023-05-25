import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { getAllTimeTop250 } from "@/services/service.games";

const useContainer = () => {
    const { ref, inView } = useInView();

    const {
        data: AllTimeTop250,
        isError,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["all-time-top-200"],
        queryFn: ({ pageParam = 1 }) => getAllTimeTop250(pageParam),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.next === null) return undefined;
            return allPages.length + 1;
        },
        keepPreviousData: true,
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    /**
     * flatten the nest array eg.[[1, 2], [3, 4], [5, 6]] to
     * single array [1, 2, 3, 4, 5, 6]
     * and map the results
     */
    const gamesData = (AllTimeTop250?.pages || []).flatMap(
        (page) => page.results || []
    );
    const formattedData = gamesData || [];

    return {
        ref,
        isLoading,
        isError,
        isFetchingNextPage,
        hasNextPage,
        formattedData,
    };
};

export default useContainer;
