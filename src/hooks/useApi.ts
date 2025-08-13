import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import type { ApiResponse, ImageResult, TaskResultsResponse } from '@/types/api'
import {
  getCatalogItems,
  getIRTasks,
  getImageResult,
  getTaskResults,
  submitImages,
} from '@/lib/api'

export const queryKeys = {
  catalogItems: ['catalog-items'] as const,
  irTasks: ['ir-tasks'] as const,
  taskResults: ['task-results'] as const,
  imageResult: ['image-result'] as const,
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

export const useSubmitImages = () => {
  return useMutation({
    mutationFn: async ({
      taskUuid,
      images,
      callback,
    }: {
      taskUuid: string
      images: File[]
      callback?: string
    }) => {
      const response = await submitImages(taskUuid, images, callback)
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to submit images')
      }
      return response.data
    },
  })
}

export const useImageResult = (
  taskUuid: string,
  resultUuid: string,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: [...queryKeys.imageResult, taskUuid, resultUuid],
    queryFn: async (): Promise<ImageResult> => {
      const response = await getImageResult(taskUuid, resultUuid)
      if (!response.success) {
        throw new Error(
          response.error?.message || 'Failed to fetch image result',
        )
      }
      return response.data
    },
    enabled: enabled && !!taskUuid && !!resultUuid,
    refetchInterval: (query) => {
      return query.state.data?.status === 'IN_PROGRESS' ? 2000 : false
    },
    staleTime: 0,
  })
}

export const useTaskResults = (taskUuid: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...queryKeys.taskResults, taskUuid],
    queryFn: async (): Promise<TaskResultsResponse> => {
      const response = await getTaskResults(taskUuid, 0, 100)
      if (!response.success) {
        throw new Error(
          response.error?.message || 'Failed to fetch task results',
        )
      }
      return response.data
    },
    enabled: enabled && !!taskUuid,
    refetchInterval: (query) => {
      const hasInProgress = query.state.data?.items.some(
        (result) => result.status === 'IN_PROGRESS',
      )
      return hasInProgress ? 3000 : false
    },
    staleTime: 1000,
  })
}
