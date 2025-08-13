import { createFileRoute } from '@tanstack/react-router'
import { AlertCircle, Package } from 'lucide-react'
import { z } from 'zod'
import { fallback, zodValidator } from '@tanstack/zod-adapter'
import { useCatalogItems } from '@/hooks/useApi'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { CatalogItemCard } from '@/components/CatalogItemCard'
import { LoadingSpinner } from '@/components/ui/loading'

const ValidSearchParams = z.object({
  limit: fallback(
    z.coerce.number().pipe(z.number().min(1).max(100)),
    50,
  ).optional(),
})

export const Route = createFileRoute('/catalog')({
  validateSearch: zodValidator(ValidSearchParams),
  component: CatalogPage,
})

function CatalogPage() {
  const { limit } = Route.useSearch()
  const {
    items: catalogItems,
    total,
    hasMore,
    loadMore,
    isLoadingMore,
    isLoading,
    error,
    refetch,
  } = useCatalogItems(limit)

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <LoadingSpinner size="lg" text="Loading catalog items..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading catalog items: {error.message}
            <button
              onClick={() => refetch()}
              className="ml-2 underline hover:no-underline"
            >
              Try again
            </button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-8 w-8" />
            Catalog Items
          </h1>
          <p className="text-gray-600 mt-1">
            Showing {catalogItems.length} of {total} items
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {catalogItems.map((item) => (
          <CatalogItemCard key={item.uuid} item={item} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center py-8">
          <Button
            onClick={() => loadMore()}
            isLoading={isLoadingMore}
            loadingText="Loading..."
            className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700"
          >
            Load More Items
          </Button>
        </div>
      )}

      {/* End Message */}
      {!hasMore && catalogItems.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          You've reached the end! All {total} items loaded.
        </div>
      )}

      {catalogItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No catalog items found
          </h3>
          <p className="text-gray-600">
            The catalog appears to be empty. Check your API configuration or try
            refreshing.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh Catalog
          </button>
        </div>
      )}
    </div>
  )
}
