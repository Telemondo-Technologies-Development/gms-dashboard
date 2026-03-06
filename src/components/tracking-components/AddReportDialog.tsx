import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parse, isValid } from 'date-fns';
import { PlusCircle, Loader2, CalendarIcon, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMembersData } from '@/hooks/membership/useMembership';
import { useBranches } from '@/hooks/branch/useBranches';
import { useReports } from '@/hooks/Tracking/useReports';
import { useReportTypes } from '@/hooks/Tracking/useReportTypes';
import * as z from 'zod';

const reportFormSchema = z.object({
  actorId: z.string().min(1, "Target personnel is required"),
  branchId: z.string().min(1, "Branch is required"),
  reportTypeId: z.string().min(1, "Classification is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  occurredAt: z.date({ message: "Incident date is required" }),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

interface AddReportDialogProps {
  onSuccess?: () => void;
}

export default function AddReportDialog({ onSuccess }: AddReportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { enrichedMembers } = useMembersData();
  const { branches, isLoading: branchesLoading } = useBranches();
  const { createReport, isCreating } = useReports();

  const { data: reportTypes, isLoading: isLoadingTypes } = useReportTypes();

  const [nameSearch, setNameSearch] = useState('');
  const [isSearchingMembers, setIsSearchingMembers] = useState(false);
  const [dateInput, setDateInput] = useState('');
  const [month, setMonth] = useState<Date | undefined>(undefined);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: { actorId: '', branchId: '', reportTypeId: '', description: '' },
  });

  const filteredMembers = useMemo(() => {
    if (!nameSearch.trim() || !isSearchingMembers) return [];
    return enrichedMembers?.filter(m => 
      m.members?.[0]?.name.toLowerCase().includes(nameSearch.toLowerCase())
    ).slice(0, 5) || [];
  }, [nameSearch, enrichedMembers, isSearchingMembers]);

  const onSubmit = async (values: ReportFormValues) => {
    try {
      await createReport({ ...values, occurredAt: values.occurredAt.toISOString() });
      setIsOpen(false);
      form.reset();
      setNameSearch('');
      setDateInput('');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <PlusCircle className="h-4 w-4" />
        Add Report
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if(!open) form.reset(); }}>
        <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-hidden p-0 border-none shadow-2xl">
          <DialogHeader className="shrink-0 border-b bg-background px-6 py-4">
            <DialogTitle>Add New Incident Report</DialogTitle>
            <DialogDescription>
              Register a new incident or positive feedback record.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">           
                <FormField
                  control={form.control}
                  name="actorId"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Target Personnel/Customer *</FormLabel>
                      <div className="relative">
                        <Input
                          placeholder="Search by name..."
                          value={nameSearch}
                          onChange={(e) => { setNameSearch(e.target.value); setIsSearchingMembers(true); }}
                        />
                        {field.value && <CheckCircle2 size={16} className="absolute right-3 top-3 text-primary" />}
                      </div>
                      {isSearchingMembers && filteredMembers.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {filteredMembers.map((m) => (
                            <div 
                              key={m.id} 
                              className="px-4 py-2 text-sm hover:bg-muted cursor-pointer font-medium"
                              onPointerDown={(e) => {
                                e.preventDefault();
                                field.onChange(m.id);
                                setNameSearch(m.members[0].name);
                                setIsSearchingMembers(false);
                              }}
                            >
                              {m.members[0].name}
                            </div>
                          ))}
                        </div>
                      )}
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
                            {branches?.map((branch: any) => (
                              <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reportTypeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Classification *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger disabled={isLoadingTypes}>
                              <SelectValue placeholder={isLoadingTypes ? "Loading..." : "Select type"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {reportTypes?.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="occurredAt"
                  render={({ field }) => {
                    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value.replace(/\D/g, '');
                      let formatted = value;
                      if (value.length >= 2) formatted = value.slice(0, 2) + '/' + value.slice(2);
                      if (value.length >= 4) formatted = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
                      setDateInput(formatted);
                      if (value.length === 8) {
                        const parsedDate = parse(`${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`, 'MM/dd/yyyy', new Date());
                        if (isValid(parsedDate)) { field.onChange(parsedDate); setMonth(parsedDate); }
                      }
                    };
                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel>Incident Date *</FormLabel>
                        <div className="relative">
                          <Input
                            placeholder="MM/DD/YYYY"
                            value={dateInput || (field.value ? format(field.value, 'MM/dd/yyyy') : '')}
                            onChange={handleInputChange}
                            maxLength={10}
                            className="pr-10"
                          />
                          <Popover modal={true}>
                            <PopoverTrigger asChild>
                              <Button type="button" variant="ghost" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent">
                                <CalendarIcon className="h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                month={month || field.value}
                                onMonthChange={setMonth}
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setDateInput(date ? format(date, 'MM/dd/yyyy') : '');
                                }}
                                disabled={(date) => date > new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks/Description *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Additional notes or incident details..." {...field} className="min-h-[100px] resize-y" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="gap-3 sm:gap-0 pt-6 border-t mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Add Report'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}