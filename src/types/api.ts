import { z } from 'zod'

export const CatalogItemStatusSchema = z.enum(['INCOMPLETE', 'ONBOARDED'])

export const CustomPropSchema = z.object({
  key: z.string(),
  value: z.union([z.string(), z.number(), z.boolean(), z.null()]),
})

export const CatalogItemSchema = z.object({
  uuid: z.string(),
  status: CatalogItemStatusSchema,
  thumbnail_url: z.string(),
  name: z.string(),
  barcode: z.string().nullable(),
  custom_id: z.string().nullable(),
  height: z.number().nullable(),
  width: z.number().nullable(),
  depth: z.number().nullable(),
  brand: z.string().nullable(),
  size: z.string().nullable(),
  container_type: z.string().nullable(),
  flavour: z.string().nullable(),
  packaging_size: z.string().nullable(),
  custom_props: z.array(CustomPropSchema),
  created_at: z.string(),
  updated_at: z.string(),
})

export const CatalogItemsResponseSchema = z.object({
  items: z.array(CatalogItemSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
})

export const IRTaskSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  compute_realogram: z.boolean(),
  compute_shares: z.boolean(),
})

export const IRTasksResponseSchema = z.object({
  items: z.array(IRTaskSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
})

export const ImageSubmissionResponseSchema = z.array(z.string())

export const ImageResultStatusSchema = z.enum([
  'IN_PROGRESS',
  'COMPLETED',
  'FAILED',
])

export const ImageResultUnknownStatusSchema = z
  .object({
    status: z
      .string()
      .refine((val) => !['IN_PROGRESS', 'COMPLETED', 'FAILED'].includes(val), {
        message: 'Unknown status value',
      }),
  })
  .passthrough()

export const RealogramGapSchema = z.object({
  shelf_id: z.number(),
  slot: z.number(),
  stack_index: z.number(),
  bbox: z.array(z.number()),
})

export const RealogramItemEntrySchema = z.object({
  annotation_id: z.number(),
  shelf_id: z.number(),
  slot: z.number(),
  stack_index: z.number(),
})

export const ShareValueSchema = z.object({
  group_by: z.enum(['products', 'tags']),
  product_uuid: z.string().nullable(),
  tag_uuid: z.string().optional(),
  count: z.number(),
  count_ratio: z.number(),
  area: z.number(),
  area_ratio: z.number(),
})

export const ShareResultSchema = z.object({
  image_id: z.number(),
  values: z.array(ShareValueSchema),
})

export const PostprocessingResultsSchema = z.object({
  realogram: z
    .object({
      gaps: z.array(RealogramGapSchema),
      item_entries: z.array(RealogramItemEntrySchema),
    })
    .nullable(),
  shares: z.array(ShareResultSchema),
})

const ImageResultBaseSchema = z.object({
  uuid: z.string(),
  task_uuid: z.string(),
  image_url: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  coco: z.record(z.unknown()),
})

const ImageResultFlexibleSchema = ImageResultBaseSchema.extend({
  status: z.string(),
  failure_reason: z.union([z.string(), z.null()]),
  duration: z.union([z.number(), z.null()]),
  postprocessing_results: z.union([PostprocessingResultsSchema, z.null()]),
  confidence_score: z.union([z.number(), z.null()]),
})

const ImageResultInProgressSchema = ImageResultBaseSchema.extend({
  status: z.literal('IN_PROGRESS'),
  failure_reason: z.literal(''),
  duration: z.null(),
  postprocessing_results: PostprocessingResultsSchema,
  confidence_score: z.null(),
})

const ImageResultFailedSchema = ImageResultBaseSchema.extend({
  status: z.literal('FAILED'),
  failure_reason: z.string(),
  duration: z.null(),
  postprocessing_results: PostprocessingResultsSchema,
  confidence_score: z.number(),
})

const ImageResultCompletedSchema = ImageResultBaseSchema.extend({
  status: z.literal('COMPLETED'),
  failure_reason: z.null(),
  duration: z.number(),
  postprocessing_results: PostprocessingResultsSchema,
  confidence_score: z.number(),
})

export const ImageResultSchema = z.union([
  z.discriminatedUnion('status', [
    ImageResultInProgressSchema,
    ImageResultFailedSchema,
    ImageResultCompletedSchema,
  ]),
  ImageResultFlexibleSchema,
])

export const TaskResultsResponseSchema = z.object({
  items: z.array(ImageResultSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
})

export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  status_code: z.number(),
  details: z.record(z.unknown()).optional(),
})

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    success: z.boolean(),
    error: ApiErrorSchema.optional(),
  })

export type CatalogItemStatus = z.infer<typeof CatalogItemStatusSchema>
export type CustomProp = z.infer<typeof CustomPropSchema>
export type CatalogItem = z.infer<typeof CatalogItemSchema>
export type CatalogItemsResponse = z.infer<typeof CatalogItemsResponseSchema>

export type IRTask = z.infer<typeof IRTaskSchema>
export type IRTasksResponse = z.infer<typeof IRTasksResponseSchema>

export type ImageSubmissionResponse = z.infer<
  typeof ImageSubmissionResponseSchema
>
export type ImageResultStatus = z.infer<typeof ImageResultStatusSchema>
export type RealogramGap = z.infer<typeof RealogramGapSchema>
export type RealogramItemEntry = z.infer<typeof RealogramItemEntrySchema>
export type ShareValue = z.infer<typeof ShareValueSchema>
export type ShareResult = z.infer<typeof ShareResultSchema>
export type PostprocessingResults = z.infer<typeof PostprocessingResultsSchema>
export type ImageResult = z.infer<typeof ImageResultSchema>
export type TaskResultsResponse = z.infer<typeof TaskResultsResponseSchema>

export type ApiError = z.infer<typeof ApiErrorSchema>
export type ApiResponse<T> = {
  data: T
  success: boolean
  error?: ApiError
}
