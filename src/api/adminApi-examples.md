# AdminApi Usage Examples

This document provides examples of how to use the adminApi slice in React components.

## Import the hooks

```typescript
import {
  useCreateAdminMutation,
  useGetAdminsQuery,
  useLazyGetAdminsQuery,
  useGetAdminByIdQuery,
  useLazyGetAdminByIdQuery,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} from '@/api/adminApi';
```

## Valid Admin Roles

The adminApi supports three admin roles:
- `SUPER_ADMIN` - Full system access
- `ADMIN` - Standard admin access
- `HUB_ADMIN` - Hub-specific admin access

## Create a new admin

```typescript
import React from 'react';

const CreateAdminForm = () => {
  const [createAdmin, { isLoading }] = useCreateAdminMutation();

  const handleCreateAdmin = async (adminData: CreateAdminRequest) => {
    try {
      const result = await createAdmin(adminData).unwrap();
      console.log('Admin created:', result);
      // Handle success (e.g., show toast, redirect, etc.)
    } catch (error) {
      console.error('Failed to create admin:', error);
      // Handle error
    }
  };

  return (
    <form onSubmit={handleCreateAdmin}>
      {/* Form fields */}
    </form>
  );
};
```

## List all admins with filtering

```typescript
import React, { useState } from 'react';

const AdminsList = () => {
  const [params, setParams] = useState<ListAdminsParams>({
    limit: 20,
    sortBy: 'createdAt',
    sortDir: 'desc',
  });

  const { data, isLoading, error } = useGetAdminsQuery(params);

  if (isLoading) return <div>Loading admins...</div>;
  if (error) return <div>Error loading admins</div>;

  return (
    <div>
      {data?.data.items.map((admin) => (
        <div key={admin.id}>
          <h3>{admin.firstName} {admin.lastName}</h3>
          <p>Email: {admin.email}</p>
          <p>Role: {admin.role}</p>
          <p>Status: {admin.isActive ? 'Active' : 'Inactive'}</p>
        </div>
      ))}
    </div>
  );
};
```

## Get single admin by ID

```typescript
import React from 'react';

const AdminDetail = ({ adminId }: { adminId: string }) => {
  const { data, isLoading, error } = useGetAdminByIdQuery(adminId);

  if (isLoading) return <div>Loading admin...</div>;
  if (error) return <div>Error loading admin</div>;
  if (!data) return <div>Admin not found</div>;

  const admin = data.data;

  return (
    <div>
      <h2>Admin Details</h2>
      <p>Name: {admin.firstName} {admin.lastName}</p>
      <p>Email: {admin.email}</p>
      <p>Role: {admin.role}</p>
      <p>Created: {new Date(admin.createdAt).toLocaleDateString()}</p>
      {admin.lastLoginAt && (
        <p>Last Login: {new Date(admin.lastLoginAt).toLocaleDateString()}</p>
      )}
    </div>
  );
};
```

## Update admin

```typescript
import React, { useState } from 'react';

const UpdateAdminForm = ({ adminId }: { adminId: string }) => {
  const [updateAdmin, { isLoading }] = useUpdateAdminMutation();
  const [formData, setFormData] = useState<UpdateAdminRequest>({});

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await updateAdmin({ id: adminId, data: formData }).unwrap();
      console.log('Admin updated:', result);
      // Handle success
    } catch (error) {
      console.error('Failed to update admin:', error);
      // Handle error
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      {/* Form fields for updating admin */}
      <input
        type="text"
        placeholder="First Name"
        value={formData.firstName || ''}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={formData.lastName || ''}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email || ''}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <select
        value={formData.role || ''}
        onChange={(e) => setFormData({ ...formData, role: e.target.value as 'SUPER_ADMIN' | 'ADMIN' | 'HUB_ADMIN' })}
      >
        <option value="">Select Role</option>
        <option value="ADMIN">Admin</option>
        <option value="HUB_ADMIN">Hub Admin</option>
        <option value="SUPER_ADMIN">Super Admin</option>
      </select>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Admin'}
      </button>
    </form>
  );
};
```

## Delete admin (soft delete)

```typescript
import React from 'react';

const AdminRow = ({ admin }: { admin: Admin }) => {
  const [deleteAdmin] = useDeleteAdminMutation();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to remove this admin?')) {
      try {
        await deleteAdmin(admin.id).unwrap();
        console.log('Admin removed successfully');
        // Handle success (e.g., refresh list)
      } catch (error) {
        console.error('Failed to remove admin:', error);
        // Handle error
      }
    }
  };

  return (
    <tr>
      <td>{admin.firstName} {admin.lastName}</td>
      <td>{admin.email}</td>
      <td>{admin.role}</td>
      <td>{admin.isActive ? 'Active' : 'Inactive'}</td>
      <td>
        <button onClick={handleDelete}>Remove</button>
      </td>
    </tr>
  );
};
```

## Using lazy query for programmatic fetching

```typescript
import React, { useEffect } from 'react';

const AdminSearch = () => {
  const [searchAdmins, { data, isLoading }] = useLazyGetAdminsQuery();

  useEffect(() => {
    // Initial load
    searchAdmins({ q: '', limit: 10 });
  }, [searchAdmins]);

  const handleSearch = (query: string) => {
    searchAdmins({ q: query, limit: 20 });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search admins..."
        onChange={(e) => handleSearch(e.target.value)}
      />
      {isLoading && <div>Searching...</div>}
      {data && (
        <div>
          {data.data.items.map((admin) => (
            <div key={admin.id}>{admin.firstName} {admin.lastName}</div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## API Endpoints

The adminApi provides the following endpoints:

- **POST /api/admin** - Create a new admin
- **GET /api/admin** - List administrators with query parameters
- **GET /api/admin/{id}** - Get admin by ID
- **PATCH /api/admin/{id}** - Update admin (role change requires SUPER ADMIN)
- **DELETE /api/admin/{id}** - Remove admin (soft delete)

## Query Parameters for GET /api/admin

- `populate` (array): Populate related fields (array or CSV)
- `sellerId`: Filter by seller ID
- `addresses` (boolean): Include addresses
- `q` (string): Search term
- `phone` (string): Filter by phone
- `limit` (number): Results per page (1-50, default 20)
- `after` (string): Opaque cursor for forward pagination
- `before` (string): Opaque cursor for backward paging
- `sortBy` (string): Sort key - `createdAt` or `name`
- `sortDir` (string): Sort direction - `asc` or `desc`

## Admin Roles

The system supports three admin roles:

1. **SUPER_ADMIN** - Full system access and can perform all operations including role changes
2. **ADMIN** - Standard admin access with limited permissions
3. **HUB_ADMIN** - Hub-specific admin access for managing hub-related operations