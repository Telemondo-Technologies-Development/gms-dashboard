import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, X } from 'lucide-react'; 
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'; // Import dropdown components


interface AddReportDialogProps {
  onSubmit: (report: { date: string; type: string; description: string; filer: string; attachments: string }) => void;
}

export default function AddReportDialog({ onSubmit }: AddReportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState("No file chosen");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [staffMember, setStaffMember] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("No file chosen");
    }
  };

  const handleSubmit = () => {
    const newReport = {
      date,
      type: selectedCustomer || 'Unknown Type',
      description,
      filer: staffMember || 'Unknown Filer',
      attachments: fileName,
    };
    onSubmit(newReport); 
    setIsOpen(false);
  };
  const [selectedReportType, setSelectedReportType] = useState<string>('Select Report Type'); // State for selected report type


const reportTypes = [
    'Positive',
    'Negative',
    'Behavioral',
    'Attendance-related',
    'Safety Concerns',
  ];

const fakeCustomers = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Michael Johnson' },
  { id: 4, name: 'Emily Davis' },
  { id: 5, name: 'Chris Brown' },
];

return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
          File New Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">File New Report</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="customer">Search Customer</Label>
            <div className="relative">
              <Input
                id="customer"
                type="text"
                placeholder="Search for a customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                disabled={!!selectedCustomer} 
              />
              <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
            </div>
            <div className="mt-2 max-h-40 overflow-y-auto border rounded-md">
              {!selectedCustomer && 
                fakeCustomers
                  .filter((customer) =>
                    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((customer) => (
                    <div
                      key={customer.id}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => setSelectedCustomer(customer.name)}
                    >
                      {customer.name}
                    </div>
                  ))}
            </div>
            {selectedCustomer && (
            <>
                <div className="p-2 border rounded-md bg-blue-100 flex items-center justify-between">
                <span>Selected Customer: {selectedCustomer}</span>
                <button
                    className="text-black hover:text-gray-700"
                    onClick={() => {
                    setSelectedCustomer(null); 
                    setSearchQuery(''); 
                    }}
                >
                    <X size={16} />
                </button>
                </div>

                <div className="grid gap-2">
                    <Label>Select Report Type</Label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Input
                            type="button"
                            value={selectedReportType} 
                            className="w-full cursor-pointer text-left border border-gray-300 px-3 py-2"
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full border border-gray-300 bg-white">
                            {reportTypes.map((type) => (
                            <DropdownMenuItem
                                key={type}
                                onClick={() => setSelectedReportType(type)} 
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {type}
                            </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </>
            )}
          </div>
  
          <div className="grid gap-2">
            <Label htmlFor="date">Date Integration</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the incident or commendation..."
              className="resize-none"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
  
          <div className="grid gap-2">
            <Label htmlFor="staff">Staff Member</Label>
            <Input id="staff" placeholder="Search or enter name" value={staffMember} onChange={(e) => setStaffMember(e.target.value)} />
          </div>
  
          <div className="grid gap-2">
            <Label htmlFor="media">Attach Media (Optional)</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center w-full px-3 py-2 border rounded-md border-input bg-background cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <span className="inline-flex items-center justify-center px-3 py-1 mr-3 text-sm font-medium border rounded bg-slate-100 text-slate-900 shadow-sm whitespace-nowrap">
                Choose File
              </span>
              <span className="text-sm text-slate-500 truncate">{fileName}</span>
              <input
                id="media"
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}