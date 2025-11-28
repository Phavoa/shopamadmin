"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  useGetProductsQuery,
  type Product,
} from "../../../../../api/productsApi";
import { Button } from "../../../../../components/ui/button";
import { useDispatch } from "react-redux";
import { setHeaderTitle } from "@/features/shared/headerSice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductsTableSkeleton } from "@/components/products/ProductsTableSkeleton";
import { PageWrapper } from "@/components/shared/AnimatedWrapper";

export default function DeleteProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setHeaderTitle("Delete Products"));
  }, [dispatch]);

  // Get category filter from URL parameters
  const categoryId = searchParams.get("categoryId");
  const categoryName = searchParams.get("categoryName");

  // API call to fetch products - always fetch all first, then filter client-side if needed
  const {
    data: productsData,
    isLoading,
    error,
    refetch,
  } = useGetProductsQuery({
    limit: 100,
    populate: ["images, categories.category, seller.user"],
    // Remove category filter for now to see if products exist at all
    // ...(categoryId && { categoryId }),
  });

  console.log("API Response:", { productsData, isLoading, error });

  const allProducts = productsData?.data?.items || [];
  console.log("All products:", allProducts);

  // Client-side filtering if category filter is provided
  const products = categoryId
    ? allProducts.filter(
        (product: Product) =>
          product.categoryIds?.includes(categoryId) ||
          product.categories?.some((cat) => cat.id === categoryId)
      )
    : allProducts;
  console.log("Filtered products:", products);

  // Filter products based on search query
  const filteredProducts = products.filter((product: Product) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      product.title.toLowerCase().includes(searchLower) ||
      product.slug.toLowerCase().includes(searchLower) ||
      (product.sellerProfile?.shopName?.toLowerCase() || "").includes(
        searchLower
      ) ||
      (product.categories?.[0]?.name?.toLowerCase() || "").includes(
        searchLower
      );

    return matchesSearch;
  });

  const handleDelete = async (productId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      // Add delete logic here - API call
      console.log("Deleting product:", productId);
      // TODO: Implement actual delete API call
      alert("Product deletion functionality needs to be implemented");
      refetch();
    }
  };

  const handleBackClick = () => {
    router.push("/admin-dashboard/settings/products");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-white">
          {/* Back to Settings Button */}
          <div className="px-6 py-4">
            <Button
              onClick={handleBackClick}
              className="bg-gray-100 hover:bg-gray-200 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Button>
          </div>

          {/* Loading Skeleton */}
          <div className="p-6">
            <ProductsTableSkeleton rows={6} />
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading products</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-white">
        {/* Back to Settings Button */}
        <div className="px-6 py-4">
          <Button
            onClick={handleBackClick}
            className="bg-gray-100 hover:bg-gray-200 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Button>

          {/* {categoryName && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Showing products for category:{" "}
                <span className="font-medium text-gray-700">
                  {decodeURIComponent(categoryName)}
                </span>
              </p>
            </div>
          )} */}
        </div>

        {/* Products Table */}
        <div className="p-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                {categoryName
                  ? `No products found in ${decodeURIComponent(
                      categoryName
                    )} category`
                  : "No products found"}
              </p>
              {categoryName && (
                <Button onClick={handleBackClick}>Back to Categories</Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border-y">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Product Name</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product: Product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm text-black font-medium">
                            {product.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {product.slug}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-black">
                        {product.sellerProfile?.shopName || "Unknown Seller"}
                      </TableCell>
                      <TableCell className="text-sm text-black">
                        {product.categories?.[0]?.name || "Uncategorized"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(product.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleDelete(product.id)}
                          className="min-w-26 px-4 py-2 rounded-sm bg-[#EF4444] text-sm font-medium border border-red-200 cursor-pointer hover:bg-[#EF4444]/90 transition-colors"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Results Summary */}
          {filteredProducts.length > 0 && (
            <div className="mt-6 text-sm text-gray-600">
              Showing {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""}
              {categoryName &&
                ` in ${decodeURIComponent(categoryName)} category`}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
