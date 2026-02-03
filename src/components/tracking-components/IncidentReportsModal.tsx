import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Customer {
  name: string;
  reports: {
    date: string;
    type: string;
    description: string;
    filer: string;
    attachments: string[];
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
          <DialogDescription>
            View all incident reports for the selected customer. If no reports are available, you can add a new one.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {customer.reports.length === 0 ? (
            <p className="text-muted-foreground">No incident reports found for this customer.</p>
          ) : (
            customer.reports.map((report, index) => (
              <div key={index} className="border rounded-md p-4">
                <p className="font-semibold">
                  <span className="text-blue-600">{new Date(report.date).toLocaleString()}</span>:{' '}
                  <span className="text-gray-800">{report.type}</span>
                </p>
                <p className="mt-2">{report.description}</p>
                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold">Filed by:</span> {report.filer}
                  </p>
                  <p>
                    <span className="font-semibold">Attachments:</span>{' '}
                    {report.attachments.length > 0 ? (
                      report.attachments.map((attachment, i) => (
                        <a
                          key={i}
                          href={attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Attachment {i + 1}
                        </a>
                      ))
                    ) : (
                      'None'
                    )}
                  </p>
                </div>
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