"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminUpdateUserMutation } from "@/api/userApi";
import { useGetZonesQuery } from "@/api/deliveryApi";
import { useUploadFileMutation } from "@/api/filesApi";
import { toast } from "react-hot-toast";

interface EditUserModalProps {
  isOpen: boolean;
  userId: string;
  currentUserData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    imageUrl?: string | null;
    defaultAddress?: {
      id?: string;
      label?: string;
      fullName?: string;
      phone?: string;
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
      deliveryZoneId?: string;
    } | null;
  } | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  userId,
  currentUserData,
  onOpenChange,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<"profile" | "address">("profile");

  // Profile fields state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Address fields state
  const [addressLabel, setAddressLabel] = useState("");
  const [addressFullName, setAddressFullName] = useState("");
  const [addressPhone, setAddressPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressCountry, setAddressCountry] = useState("NG");
  const [addressPostalCode, setAddressPostalCode] = useState("");
  const [addressDeliveryZoneId, setAddressDeliveryZoneId] = useState("");

  const [adminUpdateUser, { isLoading: isSaving }] = useAdminUpdateUserMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const { data: zonesResponse } = useGetZonesQuery({ limit: 100 });
  const deliveryZones = zonesResponse?.data?.items || [];
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form fields on open
  useEffect(() => {
    if (isOpen && currentUserData) {
      setFirstName(currentUserData.firstName || "");
      setLastName(currentUserData.lastName || "");
      setPhone(currentUserData.phone || "");
      setImageUrl(currentUserData.imageUrl || "");

      const addr = currentUserData.defaultAddress;
      setAddressLabel(addr?.label || "Home");
      setAddressFullName(addr?.fullName || `${currentUserData.firstName || ""} ${currentUserData.lastName || ""}`.trim());
      setAddressPhone(addr?.phone || currentUserData.phone || "");
      setAddressLine1(addr?.line1 || "");
      setAddressLine2(addr?.line2 || "");
      setAddressCity(addr?.city || "");
      setAddressState(addr?.state || "");
      setAddressCountry(addr?.country && addr.country.trim().length <= 2 ? addr.country.trim() : "NG");
      setAddressPostalCode(addr?.postalCode || "");
      setAddressDeliveryZoneId(addr?.deliveryZoneId || "");
    }
  }, [isOpen, currentUserData]);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    try {
      const uploadPromise = uploadFile({ file, prefix: "profiles" }).unwrap();
      await toast.promise(uploadPromise, {
        loading: "Uploading profile image...",
        success: "Image uploaded successfully!",
        error: "Failed to upload image",
      });
      const res = await uploadPromise;
      if (res.data?.url) {
        setImageUrl(res.data.url);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!lastName.trim()) {
      toast.error("Last name is required");
      return;
    }

    try {
      const payload: any = {
        firstName,
        lastName,
        phone: phone || undefined,
        imageUrl: imageUrl || undefined,
      };

      // If at least address line 1 is filled, update the address
      if (addressLine1.trim()) {
        payload.address = {
          id: currentUserData?.defaultAddress?.id,
          label: addressLabel || "Home",
          fullName: addressFullName || `${firstName} ${lastName}`,
          phone: addressPhone || phone,
          line1: addressLine1,
          line2: addressLine2 || undefined,
          city: addressCity,
          state: addressState,
          country: (addressCountry || "NG").trim().slice(0, 2).toUpperCase(),
          postalCode: addressPostalCode,
          deliveryZoneId: addressDeliveryZoneId || undefined,
        };
      }

      await adminUpdateUser({ userId, data: payload }).unwrap();
      toast.success("User details updated successfully!");
      onSuccess?.();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to update user details");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-white rounded-2xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Edit User Details
          </DialogTitle>
        </DialogHeader>

        {/* Custom tabs */}
        <div className="flex border-b border-gray-100 px-6">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-all ${
              activeTab === "profile"
                ? "border-orange-500 text-orange-600 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Profile Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("address")}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-all ${
              activeTab === "address"
                ? "border-orange-500 text-orange-600 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Default Address
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            {activeTab === "profile" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="firstName" className="text-xs font-semibold text-gray-600">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g., Kehinde"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName" className="text-xs font-semibold text-gray-600">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g., Peter"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-xs font-semibold text-gray-600">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g., +2348109987754"
                  />
                </div>

                <div className="flex items-center gap-4 py-2">
                  <div className="relative cursor-pointer select-none shrink-0" onClick={triggerFileSelect}>
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 hover:border-orange-500 overflow-hidden bg-gray-50 flex items-center justify-center relative transition-all">
                      {imageUrl ? (
                        <img src={imageUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 font-bold text-sm uppercase">
                          {firstName?.[0] || ""}{lastName?.[0] || ""}
                        </span>
                      )}
                      
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-[10px] text-white font-semibold">Uploading...</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white rounded-full p-1 border border-white hover:bg-orange-600 transition-colors shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs font-semibold text-gray-600">Profile Image</Label>
                    <div className="flex gap-2">
                      <Input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Image URL or upload a file"
                        className="text-xs h-9"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        disabled={isUploading}
                        onClick={triggerFileSelect}
                        className="h-9 px-3 text-xs shrink-0"
                      >
                        Upload Image
                      </Button>
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {activeTab === "address" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="addressLabel" className="text-xs font-semibold text-gray-600">
                      Label (e.g. Home, Work)
                    </Label>
                    <Input
                      id="addressLabel"
                      value={addressLabel}
                      onChange={(e) => setAddressLabel(e.target.value)}
                      placeholder="e.g., Home"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="addressFullName" className="text-xs font-semibold text-gray-600">
                      Receiver's Full Name
                    </Label>
                    <Input
                      id="addressFullName"
                      value={addressFullName}
                      onChange={(e) => setAddressFullName(e.target.value)}
                      placeholder="e.g., Kehinde Peter"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="addressPhone" className="text-xs font-semibold text-gray-600">
                      Receiver's Phone Number
                    </Label>
                    <Input
                      id="addressPhone"
                      value={addressPhone}
                      onChange={(e) => setAddressPhone(e.target.value)}
                      placeholder="e.g., +2348109987754"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="addressPostalCode" className="text-xs font-semibold text-gray-600">
                      Postal Code
                    </Label>
                    <Input
                      id="addressPostalCode"
                      value={addressPostalCode}
                      onChange={(e) => setAddressPostalCode(e.target.value)}
                      placeholder="e.g., 100001"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="addressLine1" className="text-xs font-semibold text-gray-600">
                    Address Line 1 *
                  </Label>
                  <Input
                    id="addressLine1"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="e.g., Abc Street No 8 close"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="addressLine2" className="text-xs font-semibold text-gray-600">
                    Address Line 2 (Optional)
                  </Label>
                  <Input
                    id="addressLine2"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="e.g., Suite 2B"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1 col-span-1">
                    <Label htmlFor="addressCity" className="text-xs font-semibold text-gray-600">
                      City
                    </Label>
                    <Input
                      id="addressCity"
                      value={addressCity}
                      onChange={(e) => setAddressCity(e.target.value)}
                      placeholder="e.g., Lagos"
                    />
                  </div>
                  <div className="space-y-1 col-span-1">
                    <Label htmlFor="addressState" className="text-xs font-semibold text-gray-600">
                      State
                    </Label>
                    <Input
                      id="addressState"
                      value={addressState}
                      onChange={(e) => setAddressState(e.target.value)}
                      placeholder="e.g., Lagos"
                    />
                  </div>
                  <div className="space-y-1 col-span-1">
                    <Label htmlFor="addressCountry" className="text-xs font-semibold text-gray-600">
                      Country
                    </Label>
                    <Input
                      id="addressCountry"
                      value={addressCountry}
                      onChange={(e) => setAddressCountry(e.target.value)}
                      placeholder="e.g., NG"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-gray-600 block">
                    Delivery Zone
                  </Label>
                  <Select
                    value={addressDeliveryZoneId}
                    onValueChange={setAddressDeliveryZoneId}
                  >
                    <SelectTrigger className="w-full border-gray-200 rounded-lg">
                      <SelectValue placeholder="Select delivery zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {deliveryZones.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id}>
                          {zone.name} ({zone.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
