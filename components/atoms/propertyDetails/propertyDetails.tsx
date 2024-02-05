import { ReactNode } from "react";

interface IDetails {
  icon: ReactNode;
  value: any;
  description: string;
}

const PropertyDetails = ({ icon, value, description }: IDetails) => {
  return (
    <div className="flex flex-row items-end text-quaternary font-semibold lg:text-xl lg:pt-5 justify-between">
      <div className="flex flex-col md:flex-row md:mr-2 md:items-end items-center">
        <span className="text-[#6B7280] mr-2">{icon}</span>
        <p className="md:mr-2 flex">
          {value} {value > 1 && description !== 'm² area' ? `${description}s` : description }
        </p>
      </div>
    </div>
  );
};

export default PropertyDetails;
