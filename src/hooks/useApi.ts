import { useInfiniteQuery } from '@tanstack/react-query'
import { getCatalogItems } from '@/lib/api'

export const queryKeys = {
  catalogItems: ['catalog-items'] as const,
}

export const useCatalogItems = (limit: number = 50) => {
  const query = useInfiniteQuery({
    queryKey: [...queryKeys.catalogItems, limit],
    queryFn: async ({ pageParam }) => {
      const response = await getCatalogItems(pageParam, limit)
      if (!response.success) {
        throw new Error(
          response.error?.message || 'Failed to fetch catalog items',
        )
      }
      return response.data
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const currentOffset = (allPages.length - 1) * limit
      const nextOffset = currentOffset + limit

      return nextOffset < lastPage.total ? nextOffset : undefined
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const allItems = query.data?.pages.flatMap((page) => page.items) ?? []
  const total = query.data?.pages[0]?.total ?? 0
  const hasMore = query.hasNextPage
  const loadMore = query.fetchNextPage
  const isLoadingMore = query.isFetchingNextPage

  return {
    items: allItems,
    total,
    hasMore,
    loadMore,
    isLoadingMore,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
