import { useQuery } from '@tanstack/react-query'
import { getCatalogItems } from '@/lib/api'

export const queryKeys = {
  catalogItems: ['catalog-items'] as const,
}

export const useCatalogItems = (offset: number = 0, limit: number = 50) => {
  return useQuery({
    queryKey: [...queryKeys.catalogItems, offset, limit],
    queryFn: async () => {
      const response = await getCatalogItems(offset, limit)
      if (!response.success) {
        throw new Error(
          response.error?.message || 'Failed to fetch catalog items',
        )
      }
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
