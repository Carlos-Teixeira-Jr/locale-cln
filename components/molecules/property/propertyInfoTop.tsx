import {
  IMetadata,
} from '../../../common/interfaces/property/propertyData';
import { monetaryFormat } from '../../../common/utils/masks/monetaryFormat';
import { capitalizeFirstLetter } from '../../../common/utils/strings/capitalizeFirstLetter';
import AreaIcon from '../../atoms/icons/areaIcon';
import BathroomIcon from '../../atoms/icons/bathroomIcon';
import BedroomIcon from '../../atoms/icons/bedroomIcon';
import ParkingIcon from '../../atoms/icons/parkingIcon';
import PropertyDetails from '../../atoms/propertyDetails/propertyDetails';

const PropertyInfoTop = ({ propertyID }: any) => {
  const formattedPrice = monetaryFormat(propertyID.prices[0].value);
  const getSections = (
    areaValue: any,
    numBedrooms: IMetadata,
    numBathrooms: IMetadata,
    numGarage: any
  ) => [
    {
      icon: <AreaIcon />,
      value: propertyID?.size?.totalArea,
      description: 'm² area',
    },
    {
      icon: <BedroomIcon />,
      value: numBedrooms?.amount,
      description: 'quarto',
    },
    {
      icon: <BathroomIcon />,
      value: numBathrooms?.amount,
      description: 'banheiro',
    },
    {
      icon: <ParkingIcon />,
      value: numGarage?.amount,
      description: 'garagem',
    },
  ];

  const iptuValue: [] = propertyID.prices[2].value;

  return (
    <div className="m-5 lg:mx-auto md:w-2/3">
      <div className="md:m-5 lg:mx-auto">
        <div className="lg:w-fit font-normal text-xs md:text-sm text-quaternary mb-2 md:mb-0">
          <div className="grid grid-flow-col justify-start">
            <p className="mr-2">
              {' '}
              {`${capitalizeFirstLetter(propertyID.adType)} >`}
            </p>
            <p className="mr-2">
              {`${capitalizeFirstLetter(propertyID.address.city)} >`}
              {''}
            </p>
            <p className="">{`${capitalizeFirstLetter(
              propertyID.address.neighborhood
            )} `}</p>
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="md:text-3xl font-bold text-quaternary mt-2 md:mb-12 lg:mb-0">
            {propertyID.propertyType},{' '}
            {capitalizeFirstLetter(propertyID.address.streetName)},{' '}
            {capitalizeFirstLetter(propertyID.address.streetNumber)} -{' '}
            {capitalizeFirstLetter(propertyID.address.neighborhood)}
          </h3>
          <h1 className="lg:text-6xl mt-2 md:mt-5 text-4xl font-extrabold text-quaternary">
            {formattedPrice}
          </h1>
          {iptuValue && (
            <div className="flex lg:text-xl mt-2 md:mt-5 text-4xl font-extrabold text-quaternary">
              <h5>IPTU: </h5>
              <p className='lg:text-xl mx-5 text-4xl font-normal text-quaternary'>R${iptuValue}</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row items-end text-quaternary font-semibold lg:text-2xl justify-between mt-2 md:mt-0">
        {getSections(
          propertyID.size.totalArea,
          propertyID.metadata.find(
            (item: IMetadata) => item.type === 'bedroom'
          ),
          propertyID.metadata.find(
            (item: IMetadata) => item.type === 'bedroom'
          ),
          propertyID.metadata.find((item: IMetadata) => item.type === 'garage')
        ).map((section, key) => {
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
