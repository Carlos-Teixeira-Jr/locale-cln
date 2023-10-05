interface IDetails {
  icon: any;
  value: number | any;
  description: string;
}

const PropertyDetails = ({ icon, value, description }: IDetails) => {
  return (
    <div className="flex flex-row items-end text-quaternary font-semibold lg:text-2xl lg:pt-5 justify-between">
      <div className="flex flex-col md:flex-row md:mr-2 md:items-end items-center">
        <span className="text-[#6B7280]">{icon}</span>
        <p className="md:mr-2">
          {value} {value > 1 && description !== 'm² area' ? `${description}s` : description }
        </p>
      </div>
    </div>
  );
};

export default PropertyDetails;
