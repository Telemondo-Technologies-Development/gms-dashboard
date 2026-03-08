import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Trash2, Loader2, CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { assetPutFormSchema, type AssetPutFormInput, type AssetPutFormValues, type AssetTable } from '@/types/asset/assetSchemas'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUpdateAsset } from '@/hooks/assets/useUpdateAsset'
import { useAssetCategories } from '@/hooks/assets/useAssetCategories'
import { useBranches } from '@/hooks/branch/useBranches'

interface AssetDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset: AssetTable | null
  currentUserId: string
  onDeleteAsset?: () => void
}

export function AssetDetailsDialog({ open, onOpenChange, asset, currentUserId, onDeleteAsset }: AssetDetailsDialogProps) {
  const updateAsset = useUpdateAsset()
  const { categories, isLoading: categoriesLoading } = useAssetCategories()
  const { branches, isLoading: branchesLoading } = useBranches()

  const form = useForm<AssetPutFormInput, unknown, AssetPutFormValues>({
    resolver: zodResolver(assetPutFormSchema),
    defaultValues: {
      name: '',
      assetCategoryId: '',
      branchId: '',
      updatedById: currentUserId,
      manufacturedDate: undefined,
      endOfLife: undefined,
      isDateRangeValid: true,
      objectIds: [],
      remarks: '',
    },
  })

  useEffect(() => {
    if (asset) {
      form.reset({
        name: asset.name,
        assetCategoryId: asset.assetCategoryId,
        branchId: asset.branchId,
        updatedById: currentUserId,
        manufacturedDate: asset.manufacturedDate ? new Date(asset.manufacturedDate) : undefined,
        endOfLife: asset.endOfLife ? new Date(asset.endOfLife) : undefined,
        isDateRangeValid: asset.isDateRangeValid,
        objectIds: asset.objectIds || [],
        remarks: asset.remarks || '',
      })
    }
  }, [asset, currentUserId, form])

  const handleSubmit = async (values: AssetPutFormValues) => {
    if (!asset) return
    try {
      const validatedData = {
        ...values,
        isDateRangeValid: true,
        objectIds: values.objectIds || [],
      }
      await updateAsset.mutateAsync({ id: asset.id, formData: validatedData })
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating asset:', error)
    }
  }

  if (!asset) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b bg-background px-6 py-4">
          <DialogTitle>Edit Asset</DialogTitle>
          <DialogDescription>
            Update asset information and maintenance records.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter asset name" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="branchId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger disabled={branchesLoading}>
                              <SelectValue placeholder="Select branch" />
                            </SelectTrigger>
                          </FormControl>
                        <SelectContent>
                          {branches.map((branch: any) => (
                            <SelectItem key={branch.id} value={branch.id}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="assetCategoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger disabled={categoriesLoading}>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="manufacturedDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Manufactured Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <FormField
                    control={form.control}
                    name="endOfLife"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End of Life Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date('1900-01-01')
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional notes or remarks"
                          {...field}
                          value={field.value || ''}
                          className="min-h-[100px] resize-y"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="flex items-center justify-between gap-3 pt-6 border-t mt-6">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={onDeleteAsset}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting || updateAsset.isPending}>
                    {form.formState.isSubmitting || updateAsset.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
