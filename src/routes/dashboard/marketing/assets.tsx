import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Search, Package, AlertTriangle, CheckCircle, Calendar, Clock, Wrench, MapPin, Upload } from 'lucide-react'
import { format } from 'date-fns'

export const Route = createFileRoute('/dashboard/marketing/assets')({
  component: RouteComponent,
})

interface Asset {
  id: string
  name: string
  category: string
  branch: string
  purchaseDate: Date
  price: number
  lifespan: number
  status: string
  condition: string
  serialNumber?: string
  nextMaintenance?: Date
  notes?: string
}

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
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [formData, setFormData] = useState<Partial<Asset>>({})

  const getAge = (date: Date) => Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30))
  const isNearEOL = (asset: Asset) => getAge(asset.purchaseDate) >= asset.lifespan * 0.8
  const needsMaintenance = (asset: Asset) => {
    if (!asset.nextMaintenance) return false
    const days = Math.floor((asset.nextMaintenance.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days <= 14 && days >= 0
  }

  const filtered = assets.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase()) ||
    a.branch.toLowerCase().includes(search.toLowerCase())
  )

  const needsAttention = assets.filter((a) => a.status === 'Needs Repair' || isNearEOL(a) || needsMaintenance(a))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedAsset) {
      setAssets((prev) => prev.map((a) => (a.id === selectedAsset.id ? { ...a, ...formData } : a)))
    } else {
      setAssets((prev) => [{ id: crypto.randomUUID(), ...formData } as Asset, ...prev])
    }
    setDialogOpen(false)
    setFormData({})
    setSelectedAsset(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Asset Tracking</h1>
          <p className="text-muted-foreground">Monitor equipment, supplies, and maintenance schedules</p>
        </div>
        <Button onClick={() => { setDialogOpen(true); setSelectedAsset(null); setFormData({}) }} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Asset
        </Button>
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
            <div className="text-2xl font-bold">₱{assets.reduce((sum, a) => sum + a.price, 0).toLocaleString()}</div>
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
            <div className="text-2xl font-bold">{assets.filter((a) => a.status === 'Operational').length}</div>
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
              const age = getAge(asset.purchaseDate)
              const nearEOL = isNearEOL(asset)
              const maintenanceDue = needsMaintenance(asset)

              return (
                <Card
                  key={asset.id}
                  className="p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    setSelectedAsset(asset)
                    setFormData(asset)
                    setDialogOpen(true)
                  }}
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
                        <div>Condition: <span className={`font-medium ${asset.condition === 'Good' ? 'text-blue-600' : 'text-yellow-600'}`}>{asset.condition}</span></div>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{selectedAsset ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
              <DialogDescription>
                {selectedAsset ? 'Update asset information and maintenance records' : 'Register a new equipment or supply item'}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Asset Name *</Label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <select
                    className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
                    value={formData.category || 'Equipment'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="Equipment">Equipment</option>
                    <option value="Supplies">Supplies</option>
                    <option value="Furniture">Furniture</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Branch *</Label>
                  <select
                    className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
                    value={formData.branch || ''}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    required
                  >
                    <option value="">Select branch</option>
                    <option value="Matina Gym Fitness">Matina Gym Fitness</option>
                    <option value="Panacan Gym Fitness">Panacan Gym Fitness</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Serial Number</Label>
                  <Input
                    value={formData.serialNumber || ''}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Purchase Date *</Label>
                  <Input
                    type="date"
                    value={formData.purchaseDate ? format(formData.purchaseDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: new Date(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price (₱) *</Label>
                  <Input
                    type="number"
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Lifespan (months) *</Label>
                  <Input
                    type="number"
                    value={formData.lifespan || 60}
                    onChange={(e) => setFormData({ ...formData, lifespan: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status *</Label>
                  <select
                    className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
                    value={formData.status || 'Operational'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <option value="Operational">Operational</option>
                    <option value="Needs Repair">Needs Repair</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="End of Life">End of Life</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Condition *</Label>
                  <select
                    className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
                    value={formData.condition || 'Excellent'}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    required
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Next Maintenance Date</Label>
                <Input
                  type="date"
                  value={formData.nextMaintenance ? format(formData.nextMaintenance, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setFormData({ ...formData, nextMaintenance: e.target.value ? new Date(e.target.value) : undefined })}
                />
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <textarea
                  className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background min-h-[80px]"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Photos & Receipts</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button type="button" variant="outline" className="w-full gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Photos
                  </Button>
                  <Button type="button" variant="outline" className="w-full gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Receipts
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{selectedAsset ? 'Save Changes' : 'Add Asset'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
