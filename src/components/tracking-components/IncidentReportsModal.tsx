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
  id: string; 
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
    if (t.includes('positive') || t.includes('commendation') || t.includes('award')) return 'bg-emerald-500';
    if (t.includes('negative') || t.includes('incident') || t.includes('violation') || t.includes('late')) return 'bg-rose-500';
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
          <DialogTitle className="text-2xl font-black">History: {customer.name}</DialogTitle>
          <DialogDescription className="font-medium text-zinc-500">
            Reviewing all documented logs and behavior reports for this individual.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-zinc-50/30">
          {customer.reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-2xl text-muted-foreground bg-white">
              <FileText size={40} className="mb-4 opacity-20" />
              <p className="text-sm font-bold uppercase tracking-widest opacity-40">No reports filed yet</p>
            </div>
          ) : (

            [...customer.reports]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((report, index) => (
              <div 
                key={index} 
                className="group border-none rounded-2xl p-6 hover:shadow-md transition-all duration-300 bg-white shadow-sm ring-1 ring-zinc-200/50"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Calendar size={12} />
                      <span className="text-[11px] font-bold uppercase tracking-tight">
                        {new Date(report.date).toLocaleDateString(undefined, { 
                          year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={cn("h-2.5 w-2.5 rounded-full animate-pulse", getTypeColor(report.type))} />
                        <h4 className="font-black text-zinc-900 text-lg tracking-tight">{report.type}</h4>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-black uppercase py-0.5 px-2.5 rounded-full bg-zinc-50 border-zinc-200">
                    Log #{customer.reports.length - index}
                  </Badge>
                </div>

                <div className="bg-zinc-50/50 p-4 rounded-xl border border-zinc-100 mb-5">
                  <p className="text-sm text-zinc-600 leading-relaxed font-medium">
                    {report.description}
                  </p>
                </div>

                <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-zinc-100">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-zinc-100 flex items-center justify-center">
                        <User size={14} className="text-zinc-500" />
                    </div>
                    <p className="text-[11px] text-zinc-500 font-medium">
                      Filed by <span className="font-black text-zinc-900 uppercase tracking-tighter">{report.filer}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <Paperclip size={12} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Files</span>
                    </div>
                    <div className="flex gap-2">
                      {report.attachments && report.attachments.length > 0 ? (
                        report.attachments.map((id, i) => (
                          <button 
                            key={i} 
                            className="text-[10px] bg-zinc-900 text-white px-3 py-1 rounded-lg font-black uppercase hover:bg-zinc-700 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Viewing object ID:", id);
                            }}
                          >
                            View {i + 1}
                          </button>
                        ))
                      ) : (
                        <span className="text-[10px] text-zinc-300 font-black uppercase tracking-widest">None</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="shrink-0 border-t bg-background px-6 py-4">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="w-full font-black uppercase tracking-widest text-xs hover:bg-zinc-100"
          >
            Close History
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}