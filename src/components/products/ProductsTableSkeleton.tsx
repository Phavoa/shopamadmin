import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductsTableSkeletonProps {
  rows?: number;
}

export const ProductsTableSkeleton: React.FC<ProductsTableSkeletonProps> = ({
  rows = 5,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">
              <Skeleton className="w-32 h-4" />
            </TableHead>
            <TableHead>
              <Skeleton className="w-24 h-4" />
            </TableHead>
            <TableHead>
              <Skeleton className="w-28 h-4" />
            </TableHead>
            <TableHead>
              <Skeleton className="w-32 h-4" />
            </TableHead>
            <TableHead>
              <Skeleton className="w-20 h-4" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="space-y-1">
                  <Skeleton className="w-48 h-5" />
                  <Skeleton className="w-32 h-4" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="w-36 h-5" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-28 h-5" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-24 h-5" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-20 h-8 rounded-sm" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
