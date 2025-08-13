import { createFileRoute } from '@tanstack/react-router'
import { AlertCircle, Package } from 'lucide-react'
import { useCatalogItems } from '@/hooks/useApi'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CatalogItemCard } from '@/components/CatalogItemCard'

export const Route = createFileRoute('/catalog')({
  component: CatalogPage,
})

function CatalogPage() {
  const { data, isLoading, error, refetch } = useCatalogItems()

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading catalog items...</p>
          </div>
        </div>
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

  const catalogItems = data?.items || []
  const incompleteCount = catalogItems.filter(
    (item) => item.status === 'INCOMPLETE',
  ).length
  const totalCount = data?.total || 0

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-8 w-8" />
            Catalog Items
          </h1>
          <p className="text-gray-600 mt-1">{totalCount} items total</p>
        </div>

        {incompleteCount > 0 && (
          <Alert className="w-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {incompleteCount} item{incompleteCount === 1 ? '' : 's'}{' '}
              {incompleteCount === 1 ? 'is' : 'are'} incomplete
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {catalogItems.map((item) => (
          <CatalogItemCard key={item.uuid} item={item} />
        ))}
      </div>

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
