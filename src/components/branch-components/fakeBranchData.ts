import type { BranchFormData } from '@/components/branch-components/branch/AddBranchDialog';

export const fakeBranchesData: BranchFormData[] = [
  {
    id: '1',
    name: 'Matina Gym Fitness',
    address: '123 Matina GSIS Davao City Philippines',
    phone: '09171234567',
    status: 'Active',
    assignedStaff: [
      { id: '1', name: 'John Doe', role: 'Manager', email: 'john.doe@example.com', phone: '09171234567', address: '123 Matina St.', birthday: '1985-01-01' },
      { id: '2', name: 'Jane Smith', role: 'Staff', email: 'jane.smith@example.com', phone: '09179876543', address: '456 Matina St.', birthday: '1990-02-02' },
      { id: '3', name: 'Alice Johnson', role: 'Staff', email: 'alice.johnson@example.com', phone: '09179876544', address: '789 Matina St.', birthday: '1995-03-03' },
    ],
    longitude: 125.5929,
    latitude: 7.0618,
    revenue: 50000,
    expenses: 20000,
    memberships: 150,
  },
  {
    id: '2',
    name: 'Panacan Gym Fitness',
    address: '123 Panacan Davao City Philippines',
    phone: '09179876543',
    status: 'Maintenance',
    assignedStaff: [
      { id: '6', name: 'Michael Green', role: 'Manager', email: 'michael.green@example.com', phone: '09179876547', address: '123 Panacan St.', birthday: '1985-01-01' },
      { id: '7', name: 'Sarah Blue', role: 'Staff', email: 'sarah.blue@example.com', phone: '09179876548', address: '456 Panacan St.', birthday: '1990-02-02' },
    ],
    longitude: 125.6478,
    latitude: 7.1502,
    revenue: 30000,
    expenses: 19000,
    memberships: 100,
  },
  {
    id: '3',
    name: 'Toril Gym Fitness',
    address: '123 Panacan Davao City Philippines',
    phone: '09179876543',
    status: 'Active',
    assignedStaff: [
      { id: '11', name: 'Anna Purple', role: 'Manager', email: 'anna.purple@example.com', phone: '09179876552', address: '123 Toril St.', birthday: '1985-01-01' },
      { id: '12', name: 'James Orange', role: 'Staff', email: 'james.orange@example.com', phone: '09179876553', address: '456 Toril St.', birthday: '1990-02-02' },
    ],
    longitude: 125.497874,
    latitude: 7.014951,
    revenue: 40000,
    expenses: 18000,
    memberships: 120,
  },
 
];