import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddReportDialogProps {
  onSubmit: (reportData: {
    name: string;
    branch: string;
    reportType: string;
    description: string;
    occurredAt: string;
    createdBy: string;
    attachments: File[];
  }) => void;
}

export default function AddReportDialog({ onSubmit }: AddReportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');
  const [occurredAt, setOccurredAt] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = () => {
    if (name.trim() && branch.trim() && reportType && description.trim() && occurredAt) {
      onSubmit({
        name: name.trim(),
        branch: branch.trim(),
        reportType,
        description: description.trim(),
        occurredAt,
        createdBy: 'staff-id', // Replace with actual staff ID
        attachments,
      });
      setName('');
      setBranch('');
      setReportType('');
      setDescription('');
      setOccurredAt('');
      setAttachments([]);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
          Add Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add New Report</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new report for a customer.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Enter customer name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Enter branch name"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          />
          <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full">
            <option value="">Select Report Type</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="behavioral">Behavioral</option>
            <option value="attendance-related">Attendance-related</option>
            <option value="safety-concerns">Safety Concerns</option>
          </select>
          <textarea
            placeholder="Enter report description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full"
          />
          <Input
            type="datetime-local"
            value={occurredAt}
            onChange={(e) => setOccurredAt(e.target.value)}
            placeholder="Occurred At"
          />
          <input
            type="file"
            multiple
            onChange={(e) => setAttachments(e.target.files ? Array.from(e.target.files) : [])}
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}