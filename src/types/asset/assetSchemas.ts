import { z } from 'zod'

// API Error Schema
export const apiErrorSchema = z.object({
  code: z.string().optional(),
  description: z.string().optional(),
  field: z.string().optional(),
})

// Page Metadata Schema
export const pageMetadataSchema = z.object({
  pageCount: z.number().optional(),
  pageIndex: z.number().optional(),
  pageSize: z.number().optional(),
  totalCount: z.number().optional(),
})

// Asset Table Schema (matches backend AssetTableDTO)
// Note: The generated API client converts date strings to Date objects
export const assetTableSchema = z.object({
  id: z.string(),
  name: z.string(),
  assetCategoryId: z.string(),
  assetCategoryName: z.string().optional(),
  branchId: z.string(),
  branchName: z.string().optional(),
  createdById: z.string().optional(),
  updatedById: z.string().optional(),
  manufacturedDate: z.union([z.string(), z.date()]).optional(),
  endOfLife: z.union([z.string(), z.date()]).optional(),
  isDateRangeValid: z.boolean().optional().default(true),
  objectIds: z.array(z.string()).default([]),
  remarks: z.string().optional(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
})

export type AssetTable = z.infer<typeof assetTableSchema>

// API Response Schemas
export const apiResponseAssetTableSchema = z.object({
  data: assetTableSchema.optional(),
  errors: z.array(apiErrorSchema).optional(),
  message: z.string().optional(),
  meta: pageMetadataSchema.optional(),
  success: z.boolean(),
  timestamp: z.number().optional(),
})

export type ApiResponseAssetTable = z.infer<typeof apiResponseAssetTableSchema>

export const apiResponseListAssetTableSchema = z.object({
  data: z.array(assetTableSchema).optional(),
  errors: z.array(apiErrorSchema).optional(),
  message: z.string().optional(),
  meta: pageMetadataSchema.optional(),
  success: z.boolean(),
  timestamp: z.number().optional(),
})

export type ApiResponseListAssetTable = z.infer<typeof apiResponseListAssetTableSchema>

// Asset Form Schemas (for validation)
export const assetPostFormSchema = z.object({
  name: z.string().min(1, 'Asset name is required').max(255, 'Asset name is too long'),
  assetCategoryId: z.string().uuid('Invalid asset category'),
  branchId: z.string().uuid('Invalid branch'),
  createdById: z.string().uuid('Invalid user ID'),
  manufacturedDate: z.date().optional(),
  endOfLife: z.date().optional(),
  isDateRangeValid: z.boolean().default(true),
  objectIds: z.array(z.string().uuid()).default([]),
  remarks: z.string().max(1000, 'Remarks are too long').optional(),
}).refine(
  (data) => {
    if (data.manufacturedDate && data.endOfLife) {
      return data.manufacturedDate <= data.endOfLife
    }
    return true
  },
  {
    message: 'Manufactured date must be before end of life date',
    path: ['endOfLife'],
  }
)

export type AssetPostFormValues = z.infer<typeof assetPostFormSchema>
export type AssetPostFormInput = z.input<typeof assetPostFormSchema>

export const assetPutFormSchema = z.object({
  name: z.string().min(1, 'Asset name is required').max(255, 'Asset name is too long'),
  assetCategoryId: z.string().uuid('Invalid asset category'),
  branchId: z.string().uuid('Invalid branch'),
  updatedById: z.string().uuid('Invalid user ID'),
  manufacturedDate: z.date().optional(),
  endOfLife: z.date().optional(),
  isDateRangeValid: z.boolean().default(true),
  objectIds: z.array(z.string().uuid()).default([]),
  remarks: z.string().max(1000, 'Remarks are too long').optional(),
}).refine(
  (data) => {
    if (data.manufacturedDate && data.endOfLife) {
      return data.manufacturedDate <= data.endOfLife
    }
    return true
  },
  {
    message: 'Manufactured date must be before end of life date',
    path: ['endOfLife'],
  }
)

export type AssetPutFormValues = z.infer<typeof assetPutFormSchema>
export type AssetPutFormInput = z.input<typeof assetPutFormSchema>

// Parser functions for API responses
export function parseAssetResponse(json: unknown): AssetTable {
  const parsed = apiResponseAssetTableSchema.safeParse(json)
  if (!parsed.success) {
    console.error('Asset validation errors:', parsed.error.issues)
    throw new Error('Failed to validate asset response.')
  }

  if (!parsed.data.success) {
    const errorMessage = parsed.data.errors?.[0]?.description || parsed.data.message || 'Failed to fetch asset.'
    throw new Error(errorMessage)
  }

  if (!parsed.data.data) {
    throw new Error('No asset data returned.')
  }

  return parsed.data.data
}

export function parseAssetsResponse(json: unknown): AssetTable[] {
  const parsed = apiResponseListAssetTableSchema.safeParse(json)
  if (!parsed.success) {
    console.error('Assets validation errors:', parsed.error.issues)
    console.error('Received data:', JSON.stringify(json, null, 2))
    throw new Error('Failed to validate assets response.')
  }

  if (!parsed.data.success) {
    const errorMessage = parsed.data.errors?.[0]?.description || parsed.data.message || 'Failed to fetch assets.'
    throw new Error(errorMessage)
  }

  return parsed.data.data || []
}

// Helper to convert form data to API DTO format
export function assetPostFormToDTO(formData: AssetPostFormValues) {
  return {
    name: formData.name,
    assetCategoryId: formData.assetCategoryId,
    branchId: formData.branchId,
    createdById: formData.createdById,
    manufacturedDate: formData.manufacturedDate || undefined,
    endOfLife: formData.endOfLife || undefined,
    isDateRangeValid: formData.isDateRangeValid,
    objectIds: formData.objectIds,
    remarks: formData.remarks || undefined,
  }
}

export function assetPutFormToDTO(formData: AssetPutFormValues) {
  return {
    name: formData.name,
    assetCategoryId: formData.assetCategoryId,
    branchId: formData.branchId,
    updatedById: formData.updatedById,
    manufacturedDate: formData.manufacturedDate || undefined,
    endOfLife: formData.endOfLife || undefined,
    isDateRangeValid: formData.isDateRangeValid,
    objectIds: formData.objectIds,
    remarks: formData.remarks || undefined,
  }
}
