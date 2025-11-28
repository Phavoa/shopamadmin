"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import {
  useCreateAdminMutation,
  useGetAdminsQuery,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
  type Admin,
  type CreateAdminRequest,
  type UpdateAdminRequest,
  type ListAdminsParams,
} from "@/api/adminApi";
import {
  AdminPageHeader,
  AdminTable,
  AdminTableSkeleton,
  AdminForm,
  AdminLoadingState,
  AdminErrorState,
  AdminEmptyState,
} from "@/components/admin";
import { PageWrapper } from "@/components/shared/AnimatedWrapper";
import { useDispatch } from "react-redux";
import { setHeaderTitle } from "@/features/shared/headerSice";

// Define proper types for role permissions with Hub Admin
type AdminRole = "ADMIN" | "HUB_ADMIN" | "SUPER_ADMIN";

export default function AdminManagementPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<AdminRole>("ADMIN");
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<AdminRole>("ADMIN");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setHeaderTitle("Admin Management"));
  }, [dispatch]);

  // Query parameters
  const [queryParams, setQueryParams] = useState<ListAdminsParams>({
    limit: 50,
    sortBy: "createdAt",
    sortDir: "desc",
  });

  // API hooks
  const {
    data: adminsData,
    isLoading,
    error,
    refetch,
  } = useGetAdminsQuery(queryParams);
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();

  const admins = adminsData?.data?.items || [];

  // Reset form function
  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setSelectedRole("ADMIN");
  };

  // Reset edit form function
  const resetEditForm = () => {
    setEditFirstName("");
    setEditLastName("");
    setEditEmail("");
    setEditRole("ADMIN");
  };

  // Handle add admin
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const adminData: CreateAdminRequest = {
        firstName,
        lastName,
        email,
        role: selectedRole,
      };

      await createAdmin(adminData).unwrap();
      resetForm();
      setShowAddModal(false);
      refetch();
    } catch (error) {
      console.error("Failed to create admin:", error);
      // You could add a toast notification here
    }
  };

  // Handle edit admin
  const handleEditAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setEditFirstName(admin.firstName);
    setEditLastName(admin.lastName);
    setEditEmail(admin.email);
    setEditRole(admin.role);
    setShowEditModal(true);
  };

  // Handle update admin
  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    try {
      const updateData: UpdateAdminRequest = {
        firstName: editFirstName,
        lastName: editLastName,
        email: editEmail,
        role: editRole,
      };

      await updateAdmin({ id: selectedAdmin.id, data: updateData }).unwrap();
      resetEditForm();
      setShowEditModal(false);
      setSelectedAdmin(null);
      refetch();
    } catch (error) {
      console.error("Failed to update admin:", error);
      // You could add a toast notification here
    }
  };

  // Handle delete admin
  const handleDeleteAdmin = async (admin: Admin) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${admin.firstName} ${admin.lastName}?`
      )
    ) {
      try {
        await deleteAdmin(admin.id).unwrap();
        refetch();
      } catch (error) {
        console.error("Failed to delete admin:", error);
        // You could add a toast notification here
      }
    }
  };

  // Handle add button click
  const handleAddClick = () => {
    resetForm();
    setShowAddModal(true);
  };

  // Show error state
  if (error) {
    return <AdminErrorState onRetry={refetch} />;
  }

  return (
    <PageWrapper className="min-h-screen">
      {/* Content */}
      <div className="px-6 py-8">
        <AdminPageHeader isCreating={isCreating} onAddClick={handleAddClick} />

        {/* Admin Users Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            padding: "24px",
            borderRadius: "18px",
            border: "0.3px solid rgba(0, 0, 0, 0.20)",
            background: "#FFF",
          }}
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-black mb-1">
              Admin Users
            </h2>
            <p className="text-sm text-gray-600">
              Manage admin access and permissions
            </p>
          </div>

          {/* Table or Skeleton */}
          {isLoading ? (
            <AdminTableSkeleton rowsCount={5} />
          ) : (
            <>
              {/* Table */}
              <AdminTable
                admins={admins}
                onEdit={handleEditAdmin}
                onDelete={handleDeleteAdmin}
                isDeleting={isDeleting}
              />

              {admins.length === 0 && <AdminEmptyState />}
            </>
          )}
        </motion.div>
      </div>

      {/* Add New Admin Modal */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-[3px] flex items-center justify-center z-50"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            style={{
              width: "500px",
              padding: "24px",
              borderRadius: "18px",
              background: "#FFF",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-black">
                Add New Admin
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <AdminForm
              mode="add"
              firstName={firstName}
              lastName={lastName}
              email={email}
              role={selectedRole}
              onFirstNameChange={setFirstName}
              onLastNameChange={setLastName}
              onEmailChange={setEmail}
              onRoleChange={setSelectedRole}
              onSubmit={handleAddAdmin}
              isLoading={isCreating}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && selectedAdmin && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-[3px] flex items-center justify-center z-50"
          onClick={() => setShowEditModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            style={{
              width: "500px",
              padding: "24px",
              borderRadius: "18px",
              background: "#FFF",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-black">Edit Admin</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <AdminForm
              mode="edit"
              firstName={editFirstName}
              lastName={editLastName}
              email={editEmail}
              role={editRole}
              onFirstNameChange={setEditFirstName}
              onLastNameChange={setEditLastName}
              onEmailChange={setEditEmail}
              onRoleChange={setEditRole}
              onSubmit={handleUpdateAdmin}
              isLoading={isUpdating}
            />
          </motion.div>
        </motion.div>
      )}
    </PageWrapper>
  );
}
