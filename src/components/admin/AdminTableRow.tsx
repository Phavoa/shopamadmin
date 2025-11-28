import React from "react";
import { Edit, Pen, Trash2 } from "lucide-react";
import { Admin } from "@/api/adminApi";
import { TableCell, TableRow } from "@/components/ui/table";
import { AdminRoleBadge } from "./AdminRoleBadge";
import { AdminStatusBadge } from "./AdminStatusBadge";

interface AdminTableRowProps {
  admin: Admin;
  onEdit: (admin: Admin) => void;
  onDelete: (admin: Admin) => void;
  isDeleting: boolean;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const AdminTableRow: React.FC<AdminTableRowProps> = ({
  admin,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  return (
    <TableRow>
      <TableCell className="text-sm font-medium">
        {admin.firstName} {admin.lastName}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {admin.email}
      </TableCell>
      <TableCell>
        <AdminRoleBadge role={admin.role} />
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDate(admin.createdAt)}
      </TableCell>
      <TableCell>
        <AdminStatusBadge isActive={admin.isActive} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(admin)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Pen className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(admin)}
            className="p-2 hover:bg-red-50 rounded"
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};
