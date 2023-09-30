import {
  IMetadata,
  IPrices,
  ISize,
  propType,
} from '../../../common/interfaces/propertyData';
import AreaIcon from '../../atoms/icons/areaIcon';
import BathroomIcon from '../../atoms/icons/bathroomIcon';
import BedroomIcon from '../../atoms/icons/bedroomIcon';
import ParkingIcon from '../../atoms/icons/parkingIcon';
import PropertyDetails from '../../atoms/propertyDetails/propertyDetails';

interface IInfoTop {
  propertyID: {
    numBedrooms: IMetadata;
    numBathrooms: IMetadata;
    numGarage: IMetadata;
    areaValue: ISize;
    propertyType: propType;
    streetName: string;
    streetNumber: number;
    neighborhood: string;
    price: IPrices;
  };
}

const PropertyInfoTop: React.FC<IInfoTop> = ({ propertyID }: any) => {
  return (
    <div className="md:m-5 lg:mx-auto">
      <div className="md:m-5 lg:mx-auto">
        <div className="lg:w-fit font-normal text-sm leading-5 text-quaternary">
          <div className="grid grid-flow-col justify-start">
            <p className="mr-2">Venda</p>
            <p className="mr-2">Estado </p>
            <p className="mr-2">Cidade </p>
            <p className="">Localidade </p>
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="lg:w-[841px] md:h-[48px] md:text-[40px] font-bold text-quaternary leading-[48px] md:mb-[52px] lg:mb-0">
            {propertyID.propertyType}, {propertyID.address.streetName},{' '}
            {propertyID.address.streetNumber} -{' '}
            {propertyID.address.neighborhood}
          </h3>
          <h1 className="lg:w-[442px] md:h-[77px] lg:text-[64px] mt-5 text-4xl font-extrabold text-quaternary lg:leading-[77px] my-3 lg:my-0">{`R$ ${propertyID.prices[0].value}`}</h1>
        </div>
      </div>
      <div className="flex flex-row items-end text-quaternary font-semibold lg:text-2xl lg:pt-[45px] justify-between">
        {getSections(
          propertyID.size.area,
          propertyID.metadata[2],
          propertyID.metadata[0],
          propertyID.metadata[1]
        ).map((section, key) => {
          console.log(section);
          return (
            <PropertyDetails
              key={key}
              icon={section.icon}
              description={section.description}
              value={section.value}
            />
          );
        })}
      </div>
    </div>
  );
};
export default PropertyInfoTop;

export const getSections = (
  areaValue: ISize,
  numBedrooms: IMetadata,
  numBathrooms: IMetadata,
  numGarage: IMetadata
) => [
  {
    icon: AreaIcon,
    value: areaValue,
    description: 'm² area',
  },
  {
    icon: BedroomIcon,
    value: numBedrooms.amount,
    description: 'quarto(s)',
  },
  {
    icon: BathroomIcon,
    value: numBathrooms.amount,
    description: 'banheiro(s)',
  },
  {
    icon: ParkingIcon,
    value: numGarage.amount,
    description: 'garagem',
  },
];
