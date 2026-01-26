import type { FormEvent } from 'react'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Upload, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Asset } from '@/lib/asset-utils'

interface AssetDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset: Asset | null
  onUpdateAsset: (asset: Asset) => void
  onDeleteAsset?: () => void
}

export function AssetDetailsDialog({ open, onOpenChange, asset, onUpdateAsset, onDeleteAsset }: AssetDetailsDialogProps) {
  const [formData, setFormData] = useState<Partial<Asset>>({})

  useEffect(() => {
    if (asset) {
      setFormData(asset)
    }
  }, [asset])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (asset) {
      onUpdateAsset({ ...asset, ...formData })
      onOpenChange(false)
    }
  }

  if (!asset) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>
              Update asset information and maintenance records
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

          <DialogFooter className="flex justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={onDeleteAsset}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Asset
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
