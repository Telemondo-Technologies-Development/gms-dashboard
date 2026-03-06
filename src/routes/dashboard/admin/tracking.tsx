import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { Search, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AddReportDialog from '@/components/tracking-components/AddReportDialog';
import IncidentReportsModal from '@/components/tracking-components/IncidentReportsModal';

import { useReports } from '@/hooks/Tracking/useReports';
import { useReportTypes } from '@/hooks/Tracking/useReportTypes';

export const Route = createFileRoute('/dashboard/admin/tracking')({
  component: Tracking,
});

interface GroupedCustomer {
  id: string;
  name: string;
  branch: string;
  status: string;
  reportCount: number;
  reports: any[];
}

export default function Tracking() {
  const queryClient = useQueryClient();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { reports, isLoading: reportsLoading, isError: reportsError } = useReports();

  const { data: reportTypes, isLoading: typesLoading } = useReportTypes();
  const isLoading = reportsLoading || typesLoading;
  const typeMap = useMemo(() => {
    const map: Record<string, string> = {};
    reportTypes?.forEach((t) => {
      map[t.id] = t.name;
    });
    return map;
  }, [reportTypes]);

  const groupedCustomers = useMemo(() => {
    if (!reports) return [];

    const customerMap = new Map<string, GroupedCustomer>();

    reports.forEach((report: any) => {
      const actorKey = report.actorId;
      
      if (!customerMap.has(actorKey)) {
        customerMap.set(actorKey, {
          id: report.actorId,
          name: `${report.actorFirstname ?? ''} ${report.actorSurname ?? ''}`.trim() || 'Unknown Personnel',
          branch: report.branchName || 'No Branch',
          status: report.actorStatus || 'IN',
          reportCount: 0,
          reports: [],
        });
      }

      const customer = customerMap.get(actorKey)!;
      customer.reports.push({
        id: report.id,
        date: report.occurredAt,
        type: typeMap[report.reportTypeId] || "General Incident", 
        description: report.description,
        filer: `${report.createdByFirstName ?? ''} ${report.createdBySurname ?? ''}`.trim(),
        attachments: report.objectIds || [], 
      });
      customer.reportCount = customer.reports.length;
    });

    return Array.from(customerMap.values());
  }, [reports, typeMap]); 

  const filteredCustomers = useMemo(() => {
    return groupedCustomers.filter((customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.branch.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [groupedCustomers, searchQuery]);

  const activeCustomerData = useMemo(() => 
    groupedCustomers.find((c) => c.id === selectedCustomerId),
    [groupedCustomers, selectedCustomerId]
  );

  const handleOpenModal = (customer: GroupedCustomer): void => {
    setSelectedCustomerId(customer.id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCustomerId(null);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['reports'] });
    queryClient.invalidateQueries({ queryKey: ['reportTypes'] });
  };

  return (
    <div className="space-y-6 p-4 md:p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">Incident Tracking</h2>
          <p className="text-zinc-500 font-medium">Monitor and manage personnel behavior and branch reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            className="rounded-xl border-zinc-200 font-bold text-xs uppercase tracking-widest gap-2"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            Refresh Data
          </Button>
          <AddReportDialog onSuccess={handleRefresh} />
        </div>
      </div>
      <Card className="border-none shadow-xl shadow-zinc-200/50 rounded-3xl overflow-hidden bg-white">
        <CardHeader className="border-b border-zinc-50 px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-zinc-800">Personnel & Customers</CardTitle>
              <CardDescription>Records of all incidents filed by branch and staff.</CardDescription>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search by name or branch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-zinc-50 border-none rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-zinc-200"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-[#0062cc]" />
              <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Loading records...</p>
            </div>
          ) : reportsError ? (
            <div className="flex flex-col items-center justify-center py-24 text-red-500 gap-2">
              <AlertCircle size={32} />
              <p className="font-bold uppercase text-xs tracking-widest">Failed to load reports</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30 sticky top-0 z-10">
                  <TableRow className="hover:bg-transparent border-b border-muted/60">
                    <TableHead className="pl-8 w-[30%] bg-muted/30">Full Name</TableHead>
                    <TableHead className="w-[20%] bg-muted/30">Primary Branch</TableHead>
                    <TableHead className="w-[15%] bg-muted/30">Status</TableHead>
                    <TableHead className="w-[15%] text-center bg-muted/30">Incidents</TableHead>
                    <TableHead className="pr-8 w-[20%] text-right bg-muted/30">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-zinc-400">
                        No incident records found matching your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <TableRow
                        key={customer.id}
                        className="group cursor-pointer hover:bg-zinc-50/80 border-zinc-50 transition-colors"
                        onClick={() => handleOpenModal(customer)}
                      >
                        <TableCell className="px-8 py-5">
                          <p className="font-bold text-zinc-900 group-hover:text-[#0062cc] transition-colors">
                            {customer.name}
                          </p>
                          <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-tighter">
                            {customer.id.replace('0x', '').slice(0, 8)}
                          </p>
                        </TableCell>
                        <TableCell className="font-medium text-zinc-600">{customer.branch}</TableCell>
                        <TableCell>
                          <Badge className={`rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-tight border-none ${
                            customer.status === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-zinc-100 text-zinc-900 text-xs font-black">
                            {customer.reportCount}
                          </span>
                        </TableCell>
                        <TableCell className="text-right px-8">
                          <Button variant="ghost" className="h-8 text-[10px] font-black uppercase text-[#0062cc]">
                            View History
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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