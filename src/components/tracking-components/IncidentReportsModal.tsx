import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, FileText, Paperclip, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Report {
  date: string;
  type: string;
  description: string;
  filer: string;
  attachments: string[];
}

interface Customer {
  name: string;
  reports: Report[];
}

interface IncidentReportsModalProps {
  customer: Customer;
  open: boolean;
  onClose: () => void;
}

export default function IncidentReportsModal({ customer, open, onClose }: IncidentReportsModalProps) {
  const getTypeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('positive')) return 'bg-emerald-500';
    if (t.includes('negative') || t.includes('incident')) return 'bg-rose-500';
    return 'bg-blue-500';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-hidden p-0 border-none shadow-2xl">
        
        <DialogHeader className="shrink-0 border-b bg-background px-6 py-4">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
             <span className="text-[10px] font-black uppercase tracking-widest">Customer History</span>
             <ChevronRight size={10} />
          </div>
          <DialogTitle>History: {customer.name}</DialogTitle>
          <DialogDescription>
            Reviewing all documented logs and behavior reports for this individual.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {customer.reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-xl text-muted-foreground bg-muted/10">
              <FileText size={40} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">No reports filed for this customer yet.</p>
            </div>
          ) : (
            customer.reports.map((report, index) => (
              <div 
                key={index} 
                className="group border rounded-xl p-5 hover:border-primary/20 transition-all duration-200 bg-white shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Calendar size={12} />
                      <span className="text-[11px] font-medium uppercase tracking-tight">
                        {new Date(report.date).toLocaleDateString(undefined, { 
                          year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", getTypeColor(report.type))} />
                        <h4 className="font-bold text-zinc-900">{report.type}</h4>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold uppercase py-0 px-2 rounded-md">
                    ID: #{index + 1}
                  </Badge>
                </div>

                <div className="bg-zinc-50/80 p-4 rounded-lg border border-zinc-100 mb-4">
                  <p className="text-sm text-zinc-600 leading-relaxed italic">
                    "{report.description}"
                  </p>
                </div>
                <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-dashed">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-zinc-100 flex items-center justify-center">
                        <User size={12} className="text-zinc-500" />
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Filed by <span className="font-bold text-zinc-800">{report.filer}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <Paperclip size={12} />
                      <span className="text-[11px] font-semibold uppercase">Attachments</span>
                    </div>
                    <div className="flex gap-2">
                      {report.attachments.length > 0 ? (
                        report.attachments.map((id, i) => (
                          <button 
                            key={i} 
                            className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold hover:bg-blue-100"
                            onClick={() => console.log("Downloading:", id)}
                          >
                            FILE_{i + 1}
                          </button>
                        ))
                      ) : (
                        <span className="text-[10px] text-zinc-300 font-bold uppercase">None</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <DialogFooter className="shrink-0 border-t bg-background px-6 py-4 gap-3 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Close History
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}