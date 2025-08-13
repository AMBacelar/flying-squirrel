export type CatalogItemStatus = 'INCOMPLETE' | 'ONBOARDED'

export type CustomProp = {
  key: string
  value: string | number | boolean | null
}

export type CatalogItem = {
  uuid: string
  status: CatalogItemStatus
  thumbnail_url: string
  name: string
  barcode: string | null
  custom_id: string | null
  height: number | null
  width: number | null
  depth: number | null
  brand: string | null
  size: string | null
  container_type: string | null
  flavour: string | null
  packaging_size: string | null
  custom_props: CustomProp[]
  created_at: string
  updated_at: string
}

export type CatalogItemsResponse = {
  items: CatalogItem[]
  total: number
  limit: number
  offset: number
}

export type ApiError = {
  error: string
  message: string
  status_code: number
  details?: Record<string, unknown>
}

export type ApiResponse<T> = {
  data: T
  success: boolean
  error?: ApiError
}
