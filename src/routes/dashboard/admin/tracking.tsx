import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import AddReportDialog from '@/components/tracking-components/AddReportDialog';
import IncidentReportsModal from '@/components/tracking-components/IncidentReportsModal';

export const Route = createFileRoute('/dashboard/admin/tracking')({
  component: Tracking,
});

interface Customer {
  id: string;
  name: string;
  branch: string; 
  reports: {
    date: string;
    type: string;
    description: string;
    filer: string;
    attachments: string[];
  }[];
}

export default function Tracking() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeCustomerData = customers.find((c) => c.id === selectedCustomerId);

  const handleOpenModal = (customer: Customer): void => {
    setSelectedCustomerId(customer.id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCustomerId(null);
  };

  const handleAddReport = (reportData: {
    name: string;
    branch: string;
    reportType: string;
    description: string;
    occurredAt: string;
    createdBy: string;
    attachments: File[];
  }) => {
    setCustomers((prevCustomers) => {
      const existingCustomer = prevCustomers.find((customer) => customer.name === reportData.name && customer.branch === reportData.branch);
      if (existingCustomer) {
        return prevCustomers.map((customer) =>
          customer.name === reportData.name && customer.branch === reportData.branch
            ? {
                ...customer,
                reports: [
                  ...customer.reports,
                  {
                    date: reportData.occurredAt,
                    type: reportData.reportType,
                    description: reportData.description,
                    filer: reportData.createdBy,
                    attachments: reportData.attachments.map((file) => URL.createObjectURL(file)),
                  },
                ],
              }
            : customer
        );
      } else {
        return [
          ...prevCustomers,
          {
            id: String(prevCustomers.length + 1), 
            name: reportData.name,
            branch: reportData.branch,
            reports: [
              {
                date: reportData.occurredAt,
                type: reportData.reportType,
                description: reportData.description,
                filer: reportData.createdBy,
                attachments: reportData.attachments.map((file) => URL.createObjectURL(file)),
              },
            ],
          },
        ];
      }
    });
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Incident Reports</h2>
        <Button variant="outline" onClick={() => window.location.reload()}>Refresh</Button>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between flex-row">
          <div>
            <CardTitle>Customers</CardTitle>
            <CardDescription>Click a customer to view incident reports.</CardDescription>
          </div>
          <AddReportDialog onSubmit={handleAddReport} />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-6">
            <Input
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No customers found matching your search.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Reports</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleOpenModal(customer)}
                    >
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.branch}</TableCell>
                      <TableCell>{customer.reports.length} reports</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {activeCustomerData && (
        <IncidentReportsModal
          customer={activeCustomerData}
          open={modalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}