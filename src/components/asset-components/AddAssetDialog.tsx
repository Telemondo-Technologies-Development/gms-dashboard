import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, parse, isValid } from 'date-fns'
import { Plus, Loader2, CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { assetPostFormSchema, type AssetPostFormInput, type AssetPostFormValues } from '@/types/asset/assetSchemas'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateAsset } from '@/hooks/assets/useCreateAsset'
import { useAssetCategories } from '@/hooks/assets/useAssetCategories'
import { useBranches } from '@/hooks/branch/useBranches'
import { InlineAddCategoryForm } from './InlineAddCategoryForm'
import { useCreateAssetCategory } from '@/hooks/assets/useCreateAssetCategory'

interface AddAssetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUserId: string
}

export function AddAssetDialog({ open, onOpenChange, currentUserId }: AddAssetDialogProps) {
  const createAsset = useCreateAsset()
  const createCategory = useCreateAssetCategory()
  const { categories, isLoading: categoriesLoading } = useAssetCategories()
  const { branches, isLoading: branchesLoading } = useBranches()
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [manufacturedDateInput, setManufacturedDateInput] = useState('')
  const [endOfLifeDateInput, setEndOfLifeDateInput] = useState('')
  const [manufacturedMonth, setManufacturedMonth] = useState<Date | undefined>(undefined)
  const [endOfLifeMonth, setEndOfLifeMonth] = useState<Date | undefined>(undefined)

  const form = useForm<AssetPostFormInput, unknown, AssetPostFormValues>({
    resolver: zodResolver(assetPostFormSchema),
    defaultValues: {
      name: '',
      assetCategoryId: '',
      branchId: '',
      createdById: currentUserId,
      manufacturedDate: undefined,
      endOfLife: undefined,
      isDateRangeValid: true,
      objectIds: [],
      remarks: '',
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const values = form.getValues()
      console.log('Form values before submission:', values)
      
      // Manual validation
      if (!values.name?.trim()) {
        form.setError('name', { message: 'Asset name is required' })
        return
      }
      if (!values.branchId) {
        form.setError('branchId', { message: 'Branch is required' })
        return
      }
      
      let categoryId = values.assetCategoryId
      
      // If new category form is shown, create the category first
      if (showNewCategoryForm) {
        if (!newCategoryName.trim()) {
          // Show error for empty category name
          return
        }
        const newCategory = await createCategory.mutateAsync({
          name: newCategoryName.trim(),
          createdById: currentUserId,
        })
        categoryId = newCategory.id
      } else if (!categoryId) {
        form.setError('assetCategoryId', { message: 'Category is required' })
        return
      }
      
      const validatedData = {
        ...values,
        assetCategoryId: categoryId,
        isDateRangeValid: true,
        objectIds: values.objectIds || [],
      }
      console.log('Validated data:', validatedData)
      await createAsset.mutateAsync(validatedData)
      form.reset()
      setShowNewCategoryForm(false)
      setNewCategoryName('')
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating asset:', error)
    }
  }

  return (
    <>
      <Button onClick={() => onOpenChange(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Add Asset
      </Button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-hidden p-0">
          <DialogHeader className="shrink-0 border-b bg-background px-6 py-4">
            <DialogTitle>Add New Asset</DialogTitle>
            <DialogDescription>
              Register a new equipment or supply item to the inventory.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asset Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Treadmill X500" 
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
                                <SelectValue placeholder="Select a branch" />
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
                          <Select 
                            onValueChange={(value) => {
                              if (value === 'new_category') {
                                setShowNewCategoryForm(true)
                                field.onChange('')
                              } else {
                                setShowNewCategoryForm(false)
                                setNewCategoryName('')
                                field.onChange(value)
                              }
                            }} 
                            value={showNewCategoryForm ? 'new_category' : field.value}
                          >
                            <FormControl>
                              <SelectTrigger disabled={categoriesLoading}>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="new_category" className="text-primary font-medium">
                              + New Category
                            </SelectItem>
                          </SelectContent>
                        </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {showNewCategoryForm && (
                    <div className="bg-muted/30 rounded-lg p-4 border border-muted-foreground/10">
                      <InlineAddCategoryForm
                        categoryName={newCategoryName}
                        onCategoryNameChange={setNewCategoryName}
                        onCancel={() => {
                          setShowNewCategoryForm(false)
                          setNewCategoryName('')
                        }}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="manufacturedDate"
                      render={({ field }) => {
                        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value.replace(/\D/g, '')
                          let formatted = value
                          if (value.length >= 2) {
                            formatted = value.slice(0, 2) + '/' + value.slice(2)
                          }
                          if (value.length >= 4) {
                            formatted = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8)
                          }
                          setManufacturedDateInput(formatted)
                          
                          if (value.length === 8) {
                            const month = value.slice(0, 2)
                            const day = value.slice(2, 4)
                            const year = value.slice(4, 8)
                            const dateStr = `${month}/${day}/${year}`
                            const parsedDate = parse(dateStr, 'MM/dd/yyyy', new Date())
                            if (isValid(parsedDate)) {
                              field.onChange(parsedDate)
                              setManufacturedMonth(parsedDate)
                            }
                          }
                        }
                        
                        return (
                          <FormItem className="flex flex-col">
                            <FormLabel>Manufactured Date</FormLabel>
                            <div className="relative">
                              <Input
                                placeholder="MM/DD/YYYY"
                                value={manufacturedDateInput || (field.value ? format(field.value, 'MM/dd/yyyy') : '')}
                                onChange={handleInputChange}
                                maxLength={10}
                                className="pr-10"
                              />
                              <Popover modal={true}>
                                <PopoverTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                  >
                                    <CalendarIcon className="h-4 w-4 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start" side="bottom" sideOffset={4}>
                                  <div className="min-h-[320px]">
                                    <Calendar
                                      mode="single"
                                      selected={field.value || undefined}
                                      month={manufacturedMonth || field.value || undefined}
                                      onMonthChange={setManufacturedMonth}
                                      onSelect={(date) => {
                                        field.onChange(date)
                                        setManufacturedDateInput(date ? format(date, 'MM/dd/yyyy') : '')
                                        if (date) setManufacturedMonth(date)
                                      }}
                                      disabled={(date) =>
                                        date > new Date() || date < new Date('1900-01-01')
                                      }
                                      initialFocus
                                    />
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="endOfLife"
                      render={({ field }) => {
                        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value.replace(/\D/g, '')
                          let formatted = value
                          if (value.length >= 2) {
                            formatted = value.slice(0, 2) + '/' + value.slice(2)
                          }
                          if (value.length >= 4) {
                            formatted = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8)
                          }
                          setEndOfLifeDateInput(formatted)
                          
                          if (value.length === 8) {
                            const month = value.slice(0, 2)
                            const day = value.slice(2, 4)
                            const year = value.slice(4, 8)
                            const dateStr = `${month}/${day}/${year}`
                            const parsedDate = parse(dateStr, 'MM/dd/yyyy', new Date())
                            if (isValid(parsedDate)) {
                              field.onChange(parsedDate)
                              setEndOfLifeMonth(parsedDate)
                            }
                          }
                        }
                        
                        return (
                          <FormItem className="flex flex-col">
                            <FormLabel>End of Life Date</FormLabel>
                            <div className="relative">
                              <Input
                                placeholder="MM/DD/YYYY"
                                value={endOfLifeDateInput || (field.value ? format(field.value, 'MM/dd/yyyy') : '')}
                                onChange={handleInputChange}
                                maxLength={10}
                                className="pr-10"
                              />
                              <Popover modal={true}>
                                <PopoverTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                  >
                                    <CalendarIcon className="h-4 w-4 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start" side="bottom" sideOffset={4}>
                                  <div className="min-h-[320px]">
                                    <Calendar
                                      mode="single"
                                      selected={field.value || undefined}
                                      month={endOfLifeMonth || field.value || undefined}
                                      onMonthChange={setEndOfLifeMonth}
                                      onSelect={(date) => {
                                        field.onChange(date)
                                        setEndOfLifeDateInput(date ? format(date, 'MM/dd/yyyy') : '')
                                        if (date) setEndOfLifeMonth(date)
                                      }}
                                      disabled={(date) =>
                                        date < new Date('1900-01-01')
                                      }
                                      initialFocus
                                    />
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
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
                            placeholder="Additional notes, condition details, or specific instructions"
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

                <DialogFooter className="gap-3 sm:gap-0 pt-6 border-t mt-6">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting || createAsset.isPending}>
                    {form.formState.isSubmitting || createAsset.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Add Asset'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
