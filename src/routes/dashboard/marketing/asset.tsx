import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Package, AlertTriangle, CheckCircle, Clock, Wrench, MapPin, MoreHorizontal } from 'lucide-react'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  adaptAssetFromDTO,
  getAssetAge,
  isAssetNearEOL,
  assetNeedsMaintenance,
  getConditionColor,
  filterAssets,
  getAssetsNeedingAttention,
  calculateTotalAssetValue,
  getOperationalAssetsCount,
} from '@/lib/asset-utils'
import { AddAssetDialog } from '@/components/asset-components/AddAssetDialog'
import { AssetDetailsDialog } from '@/components/asset-components/AssetDetailsDialog'
import { DeleteAdminConfirmDialog } from '@/components/common/DeleteAdminConfirm'
import { useAssets } from '@/hooks/assets/useAssets'
import { useDeleteAsset } from '@/hooks/assets/useDeleteAsset'
import { useCurrentUser } from '@/hooks/users/useStaffCurrentUser'
import { useAssetCategories } from '@/hooks/assets/useAssetCategories'
import { useBranches } from '@/hooks/branch/useBranches'
import type { AssetTable } from '@/types/asset/assetSchemas'

export const Route = createFileRoute('/dashboard/marketing/asset')({
  component: RouteComponent,
})

