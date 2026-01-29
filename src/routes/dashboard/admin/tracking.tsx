import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import IncidentReportsModal from '@/components/tracking-components/IncidentReportsModal'; // Modal for incident reports
import AddReportDialog from '@/components/tracking-components/AddReportDialog'; // Dialog for adding new reports

export const Route = createFileRoute('/dashboard/admin/tracking')({
  component: RouteComponent,
});

function RouteComponent() {
  const [customers] = useState([
    { id: '1', name: 'Jane Doe', reports: [] },
    { id: '2', name: 'John Smith', reports: [] },
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  interface Customer {
    id: string;
    name: string;
    reports: any[]; 
  }

  const handleOpenModal = (customer: Customer): void => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Incident Reports</h2>
        <Button variant="outline">Refresh</Button>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Customers</CardTitle>
            <CardDescription>Click a customer to view incident reports.</CardDescription>
          </div>
          <AddReportDialog 
            onSubmit={(report) => {
              console.log('Report submitted:', report);
            }}
          /> 
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
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
                    <TableHead>Reports</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      role="button"
                      tabIndex={0}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleOpenModal(customer)}
                    >
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.reports.length} reports</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Incident Reports Modal */}
      {selectedCustomer && (
        <IncidentReportsModal
          customer={selectedCustomer}
          open={modalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}