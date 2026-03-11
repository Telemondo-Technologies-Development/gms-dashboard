import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, FileText, Paperclip, ChevronRight, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IncidentDetails {
  id: string;
  date: string;
  type: string;
  description: string;
  filer: string;
  branch: string;
  attachments: string[];
  involvedPersonnel: string[]; 
}

interface IncidentReportsModalProps {
  incident: IncidentDetails | null; 
  open: boolean;
  onClose: () => void;
}

export default function IncidentReportsModal({ incident, open, onClose }: IncidentReportsModalProps) {
  if (!incident) return null;

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
             <span className="text-[10px] font-black uppercase tracking-widest">Incident Tracking</span>
             <ChevronRight size={10} />
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">{incident.branch}</span>
          </div>
          <DialogTitle className="text-2xl font-black">Incident Details</DialogTitle>
          <DialogDescription className="font-medium text-zinc-500">
            Full documentation and metadata for this specific record.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-zinc-50/30">
          
          <div className="border-none rounded-2xl p-6 bg-white shadow-sm ring-1 ring-zinc-200/50">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Calendar size={12} />
                  <span className="text-[11px] font-bold uppercase tracking-tight">
                    {new Date(incident.date).toLocaleDateString(undefined, { 
                      year: 'numeric', month: 'long', day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className={cn("h-2.5 w-2.5 rounded-full", getTypeColor(incident.type))} />
                    <h4 className="font-black text-zinc-900 text-lg tracking-tight uppercase">{incident.type}</h4>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] font-black uppercase py-0.5 px-2.5 rounded-full bg-zinc-50 border-zinc-200">
                REF: {incident.id.slice(0, 8)}
              </Badge>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <Users size={12} />
                <span className="text-[10px] font-black uppercase tracking-widest">Personnel Involved</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {incident.involvedPersonnel.map((person, i) => (
                  <Badge key={i} className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border-none px-3 py-1 font-bold">
                    {person}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-zinc-50/50 p-4 rounded-xl border border-zinc-100 mb-6">
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <FileText size={12} />
                <span className="text-[10px] font-black uppercase tracking-widest">Incident Summary</span>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed font-medium">
                {incident.description}
              </p>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-zinc-100 flex items-center justify-center">
                    <User size={14} className="text-zinc-500" />
                </div>
                <p className="text-[11px] text-zinc-500 font-medium">
                  Filed by <span className="font-black text-zinc-900 uppercase tracking-tighter">{incident.filer}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Paperclip size={12} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Attachments</span>
                </div>
                <div className="flex gap-2">
                  {incident.attachments && incident.attachments.length > 0 ? (
                    incident.attachments.map((id, i) => (
                      <button 
                        key={i} 
                        className="text-[10px] bg-zinc-900 text-white px-3 py-1 rounded-lg font-black uppercase hover:bg-zinc-700 transition-colors"
                      >
                        File {i + 1}
                      </button>
                    ))
                  ) : (
                    <span className="text-[10px] text-zinc-300 font-black uppercase tracking-widest">No Files</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t bg-background px-6 py-4">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="w-full font-black uppercase tracking-widest text-xs hover:bg-zinc-100 rounded-xl"
          >
            Close Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}