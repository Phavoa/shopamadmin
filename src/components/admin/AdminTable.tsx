import React from "react";
import { Admin } from "@/api/adminApi";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
} from "@/components/ui/table";
import { AdminTableRow } from "./AdminTableRow";

interface AdminTableProps {
  admins: Admin[];
  onEdit: (admin: Admin) => void;
  onDelete: (admin: Admin) => void;
  isDeleting: boolean;
}

export const AdminTable: React.FC<AdminTableProps> = ({
  admins,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  return (
    <Table>
      <TableHeader>
        <tr>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Date Added</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </tr>
      </TableHeader>
      <TableBody>
        {admins.map((admin) => (
          <AdminTableRow
            key={admin.id}
            admin={admin}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        ))}
      </TableBody>
    </Table>
  );
};
