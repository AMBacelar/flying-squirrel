import { AlertCircle, Eye } from 'lucide-react'
import type { CatalogItem, CatalogItemStatus } from '@/types/api'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type CatalogItemCardProps = {
  item: CatalogItem
}

const getStatusBadgeVariant = (status: CatalogItemStatus) => {
  switch (status) {
    case 'ONBOARDED':
      return 'default'
    case 'INCOMPLETE':
      return 'destructive'
    default:
      return 'outline'
  }
}

const getStatusColor = (status: CatalogItemStatus) => {
  switch (status) {
    case 'ONBOARDED':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'INCOMPLETE':
      return 'text-red-600 bg-red-50 border-red-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export const CatalogItemCard = ({ item }: CatalogItemCardProps) => {
  return (
    <Card
      className={`transition-all duration-200 hover:shadow-lg ${
        item.status === 'INCOMPLETE' ? 'ring-2 ring-red-200' : ''
      }`}
    >
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <div className="flex items-start justify-end">
            <Badge
              variant={getStatusBadgeVariant(item.status)}
              className={`shrink-0 ${getStatusColor(item.status)}`}
            >
              {item.status.replace('_', ' ')}
            </Badge>
          </div>
          <CardTitle className="text-lg font-semibold leading-tight">
            {item.name}
          </CardTitle>
          <CardDescription className="text-sm line-clamp-2">
            {item.brand && item.size
              ? `${item.brand} - ${item.size}`
              : item.brand || item.size || `Barcode: ${item.barcode || 'N/A'}`}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          {item.thumbnail_url ? (
            <img
              src={item.thumbnail_url}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.nextElementSibling?.classList.remove('hidden')
              }}
            />
          ) : null}
          <div
            className={`flex flex-col items-center justify-center text-gray-400 ${item.thumbnail_url ? 'hidden' : ''}`}
          >
            <Eye className="h-8 w-8 mb-2" />
            <span className="text-sm">No image</span>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>UUID:</span>
            <span className="font-mono text-xs truncate ml-2">
              {item.uuid.slice(0, 8)}...
            </span>
          </div>
          <div className="flex justify-between">
            <span>Created:</span>
            <span className="ml-2">
              {new Date(item.created_at).toLocaleDateString()}
            </span>
          </div>
          {item.updated_at !== item.created_at && (
            <div className="flex justify-between">
              <span>Updated:</span>
              <span className="ml-2">
                {new Date(item.updated_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {item.status === 'INCOMPLETE' && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
              <AlertCircle className="h-4 w-4" />
              Incomplete Item
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
