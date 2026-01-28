import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Customer {
  name: string;
  reports: {
    date: string;
    type: string;
    description: string;
    filer: string;
    attachments: string;
  }[];
}

interface IncidentReportsModalProps {
  customer: Customer;
  open: boolean;
  onClose: () => void;
}

export default function IncidentReportsModal({ customer, open, onClose }: IncidentReportsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Incident Reports for {customer.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {customer.reports.length === 0 ? (
            <p className="text-muted-foreground">No incident reports found for this customer.</p>
          ) : (
            customer.reports.map((report, index) => (
              <div key={index} className="border rounded-md p-4">
                <p className="font-semibold">{report.date}: {report.type}</p>
                <p>{report.description}</p>
                <p className="text-xs text-muted-foreground">Filer: {report.filer}</p>
                <p className="text-xs text-muted-foreground">Attachments: {report.attachments}</p>
              </div>
            ))
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}