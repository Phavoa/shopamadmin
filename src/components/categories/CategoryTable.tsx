import { type Category } from "@/api/categoriesApi";
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
import { useRouter } from "next/navigation";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  onEdit,
  onDelete,
}) => {
  const router = useRouter();

  const handleCategoryClick = (category: Category) => {
    const params = new URLSearchParams({
      categoryId: category.id,
      categoryName: category.name,
    });
    router.push(`/admin-dashboard/settings/products/delete-products?${params}`);
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category Name</TableHead>
          <TableHead>Category Image</TableHead>
          <TableHead>Products</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell>
              <button
                onClick={() => handleCategoryClick(category)}
                className="text-lg text-black hover:text-blue-600 hover:underline cursor-pointer transition-colors text-left"
              >
                {category.name}
              </button>
            </TableCell>
            <TableCell>
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-cover rounded-lg "
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
              <div className="text-lg text-gray-600">
                {/* Dummy products count - replace with actual data when available */}
                {Math.floor(Math.random() * 50) + 1}
              </div>
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
