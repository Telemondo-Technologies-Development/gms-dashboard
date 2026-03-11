import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { Search, Loader2, RefreshCw, AlertCircle, Calendar } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import AddReportDialog from '@/components/tracking-components/AddReportDialog';
import IncidentReportsModal from '@/components/tracking-components/IncidentReportsModal';

import { useReports } from '@/hooks/Tracking/useReports';
import { useReportTypes } from '@/hooks/Tracking/useReportTypes';

export const Route = createFileRoute('/dashboard/admin/tracking')({
  component: Tracking,
});

export default function Tracking() {
  const queryClient = useQueryClient();
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);
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

  const reportList = useMemo(() => {
    if (!reports) return [];

    return reports.map((report: any) => ({
      ...report,
      typeName: typeMap[report.reportTypeId] || "General Incident",
      actorName: `${report.actorFirstname} ${report.actorSurname}`.trim(),
      filerName: `${report.createdByFirstName} ${report.createdBySurname}`.trim(),
    })).sort((a: any, b: any) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  }, [reports, typeMap]);

  const filteredReports = useMemo(() => {
    return reportList.filter((r) =>
      r.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.typeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reportList, searchQuery]);

  const handleOpenModal = (report: any) => {
    const incidentData = {
      id: report.id,
      date: report.occurredAt,
      type: report.typeName,
      description: report.description,
      filer: report.filerName,
      branch: report.branchName,
      attachments: report.objectIds || [],
      involvedPersonnel: [report.actorName] 
    };
    setSelectedIncident(incidentData);
    setModalOpen(true);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['reports'] });
  };

  const getTypeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('positive') || t.includes('award')) return 'bg-emerald-50 text-emerald-600';
    if (t.includes('negative') || t.includes('incident') || t.includes('late')) return 'bg-rose-50 text-rose-600';
    return 'bg-blue-50 text-blue-600';
  };

  return (
    <div className="space-y-6 p-4 md:p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">Incident Feed</h2>
          <p className="text-zinc-500 font-medium">Viewing unique behavior logs and branch incidents.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            className="rounded-xl border-zinc-200 font-bold text-xs uppercase tracking-widest gap-2"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </Button>
          <AddReportDialog onSuccess={handleRefresh} />
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-zinc-200/50 rounded-3xl overflow-hidden bg-white">
        <CardHeader className="border-b border-zinc-50 px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xl font-bold text-zinc-800">Incident Logs</CardTitle>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                placeholder="Search by personnel, branch, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-11 bg-zinc-50 border-none rounded-xl text-sm focus:outline-none"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-[#0062cc]" />
              <p className="text-zinc-400 font-bold text-xs uppercase">Loading unique reports...</p>
            </div>
          ) : reportsError ? (
            <div className="flex flex-col items-center justify-center py-24 text-red-500">
              <AlertCircle size={32} />
              <p className="font-bold uppercase text-xs">Failed to load reports</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="pl-8 uppercase text-[10px] font-black">Date Occurred</TableHead>
                    <TableHead className="uppercase text-[10px] font-black">Personnel</TableHead>
                    <TableHead className="uppercase text-[10px] font-black">Classification</TableHead>
                    <TableHead className="uppercase text-[10px] font-black">Branch</TableHead>
                    <TableHead className="pr-8 text-right uppercase text-[10px] font-black">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-zinc-400">No records found.</TableCell>
                    </TableRow>
                  ) : (
                    filteredReports.map((report) => (
                      <TableRow key={report.id} className="group hover:bg-zinc-50/80 transition-colors border-zinc-50">
                        <TableCell className="pl-8">
                           <div className="flex items-center gap-2">
                             <Calendar size={14} className="text-zinc-400" />
                             <span className="font-bold text-zinc-700">
                               {format(new Date(report.occurredAt), 'MMM dd, yyyy')}
                             </span>
                           </div>
                        </TableCell>
                        <TableCell className="font-bold text-zinc-900">{report.actorName}</TableCell>
                        <TableCell>
                          <Badge className={cn("rounded-lg text-[10px] font-black uppercase shadow-none border-none", getTypeColor(report.typeName))}>
                            {report.typeName}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-zinc-500">{report.branchName}</TableCell>
                        <TableCell className="text-right pr-8">
                          <Button 
                            variant="ghost" 
                            onClick={() => handleOpenModal(report)}
                            className="text-[#0062cc] font-black text-[10px] uppercase hover:bg-blue-50"
                          >
                            View Details
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

      {selectedIncident && (
        <IncidentReportsModal
          incident={selectedIncident}
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedIncident(null);
          }}
        />
      )}
    </div>
  );
}