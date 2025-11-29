import React from "react";
import { User } from "@/types/auth";
import { AnimatedWrapper } from "@/components/shared/AnimatedWrapper";
import InfoItem from "./InfoItem";

interface SellerAddressSectionProps {
  user?: User | null;
}

const SellerAddressSection: React.FC<SellerAddressSectionProps> = ({
  user,
}) => {
  if (!user?.defaultAddress) {
    return null;
  }

  const { defaultAddress } = user;

  return (
    <AnimatedWrapper animation="fadeIn" delay={0.6}>
      <div className="px-5 md:px-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
          Default Address
        </h2>
        <div className="space-y-2.5">
          <InfoItem text={`Full Name: ${defaultAddress.fullName}`} />
          <InfoItem text={`Phone: ${defaultAddress.phone}`} />
          <InfoItem
            text={`Address: ${defaultAddress.line1}${
              defaultAddress.line2 ? ", " + defaultAddress.line2 : ""
            }`}
          />
          <InfoItem
            text={`City: ${defaultAddress.city}, State: ${defaultAddress.state}`}
          />
          <InfoItem
            text={`Country: ${defaultAddress.country} - ${defaultAddress.postalCode}`}
          />
          {defaultAddress.label && (
            <InfoItem text={`Label: ${defaultAddress.label}`} />
          )}
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default SellerAddressSection;
