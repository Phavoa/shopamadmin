import React from "react";
import { type LivestreamCategory } from "@/api/livestreamCategoriesApi";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

interface LivestreamCategoryTableProps {
  categories: LivestreamCategory[];
  onEdit: (category: LivestreamCategory) => void;
  onDelete: (category: LivestreamCategory) => void;
}

export const LivestreamCategoryTable: React.FC<
  LivestreamCategoryTableProps
> = ({ categories, onEdit, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell>
              <span className="text-lg text-black font-medium">
                {category.name}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm text-gray-600">
                {category.description || "—"}
              </span>
            </TableCell>
            <TableCell>
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              ) : (
                <Image
                  src={"/images/image-placeholder.png"}
                  alt={category.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                />
              )}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  onClick={() => onEdit(category)}
                  className="px-4 min-w-28 py-2 rounded-sm bg-[#E67E22] text-white text-sm font-medium border-none cursor-pointer hover:bg-[#E67E22]/90 transition-colors"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => onDelete(category)}
                  className="px-4 min-w-28 py-2 rounded-sm bg-white text-red-600 text-sm font-medium border border-red-200 cursor-pointer hover:bg-red-50 transition-colors"
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
