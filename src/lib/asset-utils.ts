/**
 * Asset Utility Functions
 * Shared utilities for asset tracking and management
 */

import type { AssetTable } from '@/types/asset/assetSchemas'

export interface Asset {
  id: string
  name: string
  category: string
  categoryId: string
  branch: string
  branchId: string
  purchaseDate: Date
  price?: number
  lifespan?: number
  status: string
  condition: string
  serialNumber?: string
  nextMaintenance?: Date
  notes?: string
  manufacturedDate?: Date
  endOfLife?: Date
  objectIds: string[]
}

/**
 * Convert AssetTable from backend to frontend Asset type
 */
export function adaptAssetFromDTO(dto: AssetTable, categoryName?: string, branchName?: string): Asset {
  return {
    id: dto.id,
    name: dto.name,
    category: categoryName || dto.assetCategoryName || dto.assetCategoryId,
    categoryId: dto.assetCategoryId,
    branch: branchName || dto.branchName || dto.branchId,
    branchId: dto.branchId,
    purchaseDate: dto.manufacturedDate ? new Date(dto.manufacturedDate) : (dto.createdAt ? new Date(dto.createdAt) : new Date()),
    status: 'Operational',
    condition: 'Good',
    notes: dto.remarks || undefined,
    manufacturedDate: dto.manufacturedDate ? new Date(dto.manufacturedDate) : undefined,
    endOfLife: dto.endOfLife ? new Date(dto.endOfLife) : undefined,
    objectIds: dto.objectIds,
  }
}

/**
 * Calculate the age of an asset in months
 * @param date - Purchase date of the asset
 * @returns Age in months
 */
export function getAssetAge(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30))
}

/**
 * Check if an asset is near end of life (80% or more of expected lifespan)
 * @param asset - Asset to check
 * @returns True if asset is near end of life
 */
export function isAssetNearEOL(asset: Asset): boolean {
  if (!asset.lifespan) return false
  return getAssetAge(asset.purchaseDate) >= asset.lifespan * 0.8
}

/**
 * Check if maintenance is due soon (within 14 days)
 * @param asset - Asset to check
 * @returns True if maintenance is due within 14 days
 */
export function assetNeedsMaintenance(asset: Asset): boolean {
  if (!asset.nextMaintenance) return false
  const days = Math.floor((asset.nextMaintenance.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  return days <= 14 && days >= 0
}

/**
 * Get color class for asset condition
 * @param condition - Asset condition
 * @returns Tailwind color class
 */
export function getConditionColor(condition: string): string {
  switch (condition) {
    case 'Excellent':
      return 'text-green-600'
    case 'Good':
      return 'text-blue-600'
    case 'Fair':
      return 'text-yellow-600'
    case 'Poor':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

/**
 * Filter assets based on search query
 * @param assets - Array of assets to filter
 * @param searchQuery - Search query string
 * @returns Filtered assets
 */
export function filterAssets(assets: Asset[], searchQuery: string): Asset[] {
  const query = searchQuery.toLowerCase()
  return assets.filter(
    (a) =>
      a.name.toLowerCase().includes(query) ||
      a.category.toLowerCase().includes(query) ||
      a.branch.toLowerCase().includes(query)
  )
}

/**
 * Get assets that need attention (repair, near EOL, or maintenance due)
 * @param assets - Array of assets to check
 * @returns Assets needing attention
 */
export function getAssetsNeedingAttention(assets: Asset[]): Asset[] {
  return assets.filter(
    (a) => a.status === 'Needs Repair' || isAssetNearEOL(a) || assetNeedsMaintenance(a)
  )
}

/**
 * Calculate total value of assets
 * @param assets - Array of assets
 * @returns Total purchase value
 */
export function calculateTotalAssetValue(assets: Asset[]): number {
  return assets.reduce((sum, a) => sum + (a.price || 0), 0)
}

/**
 * Get operational assets count
 * @param assets - Array of assets
 * @returns Number of operational assets
 */
export function getOperationalAssetsCount(assets: Asset[]): number {
  return assets.filter((a) => a.status === 'Operational').length
}
