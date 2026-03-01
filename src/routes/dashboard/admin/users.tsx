import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Plus, RefreshCw, Search, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { EmployeeDialog } from "@/components/user-components/StaffAddDetailsDialog";
import { CreateEmployeeLoginDialog } from "@/components/user-components/StaffAddUserLogin";
import { EmployeeTab } from "@/components/user-components/StaffManagementTable";

import { useEmployees } from "@/hooks/users/useStaffEmployees";
import { useEmployeeActions } from "@/hooks/users/useStaffActions";
import { useEmployeeSearch } from "@/hooks/users/useStaffSearch";
import { useCreateEmployeeLogin } from "@/hooks/users/useStaffAddLogin";
import { useAuthSession } from "@/lib/auth/auth-session";
import { isAdminSession } from "@/lib/auth/auth-permissions";

import type { EmployeeTableDTO } from "@/api/generated/models";
import type { EmployeeFormValues } from "@/types/user/userSchemas";

export const Route = createFileRoute("/dashboard/admin/users")({
  component: UsersPage,
});

function UsersPage() {
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeTableDTO | null>(null);
  const [permissionNotice, setPermissionNotice] = useState<string | null>(null);

  const session = useAuthSession();
  const isAdmin = isAdminSession({ token: session.token, roles: session.roles });
  const hasResolvedRoles = session.roles.length > 0;

  const {
    data: employees,
    isLoading: loadingEmployees,
    error: employeesError,
    refetch: refetchEmployees,
  } = useEmployees();

  const { saveEmployee, deleteEmployee } = useEmployeeActions();
  const { searchTerm, setSearchTerm, normalizedSearch, filteredEmployees } = useEmployeeSearch(employees);
  const createEmployeeLogin = useCreateEmployeeLogin();

  if (hasResolvedRoles && !isAdmin) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access denied</AlertTitle>
        <AlertDescription>
          Only admin accounts can access employee admin management.
        </AlertDescription>
      </Alert>
    );
  }

  const handleEdit = (employee: EmployeeTableDTO) => {
    setSelectedEmployee(employee);
    setIsEmployeeDialogOpen(true);
  };

  const handleEmployeeSubmit = async (values: EmployeeFormValues) => {
    await saveEmployee.mutateAsync({ employee: selectedEmployee, values });
    setIsEmployeeDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleDelete = async (id: string) => {
    await deleteEmployee.mutateAsync(id);
  };

  const handleAddPermission = (employee: EmployeeTableDTO) => {
    setPermissionNotice(`Add Permission for ${employee.firstName} ${employee.surname} is not yet connected.`);
    window.setTimeout(() => setPermissionNotice(null), 3000);
  };

  return (
    <div className="space-y-4">
      {employeesError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load data</AlertTitle>
          <AlertDescription>
            {employeesError?.message ?? "Something went wrong."}
          </AlertDescription>
        </Alert>
      )}
      {permissionNotice && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Permission API</AlertTitle>
          <AlertDescription>{permissionNotice}</AlertDescription>
        </Alert>
      )}
      <Card className="flex flex-col h-full shadow-md border-muted/40">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold tracking-tight">Employee Management</CardTitle>
              <CardDescription className="mt-1">
                Manage your {filteredEmployees.length} {filteredEmployees.length === 1 ? 'employee' : 'employees'} and their access.
              </CardDescription>
            </div>
            <Badge variant="default" className="px-3 py-1 text-sm">
              Total: {filteredEmployees.length}
            </Badge>
          </div>
        </CardHeader>

        <div className="flex-1 min-h-0 overflow-auto">
          <CardContent className="p-0">
            <div className="px-6 py-4 border-b bg-muted/5 flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search employees or users..."
                  className="pl-9 h-10 bg-background/50 border-muted-foreground/20 focus-visible:ring-1 focus-visible:ring-offset-0"
                />
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => refetchEmployees()}
                  disabled={loadingEmployees}
                  className="h-10 w-10 shrink-0"
                >
                  {loadingEmployees ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <RefreshCw className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setSelectedEmployee(null);
                    setIsEmployeeDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Employee
                </Button>
              </div>
            </div>

            <EmployeeTab
              loadingEmployees={loadingEmployees}
              filteredEmployees={filteredEmployees}
              normalizedSearch={normalizedSearch}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddLogin={createEmployeeLogin.openDialog}
              onAddPermission={handleAddPermission}
            />
          </CardContent>
        </div>
      </Card>

      <EmployeeDialog
        open={isEmployeeDialogOpen}
        onOpenChange={(open) => {
          setIsEmployeeDialogOpen(open);
          if (!open) setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onSubmit={handleEmployeeSubmit}
      />

      <CreateEmployeeLoginDialog
        open={createEmployeeLogin.isCreateLoginOpen}
        onOpenChange={(open) => { if (!open) createEmployeeLogin.closeDialog(); }}
        employeeName={
          createEmployeeLogin.loginTargetEmployee
            ? `${createEmployeeLogin.loginTargetEmployee.firstName} ${createEmployeeLogin.loginTargetEmployee.surname}`
            : "Employee"
        }
        onSubmit={createEmployeeLogin.handleSubmit}
        isSubmitting={createEmployeeLogin.isPending}
        errorMessage={createEmployeeLogin.createLoginError}
      />
    </div>
  );
}
