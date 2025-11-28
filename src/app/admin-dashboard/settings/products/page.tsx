"use client";

/**
 * Categories Management Page with File Upload
 *
 * IMPORTANT: File Upload Process (Sequential)
 * 1. User selects file → Stored in selectedFile state
 * 2. User clicks "Add Category" → handleCreateCategory() is called
 * 3. STEP 1: File is uploaded to server via filesApi.uploadFile()
 * 4. STEP 2: Category is created with the returned image URL
 *
 * The file MUST be uploaded BEFORE creating the category to ensure
 * the category has a valid image URL from the database.
 */

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setHeaderTitle } from "@/features/shared/headerSice";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  type Category,
} from "../../../../api/categoriesApi";
import { useUploadFileMutation } from "../../../../api/filesApi";

// Components
import { CategoryPageHeader } from "@/components/categories/CategoryPageHeader";
import { CategoryTable } from "@/components/categories/CategoryTable";
import { AddCategoryModal } from "@/components/categories/AddCategoryModal";
import { EditCategoryModal } from "@/components/categories/EditCategoryModal";
import { DeleteCategoryModal } from "@/components/categories/DeleteCategoryModal";
import { CategoriesPageSkeleton } from "@/components/categories/CategoriesPageSkeleton";
import { ErrorState } from "@/components/categories/ErrorState";
import { EmptyState } from "@/components/categories/EmptyState";
import { PageWrapper } from "@/components/shared/AnimatedWrapper";

export default function ProductCategoriesPage() {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categoryName, setCategoryName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null!);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setHeaderTitle("Product Categories"));
  }, [dispatch]);

  // API hooks
  const {
    data: categoriesData,
    isLoading,
    error,
    refetch,
  } = useGetCategoriesQuery({
    limit: 100,
    sortBy: "name",
    sortDir: "asc",
  });

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const categories = categoriesData?.data?.items || [];

  // Event handlers
  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setSelectedFile(null);
    setPreviewUrl(category.image || null);
    setUploadedImageUrl(category.image || null); // Use existing image as uploaded URL
    setShowEditModal(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleAdd = () => {
    setCategoryName("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadedImageUrl(null);
    setShowAddModal(true);
  };

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      return;
    }

    try {
      // Use the already uploaded image URL
      console.log(
        "🏷️  Creating category with image:",
        uploadedImageUrl || "No image"
      );

      await createCategory({
        name: categoryName.trim(),
        image: uploadedImageUrl || undefined,
      }).unwrap();

      console.log("✅ Category created successfully!");

      setShowAddModal(false);
      setCategoryName("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadedImageUrl(null);
      refetch();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } })?.data?.message
          : "Failed to create category";
      console.error("Create category error:", error);
      alert(errorMessage);
    }
  };

  const handleUpdateCategory = async () => {
    if (!categoryName.trim()) {
      return;
    }

    if (!selectedCategory) return;

    try {
      // Use the already uploaded image URL
      console.log(
        "🏷️  Updating category with image:",
        uploadedImageUrl || "No image"
      );

      await updateCategory({
        idOrSlug: selectedCategory.id,
        data: {
          name: categoryName.trim(),
          image: uploadedImageUrl || undefined,
        },
      }).unwrap();
      console.log("✅ Category updated successfully!");

      setShowEditModal(false);
      setSelectedCategory(null);
      setCategoryName("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadedImageUrl(null);
      refetch();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } })?.data?.message
          : "Failed to update category";
      console.error("Update category error:", error);
      alert(errorMessage);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategory({ idOrSlug: selectedCategory.id }).unwrap();
      setShowDeleteModal(false);
      setSelectedCategory(null);
      refetch();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } })?.data?.message
          : "Failed to delete category";
      console.error("Delete category error:", error);
      alert(errorMessage);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
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
    setUploadedImageUrl(url);
    console.log("✅ Upload success:", url);
  };

  const handleUploadError = (error: string) => {
    console.error("Upload error:", error);
    alert(`Image upload failed: ${error}`);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedCategory(null);
    setCategoryName("");
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setUploadedImageUrl(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <PageWrapper>
        <CategoriesPageSkeleton />
      </PageWrapper>
    );
  }

  // Error state
  if (error) {
    return (
      <PageWrapper>
        <ErrorState onRetry={refetch} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen ">
        <CategoryPageHeader
          onAdd={handleAdd}
          onBack={() => router.push("/admin-dashboard/settings")}
        />

        <div className="p-6">
          {categories.length === 0 ? (
            <EmptyState onCreateFirst={handleAdd} />
          ) : (
            <CategoryTable
              categories={categories}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>

        <AddCategoryModal
          isOpen={showAddModal}
          categoryName={categoryName}
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          uploadedImageUrl={uploadedImageUrl}
          isCreating={isCreating}
          fileInputRef={fileInputRef}
          onClose={closeModals}
          onCategoryNameChange={setCategoryName}
          onFileSelect={handleFileSelect}
          onRemoveFile={removeSelectedFile}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          onSubmit={handleCreateCategory}
        />

        <EditCategoryModal
          isOpen={showEditModal}
          category={selectedCategory}
          categoryName={categoryName}
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          uploadedImageUrl={uploadedImageUrl}
          isUpdating={isUpdating}
          fileInputRef={fileInputRef}
          onClose={closeModals}
          onCategoryNameChange={setCategoryName}
          onFileSelect={handleFileSelect}
          onRemoveFile={removeSelectedFile}
          onRemoveCurrentImage={removeCurrentImage}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          onSubmit={handleUpdateCategory}
        />

        <DeleteCategoryModal
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
