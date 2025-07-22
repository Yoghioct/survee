# Company Management Feature

This feature provides a complete CRUD (Create, Read, Update, Delete) interface for managing companies in the survey application.

## Features

- **List Companies**: View all companies in a table format with creation and update timestamps
- **Create Company**: Add new companies with a simple form
- **Edit Company**: Update existing company names
- **Delete Company**: Remove companies with confirmation dialog

## Components

### CompanyList.tsx
The main component that provides the complete company management interface.

### companyManager.ts
A service class that handles all API calls to the company endpoints.

## API Endpoints

- `GET /api/company` - Get all companies
- `POST /api/company` - Create a new company
- `GET /api/company/[id]` - Get a specific company
- `PUT /api/company/[id]` - Update a company
- `DELETE /api/company/[id]` - Delete a company

## Database Schema

The Company model includes:
- `id` (String, Primary Key) - Unique identifier
- `name` (String) - Company name
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

## Usage

1. Navigate to `/company` to access the company management page
2. Use the "Add New Company" button to create companies
3. Click "Edit" on any company row to modify the company name
4. Click "Delete" to remove a company (with confirmation)

## Navigation

The company management page is accessible through:
- User menu dropdown (desktop)
- Burger menu (mobile)
- Direct URL: `/company` 