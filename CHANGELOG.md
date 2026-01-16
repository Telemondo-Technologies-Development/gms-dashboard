
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [Unreleased]


### Added 
- Added `AssignStaffDialog` for managing assigned staff per branch.
- Integrated `MapDialog` to display branch locations with latitude and longitude.
- Dropdown menu for branch-specific actions (e.g., remove branch).
- Added confirmation dialog for branch removal.
- Responsive grid layout for branch cards with hover effects and clickable actions.
- Add New Member dialog (supports multiple members per group)
- Member details modal: view/edit member, membership and billing info
- Membership dates, durations and start/end date handling
- Member documents upload (ID, medical certificates)
- Attendance workflows: manual check-in, today's attendance view
- Payment history page with filters and export support
- Billing subscriptions and per-member billing cycles
- Support for multiple payment methods (cash, GCash, bank transfer, cards)
- Receipts and statements UI (view/print/download)
- Charts for monthly/annual spending summaries
- Docker environment with Swagger UI for API exploration
- Basic login backend logic (session-based authentication)
- Add DeleteConfirmDialog for ExpenseDetailsDialog
- Add ExpenseTable.tsx 
- Add expense-constants.ts and expense-types.ts to lib
- Add useExpenseForm.ts


### Changed 
- Added `created_by` and `updated_by` fields for tracking user actions.
- Added timestamps (`created_at`, `updated_at`) for branch creation and updates.
- AddMemberDialog changed it to Shadcn dialog
- AddExpenseDialog and ExpenseDetailsDialog changed to utilize Shadcn dialog
- Modularized expense.tsx into different component files

### Deleted
- use-mobile hook unnecessary file no use


## [0.1.0] - 2025-1-12 

### Added
- Branch Management Module : Implemented centralized control for gym locations with status tracking ('Active'/'Maintenance').
- Dynamic Branch Dialogs : Integrated `AddBranchDialog` and `BranchDetailsDialog` for seamless CRUD operations.
- Added header and sidebar layout components with navigation links, and base styling.
- Membership management section under Dashboard → Marketing: member listing, search, and attendance features.
- "Add New Member" dialog to register member groups (supports multiple members per group), set membership dates, and upload documents.
- Editable Member Details modal showing full member, membership, and billing information — allows updating saved billing info for returning customers.
- Attendance workflows: manual check-in with search and placeholders for QR/fingerprint methods; today's attendance view and records.
- Responsive members table with fixed column widths and truncation to avoid horizontal scrolling; rows are clickable to open the details modal.
- Added Expense Tracking page 
- Add New Expense dialog for new expenses
- Expense Details dialog for expense history with edit and delete options
- Added Annual and Monthly Spending trends cards with interactive charts 


### Changed
- **Iconography System**: Refactored raw SVG paths to `lucide-react` components across the marketing dashboard for better maintainability.
- **Data Schema**: Standardized `BranchFormData` to include `phone` and `address` validation.
- Members table: removed separate Membership and Billing columns to improve layout and usability; billing is viewable/editable in the details modal.
 - Improved login page: updated layout.

### Notes

- This release focuses on UI/UX for membership management and prepares the codepaths for integrating persistent storage and payment processing in future updates.



