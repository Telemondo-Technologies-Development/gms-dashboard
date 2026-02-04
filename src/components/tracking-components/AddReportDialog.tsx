import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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
        createdBy: 'staff-id',
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
        <div className="space-y-4 border border-border p-4 rounded-2xl">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              placeholder="Enter customer name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branchName">Branch Name</Label>
            <Input
              id="branchName"
              placeholder="Enter branch name"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reportType">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger id="reportType">
                <SelectValue placeholder="Select Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
                <SelectItem value="behavioral">Behavioral</SelectItem>
                <SelectItem value="attendance-related">Attendance-related</SelectItem>
                <SelectItem value="safety-concerns">Safety Concerns</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter report description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="occurredAt">Occurred At</Label>
            <Input
              id="occurredAt"
              type="datetime-local"
              value={occurredAt}
              onChange={(e) => setOccurredAt(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments</Label>
            <Input
              id="attachments"
              type="file"
              multiple
              onChange={(e) => setAttachments(e.target.files ? Array.from(e.target.files) : [])}
            />
          </div>
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