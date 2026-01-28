import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AddReportDialog from '@/components/tracking-components/AddReportDialog'; // Import AddReportDialog

export const Route = createFileRoute('/dashboard/admin/tracking')({
  component: RouteComponent,
});

function RouteComponent() {
  const [reports, setReports] = useState([
    {
      date: 'Dec 10, 2025',
      type: 'Positive - Commendation',
      description: 'Helped a new member with form. Great leadership.',
      filer: 'Alex Chen',
      attachments: '1 image',
    },
    {
      date: 'Nov 28, 2025',
      type: 'Safety - Equipment Misuse',
      description: 'Using machine incorrectly after spotting classes for a week.',
      filer: 'Sarah Lee',
      attachments: '1 image, 1 document',
    },
  ]);

  interface Report {
    date: string;
    type: string;
    description: string;
    filer: string;
    attachments: string;
  }

  const handleAddReport = (newReport: Report) => {
    setReports((prevReports) => [...prevReports, newReport]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Reports: Jane Doe</h2>
        <AddReportDialog onSubmit={handleAddReport} />
      </div>

      {/* Report Timeline Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Report Timeline</CardTitle>
          <CardDescription>View all reports filed for this member.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {reports.map((report, index) => (
              <div key={index} className="py-4 first:pt-0">
                <div className="flex flex-col gap-1">
                  <p className={`font-semibold ${report.type.includes('Positive') ? 'text-green-600' : 'text-amber-600'}`}>
                    {report.date}: {report.type}
                  </p>
                  <p className="text-slate-700">{report.description}</p>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Filer: {report.filer}</span>
                    <span>Attached: {report.attachments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}