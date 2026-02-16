import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Plus, RefreshCw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Card } from "@/components/ui/card";

import { EmployeeDialog } from "@/components/user-components/EmployeeDialog";
import { EmployeeTab } from "@/components/user-components/EmployeeTab";

import { useEmployees } from "@/hooks/users/useEmployees";
import { useEmployeeActions } from "@/hooks/users/useEmployeeActions";
import { useAuthSession } from "@/lib/auth/auth-session";
import { isAdminSession } from "@/lib/auth/auth-permissions";

import type { EmployeeTableDTO } from "@/api/generated/models";
import type { EmployeeFormValues } from "@/types/user/userSchemas";

export const Route = createFileRoute("/dashboard/admin/users")({
  component: UsersPage,
});

function UsersPage() {
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeTableDTO | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const session = useAuthSession();
  const isAdmin = isAdminSession({ token: session.token, roles: session.roles });
  const hasResolvedRoles = session.roles.length > 0;

  const {
    data: employees,
    isLoading: loadingEmployees,
    error: employeesError,
    refetch: refetchEmployees,
  } = useEmployees();

  // system users removed - only employees shown here

  const { saveEmployee, deleteEmployee } = useEmployeeActions();

  const handleRefresh = () => {
    refetchEmployees();
  };

  const handleEdit = (employee: EmployeeTableDTO) => {
    setSelectedEmployee(employee);
    setIsEmployeeDialogOpen(true);
  };

  const handleEmployeeSubmit = async (values: EmployeeFormValues) => {
    await saveEmployee.mutateAsync({ employee: selectedEmployee, values });
    setIsEmployeeDialogOpen(false);
    setSelectedEmployee(null);
  };

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

  const handleDelete = async (id: string) => {
    await deleteEmployee.mutateAsync(id);
  };

  const normalizedSearch = useMemo(
    () => searchTerm.trim().toLowerCase(),
    [searchTerm],
  );

  const filteredEmployees = useMemo(() => {
    const list = employees ?? [];
    if (!normalizedSearch) return list;
    return list.filter((employee) => {
      const name = `${employee.firstName} ${employee.surname}`.toLowerCase();
      const email = employee.user?.email?.toLowerCase() ?? "";
      const contact = employee.contactNo?.toLowerCase() ?? "";
      const status = employee.status?.toLowerCase() ?? "";
      return (
        name.includes(normalizedSearch) ||
        email.includes(normalizedSearch) ||
        contact.includes(normalizedSearch) ||
        status.includes(normalizedSearch)
      );
    });
  }, [employees, normalizedSearch]);

  // users list removed from this view

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
      <h1 className="text-2xl font-bold text-primary">Employee Management</h1>

      <Card className="space-y-4 p-4">
        <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-2 ">
        <div className="relative w-full md:justify-self-start">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search employees or users..."
            className="pl-9 rounded-2xl"
          />
        </div>

        <div className="flex w-full justify-end gap-2 md:w-auto md:justify-self-end">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => {
              setSelectedEmployee(null);
              setIsEmployeeDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add Employee
          </Button>
        </div>
      </div>

      <EmployeeTab
        loadingEmployees={loadingEmployees}
        filteredEmployees={filteredEmployees}
        normalizedSearch={normalizedSearch}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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
    </div>
  );
}
