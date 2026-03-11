import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parse, isValid } from 'date-fns';
import { PlusCircle, Loader2, CalendarIcon, X } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge'; // Added Badge for multi-select
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMembersData } from '@/hooks/membership/useMembershipMemberQuery';
import { useBranches } from '@/hooks/branch/useBranches';
import { useReports } from '@/hooks/Tracking/useReports';
import { useReportTypes } from '@/hooks/Tracking/useReportTypes';
import * as z from 'zod';

// 1. UPDATED SCHEMA: actorIds is now an array
const reportFormSchema = z.object({
  actorIds: z.array(z.string()).min(1, "At least one person must be involved"),
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
  const [selectedActors, setSelectedActors] = useState<any[]>([]); 
  const [dateInput, setDateInput] = useState('');
  const [month, setMonth] = useState<Date | undefined>(undefined);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: { actorIds: [], branchId: '', reportTypeId: '', description: '' },
  });

  const filteredMembers = useMemo(() => {
    if (!nameSearch.trim() || !isSearchingMembers) return [];
    return enrichedMembers?.filter(m => 
      m.members?.[0]?.name.toLowerCase().includes(nameSearch.toLowerCase()) &&
      !selectedActors.some(selected => selected.id === m.id) 
    ).slice(0, 5) || [];
  }, [nameSearch, enrichedMembers, isSearchingMembers, selectedActors]);

  const addActor = (member: any) => {
    const updated = [...selectedActors, member];
    setSelectedActors(updated);
    form.setValue('actorIds', updated.map(a => a.id));
    setNameSearch('');
    setIsSearchingMembers(false);
  };

  const removeActor = (id: string) => {
    const updated = selectedActors.filter(a => a.id !== id);
    setSelectedActors(updated);
    form.setValue('actorIds', updated.map(a => a.id));
  };

  const onSubmit = async (values: ReportFormValues) => {
    try {
      await createReport({
        actorIds: values.actorIds,
        branchId: values.branchId,
        reportTypeId: values.reportTypeId,
        description: values.description,
        occurredAt: values.occurredAt.toISOString(),
      });

      setIsOpen(false);
      form.reset();
      setSelectedActors([]);
      setNameSearch('');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2 rounded-xl font-bold bg-[#0062cc] hover:bg-[#004da3]">
        <PlusCircle className="h-4 w-4" />
        Add Report
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if(!open) { form.reset(); setSelectedActors([]); } }}>
        <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-hidden p-0 border-none shadow-2xl">
          <DialogHeader className="shrink-0 border-b bg-background px-6 py-4">
            <DialogTitle className="text-xl font-black uppercase">Create Incident Record</DialogTitle>
            <DialogDescription className="font-medium">
              You can now add multiple people to a single incident report.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">           
                
                {/* 3. MULTI-SELECT UI */}
                <div className="space-y-3">
                  <FormLabel className="font-bold text-zinc-700">Involved Personnel *</FormLabel>
                  
                  {/* Selected Badges */}
                  <div className="flex flex-wrap gap-2 min-h-[20px]">
                    {selectedActors.map((actor) => (
                      <Badge key={actor.id} className="bg-zinc-900 text-white px-3 py-1 gap-2 rounded-lg">
                        {actor.members[0].name}
                        <X 
                          size={12} 
                          className="cursor-pointer hover:text-rose-400" 
                          onClick={() => removeActor(actor.id)} 
                        />
                      </Badge>
                    ))}
                  </div>

                  <div className="relative">
                    <Input
                      placeholder="Type name to find people..."
                      value={nameSearch}
                      onChange={(e) => { setNameSearch(e.target.value); setIsSearchingMembers(true); }}
                      className="rounded-xl border-zinc-200"
                    />
                    {isSearchingMembers && filteredMembers.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border rounded-xl shadow-2xl overflow-hidden">
                        {filteredMembers.map((m) => (
                          <div 
                            key={m.id} 
                            className="px-4 py-3 text-sm hover:bg-zinc-50 cursor-pointer font-bold flex justify-between items-center"
                            onPointerDown={(e) => { e.preventDefault(); addActor(m); }}
                          >
                            {m.members[0].name}
                            <PlusCircle size={14} className="text-zinc-400" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <FormMessage>{form.formState.errors.actorIds?.message}</FormMessage>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="branchId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Branch *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-xl border-zinc-200" disabled={branchesLoading}>
                              <SelectValue placeholder="Select branch" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl">
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
                        <FormLabel className="font-bold">Classification *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-xl border-zinc-200" disabled={isLoadingTypes}>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl">
                            {reportTypes?.map((type) => (
                              <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
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
                        const parsedDate = parse(formatted, 'MM/dd/yyyy', new Date());
                        if (isValid(parsedDate)) { field.onChange(parsedDate); setMonth(parsedDate); }
                      }
                    };
                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-bold text-zinc-700">Incident Date *</FormLabel>
                        <div className="relative">
                          <Input
                            placeholder="MM/DD/YYYY"
                            value={dateInput || (field.value ? format(field.value, 'MM/dd/yyyy') : '')}
                            onChange={handleInputChange}
                            maxLength={10}
                            className="pr-10 rounded-xl border-zinc-200"
                          />
                          <Popover modal={true}>
                            <PopoverTrigger asChild>
                              <Button type="button" variant="ghost" className="absolute right-0 top-0 h-full px-3">
                                <CalendarIcon className="h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-xl" align="start">
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
                      <FormLabel className="font-bold text-zinc-700">Remarks/Description *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the incident details..." {...field} className="min-h-[120px] rounded-xl border-zinc-200" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="pt-6 border-t mt-6">
                  <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="font-bold uppercase tracking-widest text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating} className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl px-8">
                    {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Report'}
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