function RouteComponent() {
  const { assets: assetDTOs, isLoading: assetsLoading, error } = useAssets()
  const { categories, isLoading: categoriesLoading } = useAssetCategories()
  const { branches, isLoading: branchesLoading } = useBranches()
  const { identity } = useCurrentUser()
  const deleteAsset = useDeleteAsset()

  const isLoading = assetsLoading || categoriesLoading || branchesLoading

  const assets = useMemo(() => {
    return assetDTOs.map(dto => {
      const category = categories.find(c => c.id === dto.assetCategoryId)
      const branch = branches.find((b: any) => b.id === dto.branchId)
      return adaptAssetFromDTO(dto, category?.name, branch?.name)
    })
  }, [assetDTOs, categories, branches])

  const [searchQuery, setSearchQuery] = useState('')
  const [addAssetDialogOpen, setAddAssetDialogOpen] = useState(false)
  const [assetDetailsOpen, setAssetDetailsOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<AssetTable | null>(null)

  const filteredAssets = filterAssets(assets, searchQuery)
  const needsAttention = getAssetsNeedingAttention(assets)
  const totalValue = calculateTotalAssetValue(assets)
  const operationalCount = getOperationalAssetsCount(assets)

  const handleAssetClick = (assetDTO: AssetTable) => {
    setSelectedAsset(assetDTO)
    setAssetDetailsOpen(true)
  }

  const handleOpenDeleteDialog = () => {
    setAssetDetailsOpen(false)
    setDeleteConfirmOpen(true)
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Asset Tracking</h1>
            <p className="text-muted-foreground">Monitor equipment, supplies, and maintenance schedules</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <p>Failed to load assets. Please try again later.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full">

      <Card className="flex flex-col shadow-md border-muted/40 max-h-[88vh]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-xl font-bold tracking-tight">Asset Tracking</CardTitle>
              <CardDescription className="mt-1">
                Manage your {assets.length} {assets.length === 1 ? 'asset' : 'assets'} and their maintenance schedules.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="px-3 py-1 text-sm">
                Total: {assets.length}
              </Badge>
              <AddAssetDialog
                open={addAssetDialogOpen}
                onOpenChange={setAddAssetDialogOpen}
                currentUserId={identity?.userId || identity?.actorId || ''}
              />
            </div>
          </div>
        </CardHeader>

        <div>
          <CardContent className="p-0">
            <div className="p-4 border-b bg-muted/5 flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search assets..."
                  className="pl-9 h-10 w-full bg-background/50 border-muted-foreground/20 focus-visible:ring-1 focus-visible:ring-offset-0"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto md:ml-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 flex-1">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/30">
                    <Package className="h-4 w-4 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Total</span>
                      <span className="text-sm font-semibold">{assets.length}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/30">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Active</span>
                      <span className="text-sm font-semibold">{operationalCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/30">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Attention</span>
                      <span className="text-sm font-semibold">{needsAttention.length}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/30">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Value</span>
                      <span className="text-sm font-semibold">₱{(totalValue / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-muted-foreground animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Loading assets...</h3>
                <p className="text-muted-foreground max-w-sm">Please wait while we fetch your asset data.</p>
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No assets found</h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                  {searchQuery ? 'Try adjusting your search to find what you\'re looking for.' : 'Get started by adding your first asset to track.'}
                </p>
              </div>
            ) : (
              <div className="relative w-full overflow-auto max-h-[600px]">
                <Table className="w-full table-fixed">
                  <TableHeader className="bg-muted/30 sticky top-0 z-10">
                    <TableRow className="hover:bg-transparent border-b border-muted/60">
                      <TableHead className="w-[35%] pl-4 md:pl-6 bg-muted/30">Asset</TableHead>
                      <TableHead className="hidden lg:table-cell lg:w-[15%] bg-muted/30">Category</TableHead>
                      <TableHead className="hidden md:table-cell md:w-[15%] bg-muted/30">Branch</TableHead>
                      <TableHead className="hidden lg:table-cell lg:w-[12%] bg-muted/30">Status</TableHead>
                      <TableHead className="hidden lg:table-cell lg:w-[12%] bg-muted/30">Condition</TableHead>
                      <TableHead className="hidden md:table-cell md:w-[11%] bg-muted/30">Age</TableHead>
                      <TableHead className="w-[10%] text-right pr-4 md:pr-6 bg-muted/30">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                    {filteredAssets.map((asset) => {
                      const age = getAssetAge(asset.purchaseDate)
                      const nearEOL = isAssetNearEOL(asset)
                      const maintenanceDue = assetNeedsMaintenance(asset)

                      return (
                        <TableRow 
                          key={asset.id} 
                          className="cursor-pointer hover:bg-muted/40 transition-colors group border-b border-muted/40"
                          onClick={() => handleAssetClick(assetDTOs.find(a => a.id === asset.id)!)}
                        >
                          <TableCell className="pl-4 md:pl-6 py-4 align-top w-[35%]">
                            <div className="flex items-start gap-3 w-full min-w-0">
                              <div className="flex flex-col gap-0.5 w-full min-w-0">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-2 w-full min-w-0">
                                  <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate w-full sm:max-w-[180px] lg:max-w-none">
                                    {asset.name}
                                  </span>
                                  {asset.serialNumber && (
                                    <Badge variant="outline" className="text-xs px-2 py-0 h-5 font-normal bg-muted/50 border-muted-foreground/20">
                                      SN: {asset.serialNumber}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  {asset.status === 'Needs Repair' && (
                                    <Badge className="bg-red-500 hover:bg-red-600 text-xs px-2 py-0 h-5">
                                      <Wrench className="h-3 w-3 mr-1" /> Repair
                                    </Badge>
                                  )}
                                  {nearEOL && (
                                    <Badge className="bg-orange-500 hover:bg-orange-600 text-xs px-2 py-0 h-5">
                                      <AlertTriangle className="h-3 w-3 mr-1" /> Near EOL
                                    </Badge>
                                  )}
                                  {maintenanceDue && (
                                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-xs px-2 py-0 h-5">
                                      <Clock className="h-3 w-3 mr-1" /> Maint. Due
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell py-4 align-top lg:w-[15%]">
                            <Badge variant="outline" className="font-normal bg-background/50">
                              {asset.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell py-4 align-top md:w-[15%]">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              <span className="text-sm">{asset.branch}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell py-4 align-top lg:w-[12%]">
                            <Badge 
                              variant={asset.status === 'Operational' ? 'default' : 'destructive'}
                              className="font-normal"
                            >
                              {asset.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell py-4 align-top lg:w-[12%]">
                            <div className="flex items-center gap-2">
                              <div className={`h-2.5 w-2.5 rounded-full ${getConditionColor(asset.condition).replace('text-', 'bg-').replace('600', '500')}`} />
                              <span className="text-sm text-muted-foreground">{asset.condition}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell py-4 align-top md:w-[11%]">
                            <div className="text-sm text-muted-foreground">
                              {age} months
                              <div className="text-xs opacity-70">
                                {format(asset.purchaseDate, 'MMM yyyy')}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right pr-4 md:pr-6 py-4 align-top w-[10%]">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <span className="sr-only">View details</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </div>
      </Card>

      <AssetDetailsDialog
        open={assetDetailsOpen}
        onOpenChange={setAssetDetailsOpen}
        asset={selectedAsset}
        currentUserId={identity?.userId || identity?.actorId || ''}
        onDeleteAsset={handleOpenDeleteDialog}
      />

      <DeleteAdminConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={async () => {
          if (selectedAsset?.id) {
            await deleteAsset.mutateAsync(selectedAsset.id)
            setSelectedAsset(null)
          }
        }}
        title={`Delete Asset: ${selectedAsset?.name}`}
        description="Are you sure you want to delete this asset?"
        confirmText="Delete Asset"
      />
    </div>
  )
}
