import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AddReportDialog from '@/components/tracking-components/AddReportDialog'; // Import AddReportDialog

export const Route = createFileRoute('/dashboard/admin/tracking')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Reports: Jane Doe</h2>
        <AddReportDialog /> 
      </div>

      {/* Report Timeline Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Report Timeline</CardTitle>
          <CardDescription>View all reports filed for this member.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            <div className="py-4 first:pt-0">
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-green-600">Dec 10, 2025: Positive - Commendation</p>
                <p className="text-slate-700">Helped a new member with form. Great leadership.</p>
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Filer: Alex Chen</span>
                  <span>Attached: 1 image</span>
                </div>
              </div>
            </div>
            <div className="py-4">
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-amber-600">Nov 28, 2025: Safety - Equipment Misuse</p>
                <p className="text-slate-700">Using machine incorrectly after spotting classes for a week.</p>
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Filer: Sarah Lee</span>
                  <span>Attached: 1 image, 1 document</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}