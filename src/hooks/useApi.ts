import { useInfiniteQuery } from '@tanstack/react-query'
import type { ApiResponse } from '@/types/api'
import { getCatalogItems, getIRTasks } from '@/lib/api'

export const queryKeys = {
  catalogItems: ['catalog-items'] as const,
  irTasks: ['ir-tasks'] as const,
}

const useInfinitePaginatedQuery = <
  T extends { items: any[]; total: number; limit: number; offset: number },
>(
  queryKey: readonly unknown[],
  apiFn: (offset: number, limit: number) => Promise<ApiResponse<T>>,
  errorMessage: string,
  limit: number = 50,
) => {
  const query = useInfiniteQuery({
    queryKey: [...queryKey, limit],
    queryFn: async ({ pageParam }) => {
      const response = await apiFn(pageParam, limit)
      if (!response.success) {
        throw new Error(response.error?.message || errorMessage)
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

  return {
    items: allItems,
    total,
    hasMore: query.hasNextPage,
    loadMore: query.fetchNextPage,
    isLoadingMore: query.isFetchingNextPage,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}

export const useCatalogItems = (limit: number = 50) => {
  return useInfinitePaginatedQuery(
    queryKeys.catalogItems,
    getCatalogItems,
    'Failed to fetch catalog items',
    limit,
  )
}

export const useIRTasks = (limit: number = 50) => {
  return useInfinitePaginatedQuery(
    queryKeys.irTasks,
    getIRTasks,
    'Failed to fetch IR tasks',
    limit,
  )
}
