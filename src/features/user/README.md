# User Management Feature

This feature provides a complete CRUD (Create, Read, Update, Delete) interface for managing users with role-based access control in the survey application.

## Features

- **List Users**: View all users in a table format with avatar, name, email, role, and creation date
- **Create User**: Add new users with name, email, password, and role assignment
- **Edit User**: Update existing user information including optional password change
- **Delete User**: Remove users with confirmation dialog
- **Role Management**: Three user roles: ADMIN, MANAGER, USER

## User Roles

- **ADMIN**: Full system access (red badge)
- **MANAGER**: Management level access (blue badge)  
- **USER**: Standard user access (green badge)

## Components

### UserList.tsx
The main component that provides the complete user management interface with role badges and avatar display.

### userManager.ts
A service class that handles all API calls to the user endpoints.

## API Endpoints

- `GET /api/user` - Get all users (excludes password)
- `POST /api/user` - Create a new user
- `GET /api/user/[id]` - Get a specific user
- `PUT /api/user/[id]` - Update a user
- `DELETE /api/user/[id]` - Delete a user

## Database Schema

The User model includes:
- `id` (String, Primary Key) - Unique identifier
- `name` (String) - User's full name
- `email` (String, Unique) - User's email address
- `hashedPassword` (String) - Encrypted password
- `role` (UserRole) - User role (ADMIN, MANAGER, USER)
- `image` (String, Optional) - Profile image URL
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

## Usage

1. Navigate to `/user` to access the user management page
2. Use the "Add New User" button to create users with roles
3. Click "Edit" on any user row to modify user information
4. Click "Delete" to remove a user (with confirmation)
5. Role badges are color-coded for easy identification

## Security Features

- Password hashing using bcrypt
- Email uniqueness validation
- Role-based access control
- Secure password updates (optional during edit)

## Navigation

The user management page is accessible through:
- Main navigation menu (desktop)
- User dropdown menu
- Burger menu (mobile)
- Direct URL: `/user` 