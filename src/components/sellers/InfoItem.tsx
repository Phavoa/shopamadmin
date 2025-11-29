import React from "react";

interface InfoItemProps {
  text: React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ text }) => {
  return (
    <div className="flex items-start">
      <span className="text-gray-900 mr-2 mt-0.5 text-base md:text-base leading-relaxed">
        •
      </span>
      <span className="text-gray-700 text-sm md:text-base leading-relaxed flex-1">
        {text}
      </span>
    </div>
  );
};

export default InfoItem;
