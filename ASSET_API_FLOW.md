# Asset API Flow Documentation

Complete tracking of AssetApi.ts integration with TanStack Query and Zod validation.

## 📋 Table of Contents
- [API Endpoints](#api-endpoints)
- [Data Flow Architecture](#data-flow-architecture)
- [Zod Schemas](#zod-schemas)
- [TanStack Query Hooks](#tanstack-query-hooks)
- [Form Components](#form-components)
- [Error Handling](#error-handling)

---

## 🔌 API Endpoints

### AssetApi.ts
**Location:** `src/api/generated/apis/AssetApi.ts`

| Method | Endpoint | Description | Request Type | Response Type |
|--------|----------|-------------|--------------|---------------|
| `createAsset()` | `POST /api/asset` | Create a new asset | `AssetPostDTO` | `ApiResponseAssetTableDTO` |
| `updateAsset()` | `PUT /api/asset/{id}` | Update asset by ID | `AssetPutDTO` | `ApiResponseAssetTableDTO` |
| `deleteAsset()` | `DELETE /api/asset/{id}` | Delete asset by ID | `id: string` | `ApiResponseUnit` |
| `getAsset()` | `GET /api/asset/{id}` | Get single asset | `id: string` | `ApiResponseAssetTableDTO` |
| `getAllAssets()` | `GET /api/asset` | Get all assets (paginated) | `Pageable` | `ApiResponseListAssetTableDTO` |
| `getAssetMaintenance()` | `GET /api/asset/{id}/maintenance` | Get maintenance logs | `id, Pageable` | `ApiResponseListAssetMaintenanceTableDTO` |
| `getAssetSchedules()` | `GET /api/asset/{id}/maintenance/schedule` | Get maintenance schedules | `id, Pageable` | `ApiResponseListScheduleTableDTO` |

### DTO Structures

#### AssetPostDTO (Create)
```typescript
{
  assetCategoryId: string       // Required - UUID
  branchId: string              // Required - UUID
  createdById: string           // Required - UUID
  name: string                  // Required
  isDateRangeValid: boolean     // Required
  objectIds: string[]           // Required - Array of UUIDs
  manufacturedDate?: Date       // Optional
  endOfLife?: Date              // Optional
  remarks?: string              // Optional
}
```

#### AssetPutDTO (Update)
```typescript
{
  assetCategoryId: string       // Required - UUID
  branchId: string              // Required - UUID
  updatedById: string           // Required - UUID
  name: string                  // Required
  isDateRangeValid: boolean     // Required
  objectIds: string[]           // Required - Array of UUIDs
  manufacturedDate?: Date       // Optional
  endOfLife?: Date              // Optional
  remarks?: string              // Optional
}
```

---

## 🏗️ Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FORM COMPONENTS                             │
│  • AddAssetDialog.tsx                                           │
│  • AssetDetailsDialog.tsx (Edit)                                │
│  • DeleteAssetDialog.tsx                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (Form Validation)
┌─────────────────────────────────────────────────────────────────┐
│                       ZOD SCHEMAS                                │
│  Location: src/types/asset/assetSchemas.ts                      │
│  • assetPostFormSchema - Create validation                      │
│  • assetPutFormSchema - Update validation                       │
│  • parseAssetResponse() - Response validation                   │
│  • parseAssetsResponse() - List response validation             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (Validated Data)
┌─────────────────────────────────────────────────────────────────┐
│                   TANSTACK QUERY HOOKS                           │
│  Location: src/hooks/assets/                                    │
│  • useCreateAsset() - POST mutation                             │
│  • useUpdateAsset() - PUT mutation                              │
│  • useDeleteAsset() - DELETE mutation                           │
│  • useAssets() - GET query (list)                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (API Call)
┌─────────────────────────────────────────────────────────────────┐
│                      GENERATED API                               │
│  Location: src/api/generated/apis/AssetApi.ts                   │
│  • Auto-generated from OpenAPI spec                             │
│  • Type-safe API methods                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (HTTP Request)
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API                                 │
│  Spring Boot Backend (port 8080)                                │
│  • /api/asset endpoints                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔒 Zod Schemas

### Location
`src/types/asset/assetSchemas.ts`

### Key Schemas

#### 1. **assetPostFormSchema** (Create Asset)
```typescript
z.object({
  name: z.string().min(1, 'Asset name is required').max(255),
  assetCategoryId: z.string().uuid('Invalid asset category'),
  branchId: z.string().uuid('Invalid branch'),
  createdById: z.string().uuid('Invalid user ID'),
  manufacturedDate: z.date().optional().nullable(),
  endOfLife: z.date().optional().nullable(),
  isDateRangeValid: z.boolean().default(true),
  objectIds: z.array(z.string().uuid()).default([]),
  remarks: z.string().max(1000).optional().nullable(),
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
```

#### 2. **assetPutFormSchema** (Update Asset)
Similar to `assetPostFormSchema` but uses `updatedById` instead of `createdById`.

#### 3. **Response Validation**
- `parseAssetResponse()` - Validates single asset API response
- `parseAssetsResponse()` - Validates asset list API response

### Validation Features
✅ Required field validation  
✅ UUID format validation  
✅ String length constraints  
✅ Date range validation (manufacturedDate < endOfLife)  
✅ Custom error messages  
✅ Type inference for TypeScript  

---

## 🪝 TanStack Query Hooks

### 1. useCreateAsset()
**Location:** `src/hooks/assets/useCreateAsset.ts`

**Purpose:** Create a new asset

**Usage:**
```typescript
const createAsset = useCreateAsset()

createAsset.mutate({
  name: 'Treadmill',
  assetCategoryId: 'uuid-here',
  branchId: 'uuid-here',
  createdById: 'uuid-here',
  isDateRangeValid: true,
  objectIds: [],
})
```

**Features:**
- ✅ Zod validation before API call
- ✅ Automatic query invalidation on success
- ✅ Toast notifications (success/error)
- ✅ Error logging
- ✅ Type-safe with `AssetPostFormValues`

**Query Invalidation:**
- `['assets']` - Refetches all asset lists

---

### 2. useUpdateAsset()
**Location:** `src/hooks/assets/useUpdateAsset.ts`

**Purpose:** Update an existing asset

**Usage:**
```typescript
const updateAsset = useUpdateAsset()

updateAsset.mutate({
  id: 'asset-uuid',
  formData: {
    name: 'Updated Treadmill',
    assetCategoryId: 'uuid-here',
    branchId: 'uuid-here',
    updatedById: 'uuid-here',
    isDateRangeValid: true,
    objectIds: [],
  }
})
```

**Features:**
- ✅ Zod validation before API call
- ✅ Automatic query invalidation on success
- ✅ Toast notifications (success/error)
- ✅ Error logging
- ✅ Type-safe with `AssetPutFormValues`

**Query Invalidation:**
- `['assets']` - Refetches all asset lists
- `['asset', assetId]` - Refetches specific asset

---

### 3. useDeleteAsset()
**Location:** `src/hooks/assets/useDeleteAsset.ts`

**Purpose:** Delete an asset

**Usage:**
```typescript
const deleteAsset = useDeleteAsset()

deleteAsset.mutate('asset-uuid')
```

**Features:**
- ✅ Success validation
- ✅ Automatic query invalidation on success
- ✅ Toast notifications (success/error)
- ✅ Error logging

**Query Invalidation:**
- `['assets']` - Refetches all asset lists

---

### 4. useAssets()
**Location:** `src/hooks/assets/useAssets.ts`

**Purpose:** Fetch all assets (paginated)

**Usage:**
```typescript
const { assets, isLoading, error, refetch } = useAssets({
  page: 0,
  size: 100,
  sort: []
})
```

**Features:**
- ✅ Zod response validation
- ✅ Automatic error handling with toast
- ✅ 5-minute stale time
- ✅ 2 retry attempts
- ✅ Type-safe return values

**Returns:**
```typescript
{
  assets: AssetTable[]
  isLoading: boolean
  isFetching: boolean
  error: Error | null
  refetch: () => void
}
```

---

## 📝 Form Components

### 1. AddAssetDialog.tsx
**Location:** `src/components/asset-components/AddAssetDialog.tsx`

**Status:** ⚠️ Needs Integration

**Current State:**
- Uses local state management
- Manual form handling
- Legacy `Asset` type from `lib/asset-utils`

**Required Updates:**
```typescript
// TODO: Integrate with useCreateAsset hook
// TODO: Add Zod validation with React Hook Form
// TODO: Use AssetPostFormValues type
// TODO: Handle form errors properly
```

**Recommended Implementation:**
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { assetPostFormSchema, type AssetPostFormValues } from '@/types/asset/assetSchemas'
import { useCreateAsset } from '@/hooks/assets/useCreateAsset'

const form = useForm<AssetPostFormValues>({
  resolver: zodResolver(assetPostFormSchema),
  defaultValues: {
    name: '',
    assetCategoryId: '',
    branchId: '',
    createdById: currentUserId,
    isDateRangeValid: true,
    objectIds: [],
  }
})

const createAsset = useCreateAsset()

const onSubmit = (data: AssetPostFormValues) => {
  createAsset.mutate(data)
}
```

---

### 2. AssetDetailsDialog.tsx
**Location:** `src/components/asset-components/AssetDetailsDialog.tsx`

**Status:** ⚠️ Needs Integration

**Current State:**
- Uses local state management
- Manual form handling
- Legacy `Asset` type

**Required Updates:**
```typescript
// TODO: Integrate with useUpdateAsset hook
// TODO: Add Zod validation with React Hook Form
// TODO: Use AssetPutFormValues type
// TODO: Handle form errors properly
```

---

### 3. DeleteAssetDialog.tsx
**Location:** `src/components/asset-components/DeleteAssetDialog.tsx`

**Status:** ⚠️ Needs Integration

**Current State:**
- Simple confirmation dialog
- Callback-based deletion

**Required Updates:**
```typescript
// TODO: Integrate with useDeleteAsset hook
// TODO: Add loading state
// TODO: Handle errors properly
```

---

## ⚠️ Error Handling

### Error Flow

```
API Error
    │
    ▼
Zod Validation (parseAssetResponse)
    │
    ├─ Success → Return validated data
    │
    └─ Failure → Throw Error with message
              │
              ▼
        TanStack Query onError
              │
              ▼
        Toast Notification
              │
              ▼
        Console Error Log
```

### Error Types

#### 1. **Validation Errors** (Zod)
- Invalid UUID format
- Missing required fields
- String length violations
- Date range violations

**Example:**
```typescript
{
  message: "Manufactured date must be before end of life date",
  path: ["endOfLife"]
}
```

#### 2. **API Errors** (Backend)
- Network failures
- 400 Bad Request
- 401 Unauthorized
- 404 Not Found
- 500 Server Error

**Handled by:**
- `parseAssetResponse()` - Extracts error message from API response
- TanStack Query `onError` - Displays toast notification

#### 3. **Form Validation Errors** (React Hook Form + Zod)
**TODO:** Integrate with forms

```typescript
// Field-level errors
form.formState.errors.name?.message
form.formState.errors.assetCategoryId?.message
```

---

## 🔄 Query Invalidation Strategy

### When Assets Change

| Action | Invalidated Queries |
|--------|-------------------|
| Create Asset | `['assets']` |
| Update Asset | `['assets']`, `['asset', id]` |
| Delete Asset | `['assets']` |

### Benefits
✅ Automatic UI updates  
✅ Fresh data after mutations  
✅ No manual refetch needed  
✅ Optimistic updates possible  

---

## 📊 Type Safety Flow

```typescript
Form Input (User)
    │
    ▼
AssetPostFormInput (Zod input type)
    │
    ▼ (Zod Validation)
AssetPostFormValues (Zod infer type)
    │
    ▼ (assetPostFormToDTO)
AssetPostDTO (Generated API type)
    │
    ▼ (API Call)
ApiResponseAssetTableDTO (Generated response type)
    │
    ▼ (parseAssetResponse)
AssetTable (Validated Zod type)
    │
    ▼
UI Display
```

**100% Type-Safe:** TypeScript ensures type safety at every step!

---

## 🚀 Next Steps

### High Priority
1. ✅ Create Zod schemas for asset validation
2. ✅ Update TanStack Query hooks with Zod validation
3. ✅ Add error handling with toast notifications
4. ⚠️ Integrate React Hook Form with AddAssetDialog
5. ⚠️ Integrate React Hook Form with AssetDetailsDialog
6. ⚠️ Update DeleteAssetDialog to use useDeleteAsset hook

### Medium Priority
7. Add loading states to all forms
8. Add optimistic updates for better UX
9. Add field-level validation feedback
10. Create useAsset() hook for single asset fetching

### Low Priority
11. Add asset category fetching hook
12. Add branch fetching hook
13. Add file upload integration for objectIds
14. Add maintenance log integration

---

## 📚 Related Files

### Core Files
- `src/api/generated/apis/AssetApi.ts` - Generated API client
- `src/types/asset/assetSchemas.ts` - Zod validation schemas
- `src/hooks/assets/useCreateAsset.ts` - Create mutation hook
- `src/hooks/assets/useUpdateAsset.ts` - Update mutation hook
- `src/hooks/assets/useDeleteAsset.ts` - Delete mutation hook
- `src/hooks/assets/useAssets.ts` - Fetch query hook

### Component Files
- `src/components/asset-components/AddAssetDialog.tsx` - Create form
- `src/components/asset-components/AssetDetailsDialog.tsx` - Edit form
- `src/components/asset-components/DeleteAssetDialog.tsx` - Delete confirmation

### Legacy Files (To Be Updated)
- `src/lib/asset-utils.ts` - Legacy Asset type definitions

---

## 🎯 Summary

This implementation provides:
- ✅ **Type Safety:** End-to-end TypeScript types
- ✅ **Validation:** Zod schemas for runtime validation
- ✅ **Error Handling:** Comprehensive error handling with user feedback
- ✅ **State Management:** TanStack Query for server state
- ✅ **Developer Experience:** Auto-complete, type inference, error messages
- ✅ **User Experience:** Toast notifications, loading states, error messages

**Status:** Backend integration complete, form integration pending.
