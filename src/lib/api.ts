import type { z } from 'zod'
import type {
  ApiError,
  ApiResponse,
  CatalogItemsResponse,
  IRTasksResponse,
  ImageResult,
  ImageSubmissionResponse,
  TaskResultsResponse,
} from '@/types/api'
import {
  CatalogItemsResponseSchema,
  IRTasksResponseSchema,
  ImageResultSchema,
  ImageSubmissionResponseSchema,
  TaskResultsResponseSchema,
} from '@/types/api'
import { env } from '@/env'

const validatedApiRequest = async <T>(
  endpoint: string,
  schema: z.ZodSchema<T>,
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

    const rawData = await response.json()

    if (
      import.meta.env.DEV &&
      endpoint.includes('/image-recognition/tasks/') &&
      endpoint.includes('/results')
    ) {
      console.log('Raw API response:', JSON.stringify(rawData, null, 2))
    }

    const validationResult = schema.safeParse(rawData)

    if (!validationResult.success) {
      return {
        data: {} as T,
        success: false,
        error: {
          error: 'Validation Error',
          message: `Response validation failed: ${validationResult.error.message}`,
          status_code: 0,
          details: validationResult.error.flatten(),
        },
      }
    }

    return {
      data: validationResult.data,
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
  return validatedApiRequest(
    `/v2/catalog-items?offset=${offset}&limit=${limit}`,
    CatalogItemsResponseSchema,
  )
}

// IR Tasks API
export const getIRTasks = async (
  offset: number = 0,
  limit: number = 50,
): Promise<ApiResponse<IRTasksResponse>> => {
  return validatedApiRequest(
    `/v2/image-recognition/tasks?offset=${offset}&limit=${limit}`,
    IRTasksResponseSchema,
  )
}

// Image Submission API
export const submitImages = async (
  taskUuid: string,
  images: File[],
  callback?: string,
): Promise<ApiResponse<ImageSubmissionResponse>> => {
  const formData = new FormData()

  images.forEach((image) => {
    formData.append('images', image)
  })

  if (callback) {
    formData.append('callback', callback)
  }

  const url = `/v2/image-recognition/tasks/${taskUuid}/images`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-API-Key': env.VITE_NEUROLABS_API_KEY,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: 'Unknown Error',
        message: `HTTP ${response.status}: ${response.statusText}`,
        status_code: response.status,
      }))

      return {
        data: [] as ImageSubmissionResponse,
        success: false,
        error: errorData,
      }
    }

    const rawData = await response.json()

    const validationResult = ImageSubmissionResponseSchema.safeParse(rawData)

    if (!validationResult.success) {
      return {
        data: [] as ImageSubmissionResponse,
        success: false,
        error: {
          error: 'Validation Error',
          message: `Response validation failed: ${validationResult.error.message}`,
          status_code: 0,
          details: validationResult.error.flatten(),
        },
      }
    }

    return {
      data: validationResult.data,
      success: true,
    }
  } catch (error) {
    const apiError: ApiError = {
      error: 'Network Error',
      message: error instanceof Error ? error.message : 'Unknown network error',
      status_code: 0,
    }

    return {
      data: [] as ImageSubmissionResponse,
      success: false,
      error: apiError,
    }
  }
}

// Get Task Results (all results for a task)
export const getTaskResults = async (
  taskUuid: string,
  offset: number = 0,
  limit: number = 50,
  startDatetime?: string,
  endDatetime?: string,
): Promise<ApiResponse<TaskResultsResponse>> => {
  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
  })

  if (startDatetime) params.append('start_datetime', startDatetime)
  if (endDatetime) params.append('end_datetime', endDatetime)

  return validatedApiRequest(
    `/v2/image-recognition/tasks/${taskUuid}/results?${params.toString()}`,
    TaskResultsResponseSchema,
  )
}

// Get Image Result Status (individual result)
export const getImageResult = async (
  taskUuid: string,
  resultUuid: string,
): Promise<ApiResponse<ImageResult>> => {
  return validatedApiRequest(
    `/v2/image-recognition/tasks/${taskUuid}/results/${resultUuid}`,
    ImageResultSchema,
  )
}
