"use client";

/**
 * Livestream Categories Management Page
 *
 * Full CRUD for livestream categories. Mirrors the Product Categories page
 * but uses the /api/streams/categories endpoint family.
 */

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setHeaderTitle } from "@/features/shared/headerSice";
import {
  useGetLivestreamCategoriesQuery,
  useCreateLivestreamCategoryMutation,
  useUpdateLivestreamCategoryMutation,
  useDeleteLivestreamCategoryMutation,
  type LivestreamCategory,
} from "@/api/livestreamCategoriesApi";

import {
  LivestreamCategoryPageHeader,
  LivestreamCategoryTable,
  AddLivestreamCategoryModal,
  EditLivestreamCategoryModal,
  DeleteLivestreamCategoryModal,
  LivestreamCategoriesPageSkeleton,
} from "@/components/livestream-categories";
import { PageWrapper } from "@/components/shared/AnimatedWrapper";

// ─── Reuse existing simple states from product categories ──────────────────

const EmptyState: React.FC<{ onCreateFirst: () => void }> = ({
  onCreateFirst,
}) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4">
      <svg
        className="w-8 h-8 text-[#E67E22]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m5 0H2m2 0v16a2 2 0 002 2h12a2 2 0 002-2V4"
        />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      No livestream categories yet
    </h3>
    <p className="text-sm text-gray-500 mb-6 max-w-sm">
      Create your first livestream category to start organising your streams.
    </p>
    <button
      onClick={onCreateFirst}
      className="px-5 py-2 rounded-sm bg-[#E67E22] text-white text-sm font-medium border-none cursor-pointer hover:bg-orange-600 transition-colors"
    >
      Create First Category
    </button>
  </div>
);

const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <p className="text-red-600 font-medium mb-4">
      Failed to load livestream categories.
    </p>
    <button
      onClick={onRetry}
      className="px-5 py-2 rounded-sm bg-[#E67E22] text-white text-sm font-medium hover:bg-orange-600 transition-colors"
    >
      Retry
    </button>
  </div>
);

// ─── Page ──────────────────────────────────────────────────────────────────

export default function LivestreamCategoriesPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  // ─── Local state ──────────────────────────────────────────────────────────
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<LivestreamCategory | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    dispatch(setHeaderTitle("Livestream Categories"));
  }, [dispatch]);

  // ─── API hooks ────────────────────────────────────────────────────────────
  const {
    data: categoriesData,
    isLoading,
    error,
    refetch,
  } = useGetLivestreamCategoriesQuery({
    limit: 50,
    sortBy: "name",
    sortDir: "asc",
  });

  const [createCategory, { isLoading: isCreating }] =
    useCreateLivestreamCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateLivestreamCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteLivestreamCategoryMutation();

  // Normalise data — backend may return one of:
  //   { data: [...] }                  ← spec
  //   { data: { items: [...] } }       ← common pattern in this codebase
  //   { data: { data: [...] } }        ← occasional double-wrap
  const rawData = categoriesData?.data;
  // eslint-disable-next-line no-console
  console.log("[LivestreamCategories] raw API response:", categoriesData);

  const categories: LivestreamCategory[] = (() => {
    if (!rawData) return [];
    if (Array.isArray(rawData)) return rawData as LivestreamCategory[];
    const nested = rawData as any;
    if (Array.isArray(nested.items))
      return nested.items as LivestreamCategory[];
    if (Array.isArray(nested.data)) return nested.data as LivestreamCategory[];
    return [];
  })();

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleAdd = () => {
    setCategoryName("");
    setCategoryDescription("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadedImageUrl(null);
    setShowAddModal(true);
  };

  const handleEdit = (category: LivestreamCategory) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description || "");
    setSelectedFile(null);
    setPreviewUrl(category.image || null);
    setUploadedImageUrl(category.image || null);
    setShowEditModal(true);
  };

  const handleDelete = (category: LivestreamCategory) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) return;

    try {
      await createCategory({
        name: categoryName.trim(),
        description: categoryDescription.trim() || undefined,
        image: uploadedImageUrl || undefined,
      }).unwrap();

      closeModals();
      refetch();
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } })?.data?.message
          : "Failed to create category";
      alert(errorMessage);
    }
  };

  const handleUpdateCategory = async () => {
    if (!categoryName.trim() || !selectedCategory) return;

    try {
      await updateCategory({
        idOrSlug: selectedCategory.id,
        data: {
          name: categoryName.trim(),
          description: categoryDescription.trim() || undefined,
          image: uploadedImageUrl || undefined,
        },
      }).unwrap();

      closeModals();
      refetch();
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } })?.data?.message
          : "Failed to update category";
      alert(errorMessage);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategory(selectedCategory.id).unwrap();
      closeModals();
      refetch();
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } })?.data?.message
          : "Failed to delete category";
      // This is shown inline (e.g., "Category is used in a livestream")
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setUploadedImageUrl(null);
  };

  const removeCurrentImage = () => {
    setPreviewUrl(null);
    setUploadedImageUrl(null);
  };

  const handleUploadSuccess = (url: string) => {
    // '__REMOVED__' is the sentinel emitted by FileUpload when the user removes the image
    setUploadedImageUrl(url === "__REMOVED__" ? null : url || null);
  };

  const handleUploadError = (err: string) => {
    alert(`Image upload failed: ${err}`);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedCategory(null);
    setCategoryName("");
    setCategoryDescription("");
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setUploadedImageUrl(null);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <PageWrapper>
        <LivestreamCategoriesPageSkeleton />
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <ErrorState onRetry={refetch} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen">
        <LivestreamCategoryPageHeader
          onAdd={handleAdd}
          onBack={() => router.push("/admin-dashboard/settings/products")}
        />

        <div className="p-6">
          {categories.length === 0 ? (
            <EmptyState onCreateFirst={handleAdd} />
          ) : (
            <LivestreamCategoryTable
              categories={categories}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>

        <AddLivestreamCategoryModal
          isOpen={showAddModal}
          categoryName={categoryName}
          categoryDescription={categoryDescription}
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          uploadedImageUrl={uploadedImageUrl}
          isCreating={isCreating}
          fileInputRef={fileInputRef}
          onClose={closeModals}
          onCategoryNameChange={setCategoryName}
          onCategoryDescriptionChange={setCategoryDescription}
          onFileSelect={handleFileSelect}
          onRemoveFile={removeSelectedFile}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          onSubmit={handleCreateCategory}
        />

        <EditLivestreamCategoryModal
          isOpen={showEditModal}
          category={selectedCategory}
          categoryName={categoryName}
          categoryDescription={categoryDescription}
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          uploadedImageUrl={uploadedImageUrl}
          isUpdating={isUpdating}
          fileInputRef={fileInputRef}
          onClose={closeModals}
          onCategoryNameChange={setCategoryName}
          onCategoryDescriptionChange={setCategoryDescription}
          onFileSelect={handleFileSelect}
          onRemoveFile={removeSelectedFile}
          onRemoveCurrentImage={removeCurrentImage}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          onSubmit={handleUpdateCategory}
        />

        <DeleteLivestreamCategoryModal
          isOpen={showDeleteModal}
          category={selectedCategory}
          isDeleting={isDeleting}
          onClose={closeModals}
          onConfirmDelete={handleDeleteCategory}
        />
      </div>
    </PageWrapper>
  );
}
