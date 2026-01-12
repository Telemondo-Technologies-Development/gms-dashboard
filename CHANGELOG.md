
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] 

### Added
 - Added header and sidebar layout components with navigation links, and base styling.
- Membership management section under Dashboard → Marketing: member listing, search, and attendance features.
- "Add New Member" dialog to register member groups (supports multiple members per group), set membership dates, and upload documents.
- Editable Member Details modal showing full member, membership, and billing information — allows updating saved billing info for returning customers.
- Attendance workflows: manual check-in with search and placeholders for QR/fingerprint methods; today's attendance view and records.
- Responsive members table with fixed column widths and truncation to avoid horizontal scrolling; rows are clickable to open the details modal.

### Changed

- Members table: removed separate Membership and Billing columns to improve layout and usability; billing is viewable/editable in the details modal.
 - Improved login page: updated layout.

### Notes

- This release focuses on UI/UX for membership management and prepares the codepaths for integrating persistent storage and payment processing in future updates.

