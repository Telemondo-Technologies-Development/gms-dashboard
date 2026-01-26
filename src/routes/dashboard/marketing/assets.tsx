import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Package, AlertTriangle, CheckCircle, Calendar, Clock, Wrench, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import {
  type Asset,
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
import { DeleteAssetDialog } from '@/components/asset-components/DeleteAssetDialog'

export const Route = createFileRoute('/dashboard/marketing/assets')({
  component: RouteComponent,
})

function RouteComponent() {
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: '1',
      name: 'Treadmill Pro X500',
      category: 'Equipment',
      branch: 'Matina Gym Fitness',
      purchaseDate: new Date('2023-01-15'),
      price: 85000,
      lifespan: 60,
      status: 'Operational',
      condition: 'Good',
      serialNumber: 'TRD-X500-2023-001',
      nextMaintenance: new Date('2025-02-01'),
      notes: 'Regular maintenance every 3 months',
    },
    {
      id: '2',
      name: 'Elliptical Trainer E200',
      category: 'Equipment',
      branch: 'Panacan Gym Fitness',
      purchaseDate: new Date('2021-06-10'),
      price: 65000,
      lifespan: 48,
      status: 'Needs Repair',
      condition: 'Fair',
      serialNumber: 'ELP-E200-2021-045',
      nextMaintenance: new Date('2025-01-15'),
      notes: 'Belt needs replacement',
    },
  ])

  const [search, setSearch] = useState('')
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  const filtered = filterAssets(assets, search)
  const needsAttention = getAssetsNeedingAttention(assets)
  const totalValue = calculateTotalAssetValue(assets)
  const operationalCount = getOperationalAssetsCount(assets)

  const handleAddAsset = (newAsset: Omit<Asset, 'id'>) => {
    setAssets((prev) => [{ id: crypto.randomUUID(), ...newAsset }, ...prev])
  }

  const handleUpdateAsset = (updatedAsset: Asset) => {
    setAssets((prev) => prev.map((a) => (a.id === updatedAsset.id ? updatedAsset : a)))
    setSelectedAsset(null)
  }

  const handleDeleteAsset = (assetId: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== assetId))
    setSelectedAsset(null)
    setDetailsDialogOpen(false)
  }

  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset)
    setDetailsDialogOpen(true)
  }

  const handleOpenDeleteDialog = () => {
    setDetailsDialogOpen(false)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Asset Tracking</h1>
          <p className="text-muted-foreground">Monitor equipment, supplies, and maintenance schedules</p>
        </div>
        <AddAssetDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onAddAsset={handleAddAsset}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.length}</div>
            <p className="text-xs text-muted-foreground">Across all branches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Purchase value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{needsAttention.length}</div>
            <p className="text-xs text-muted-foreground">Repairs or maintenance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operational</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operationalCount}</div>
            <p className="text-xs text-muted-foreground">Ready to use</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assets Inventory</CardTitle>
          <CardDescription>Track and manage all gym equipment and supplies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="space-y-4">
            {filtered.map((asset) => {
              const age = getAssetAge(asset.purchaseDate)
              const nearEOL = isAssetNearEOL(asset)
              const maintenanceDue = assetNeedsMaintenance(asset)

              return (
                <Card
                  key={asset.id}
                  className="p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => handleAssetClick(asset)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{asset.name}</h3>
                        <Badge variant={asset.status === 'Operational' ? 'default' : 'destructive'}>
                          {asset.status}
                        </Badge>
                        <Badge variant="outline">{asset.category}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {asset.branch}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(asset.purchaseDate, 'MMM yyyy')}
                        </div>
                        <div>
                          Age: {age}/{asset.lifespan} months
                        </div>
                        <div>Condition: <span className={`font-medium ${getConditionColor(asset.condition)}`}>{asset.condition}</span></div>
                      </div>
                      {asset.serialNumber && (
                        <div className="text-xs text-muted-foreground mt-1">SN: {asset.serialNumber}</div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 ml-4">
                      {asset.status === 'Needs Repair' && (
                        <div className="flex items-center gap-1 text-xs text-red-600">
                          <Wrench className="h-3 w-3" />
                          Needs Repair
                        </div>
                      )}
                      {nearEOL && (
                        <div className="flex items-center gap-1 text-xs text-orange-600">
                          <AlertTriangle className="h-3 w-3" />
                          Near EOL
                        </div>
                      )}
                      {maintenanceDue && (
                        <div className="flex items-center gap-1 text-xs text-yellow-600">
                          <Clock className="h-3 w-3" />
                          Maintenance Due
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-3">
                    <div
                      className={`h-1.5 rounded-full ${nearEOL ? 'bg-red-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min((age / asset.lifespan) * 100, 100)}%` }}
                    />
                  </div>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <AssetDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        asset={selectedAsset}
        onUpdateAsset={handleUpdateAsset}
        onDeleteAsset={handleOpenDeleteDialog}
      />

      <DeleteAssetDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        asset={selectedAsset}
        onConfirmDelete={handleDeleteAsset}
      />
    </div>
  )
}
