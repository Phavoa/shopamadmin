import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CategoryTableSkeletonProps {
  rows?: number;
}

export const CategoryTableSkeleton: React.FC<CategoryTableSkeletonProps> = ({
  rows = 5,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Skeleton className="w-32 h-4" />
          </TableHead>
          <TableHead>
            <Skeleton className="w-32 h-4" />
          </TableHead>
          <TableHead>
            <Skeleton className="w-20 h-4" />
          </TableHead>
          <TableHead>
            <Skeleton className="w-20 h-4" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="w-48 h-6" />
            </TableCell>
            <TableCell>
              <Skeleton className="w-12 h-12 rounded-lg" />
            </TableCell>
            <TableCell>
              <Skeleton className="w-8 h-6" />
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Skeleton className="w-20 h-8 rounded-sm" />
                <Skeleton className="w-20 h-8 rounded-sm" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
