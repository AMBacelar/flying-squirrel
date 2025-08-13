import type {
  ApiError,
  ApiResponse,
  CatalogItemsResponse,
  IRTasksResponse,
} from '@/types/api'
import { env } from '@/env'

const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> => {
  const url = endpoint

  const defaultHeaders = {
    'X-API-Key': env.VITE_NEUROLABS_API_KEY,
    'Content-Type': 'application/json',
    ...options.headers,
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders,
    })

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: 'Unknown Error',
        message: `HTTP ${response.status}: ${response.statusText}`,
        status_code: response.status,
      }))

      return {
        data: {} as T,
        success: false,
        error: errorData,
      }
    }

    const data: T = await response.json()
    return {
      data,
      success: true,
    }
  } catch (error) {
    const apiError: ApiError = {
      error: 'Network Error',
      message: error instanceof Error ? error.message : 'Unknown network error',
      status_code: 0,
    }

    return {
      data: {} as T,
      success: false,
      error: apiError,
    }
  }
}

export const getCatalogItems = async (
  offset: number = 0,
  limit: number = 50,
): Promise<ApiResponse<CatalogItemsResponse>> => {
  return apiRequest<CatalogItemsResponse>(
    `/v2/catalog-items?offset=${offset}&limit=${limit}`,
  )
}

// IR Tasks API
export const getIRTasks = async (
  offset: number = 0,
  limit: number = 50,
): Promise<ApiResponse<IRTasksResponse>> => {
  return apiRequest<IRTasksResponse>(
    `/v2/image-recognition/tasks?offset=${offset}&limit=${limit}`,
  )
}
