import { useState, useMemo } from 'react'; 
import { useMembersData } from '@/hooks/membership/useMembership';
import { useBranches } from '@/hooks/branch/useBranches';


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
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
  members: {
    id: string;
    name: string;
    branch: string;
  }[];
}

export default function AddReportDialog({ onSubmit }: AddReportDialogProps) {
  const { enrichedMembers } = useMembersData();
  const { branches } = useBranches(); 
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [branch, setBranch] = useState('');
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');
  const [occurredAt, setOccurredAt] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const memberList = useMemo(() => {
    return enrichedMembers.map(m => ({
      id: m.id,
      name: m.members[0]?.name || "Unknown Member"
    }));
  }, [enrichedMembers]);

  const branchList = useMemo(() => {
    return branches.map((b: { id: string; name: string }) => ({
      id: b.id,
      name: b.name,
    }));
  }, [branches]);

  const filteredMembers = useMemo(() => {
    if (!name.trim() || !isSearching) return [];
    return memberList.filter((member) =>
      member.name.toLowerCase().includes(name.toLowerCase())
    ).slice(0, 5); 
  }, [name, memberList, isSearching]);

  const [isBranchSearching, setIsBranchSearching] = useState(false);

  const filteredBranches = useMemo(() => {
    if (!branch.trim() || !isBranchSearching) return [];
    return branchList.filter((b: { id: string; name: string }) =>
      b.name.toLowerCase().includes(branch.toLowerCase())
    ).slice(0, 5);
  }, [branch, branchList, isBranchSearching]);

  const handleSelectMember = (memberName: string) => {
    setName(memberName);
    setIsSearching(false);
  };

  const handleSelectBranch = (branchName: string) => {
    setBranch(branchName);
    setIsBranchSearching(false);
  };

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
        </DialogHeader>
        <div className="space-y-4 border p-4 rounded-2xl">
          
          <div className="space-y-2 relative">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              placeholder="Search customer name..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setIsSearching(true);
              }}
              onFocus={() => {
                if (name.length > 0) setIsSearching(true);
              }}
              onBlur={() => {
                setTimeout(() => setIsSearching(false), 200);
              }}
            />
            {isSearching && filteredMembers.length > 0 && (
              <div className="absolute z-50 w-full top-[70px] bg-popover border rounded-md shadow-lg max-h-40 overflow-y-auto">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                    onMouseDown={(e) => {
                      e.preventDefault(); 
                      handleSelectMember(member.name);
                    }}
                  >
                    {member.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="branchName">Branch Name</Label>
            <Input
              id="branchName"
              placeholder="Search branch name..."
              value={branch}
              onChange={(e) => {
                setBranch(e.target.value);
                setIsBranchSearching(true);
              }}
              onFocus={() => {
                if (branch.length > 0) setIsBranchSearching(true);
              }}
              onBlur={() => {
                setTimeout(() => setIsBranchSearching(false), 200);
              }}
            />
            {isBranchSearching && filteredBranches.length > 0 && (
                <div className="absolute z-50 w-full top-[70px] bg-popover border rounded-md shadow-lg max-h-40 overflow-y-auto">
                {filteredBranches.map((b: { id: string; name: string }) => (
                  <div
                  key={b.id}
                  className="px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                  onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.preventDefault(); 
                    handleSelectBranch(b.name);
                  }}
                  >
                  {b.name}
                  </div>
                ))}
                </div>
            )}
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