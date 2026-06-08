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
import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onReorder?: (categories: Category[]) => void;
  isReordering?: boolean;
}

interface SortableRowProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  handleCategoryClick: (category: Category) => void;
}

const SortableRow = ({
  category,
  onEdit,
  onDelete,
  handleCategoryClick,
}: SortableRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { position: "relative" as const, zIndex: 50, opacity: 0.8, backgroundColor: "var(--background)" } : {}),
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-[40px]">
        <button
          type="button"
          className="cursor-grab hover:bg-gray-100 p-1 rounded active:cursor-grabbing text-gray-400 hover:text-gray-600"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>
      </TableCell>
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
  );
};

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories: initialCategories,
  onEdit,
  onDelete,
  onReorder,
  isReordering,
}) => {
  const router = useRouter();
  const [items, setItems] = useState<Category[]>(initialCategories);

  // Sync internal state if external props change
  useEffect(() => {
    setItems(initialCategories);
  }, [initialCategories]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        
        if (onReorder) {
          onReorder(newItems);
        }
        
        return newItems;
      });
    }
  };

  const handleCategoryClick = (category: Category) => {
    const params = new URLSearchParams({
      categoryId: category.id,
      categoryName: category.name,
    });
    router.push(`/admin-dashboard/settings/products/delete-products?${params}`);
  };

  return (
    <div className={isReordering ? "opacity-70 pointer-events-none transition-opacity" : ""}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Category Image</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SortableContext
              items={items.map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((category) => (
                <SortableRow
                  key={category.id}
                  category={category}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  handleCategoryClick={handleCategoryClick}
                />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );
};
