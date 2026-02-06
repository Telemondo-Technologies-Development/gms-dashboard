
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [Unreleased]

### Added

- Membership: Refactored member + subscription flows to align with backend DTOs (MemberPostDTO/MemberPutDTO, MemberSubscriptionPostDTO/MemberSubscriptionPutDTO). Improved Members page performance by removing duplicated local state, adding memoization and React.memo where appropriate, and centralizing mutations to use React Query cache invalidation.
- Payment History: Added enhanced filtering and CSV export support for payment history, and improved query efficiency and UI responsiveness for large result sets.
- Login / Auth: Centralized authentication state with a persisted Zustand store (`auth-session.ts`) that stores token and `assignedBranches`; added shared JWT utilities for robust claim parsing; login flow updated to return token + identity payload consistently.
- User Management: Split system users and employees in the UI, integrated employee-first workflow (create employee before creating user login), added a "Has Login" column to the employees table, and removed the previous combined System Users tab for clarity.

### Changed

- API Generation: Client regeneration included updated models and API method signatures; downstream hooks and utilities were adjusted to the regenerated shapes.
- Membership: Member creation and details dialogs now use React Query as the single source of truth; dialogs invalidate member queries after mutations instead of using callback prop-drilling.
- Payment History: Query keys and caching were refined so filters produce deterministic query keys and cache entries per-branch where applicable.
- Login / Auth: Auth session now exposes `assignedBranches` and a light-weight helper hook (`useAuthSession`) — branch selection flows were reworked to store the user's selected branch in a separate `user-store` (Zustand) so pages and queries can depend on the selected branch.
- User Management: Employee editing and creation moved into `EmployeeDialog`; Employee list rows indicate whether a system user exists for that employee; removed the legacy User tab and related UI duplication.
- Polished expense page design to match system design
- Removed Key insights component in analytics page and polished page design to match system design



## [0.4.0] - 2026-2-3

### Added
- Tracking Page : addedd a page for managing incident reports with customer specific details.
- AddReportDialog : Dialog for adding new reports with customer.
- IncidentReportsModal : A modal for viewing detailed report for a customer.
- TrackingTable for displaying customers and their report counts.
- Users & Employees split management UI with separate dialogs for system users vs. employees.
- Users & Employees search across employees and system users.
- Users & Employees employee list row click-to-edit interaction (no action column).
- Membership: aligned member + subscription handling with backend DTO shapes (MemberPostDTO/MemberPutDTO, MemberSubscriptionPostDTO/MemberSubscriptionPutDTO).
- Membership: improved refresh UX with an in-button loading spinner.
- Payment History: filters and export support for payment history.
- API generation: OpenAPI client generation integrated (generated TypeScript API under `src/api/generated` from `openapi.json`).

### Changed
- Users & Employees: refined schemas to match backend response fields (e.g., user timestamps) and separated employee form schema from system-user creation.
- Membership: refactored member creation flow to validate payloads via Zod schemas before API calls.



## [0.3.0] - 2026-1-26


### Added
- Integrated MultiBranchOverview for displaying branch summaries ( using shadcn tabs).
- Added API integration for fetching data.
- Implemented backend connection Schema and TanStack Query integration.
- Added backend form handling using TanStack Form.
- Added user and employee management module.
- Integrated user and branch display in the application header.
- Add analytics page with charts and tables for Branch Performance, Income Report, Membership growth, Payment Method, and Revenue vs Expense

### Changed
- Updated fetchBranchesFromApi to fetch branch data from the backend and validate the response format.
- Refactored `AddMemberDialog` and `MemberDetailsDialog` to use a unified 2-column layout (Member Information vs. Billing/Subscription).
- Split member name fields (First, Middle, Surname, Suffix) and added Status selection in `MemberDetailsDialog`.
- Enhanced Sidebar navigation with smooth width transitions, text opacity animations, and improved toggle button styling.
- Refined login logic and security by removing bypass code.
- Minor design changes to the charts and tables of analytics page


## [0.2.0] - 2026-1-19


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


## [0.1.0] - 2026-1-12 

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



