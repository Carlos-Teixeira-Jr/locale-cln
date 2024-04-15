import React, { useEffect, useState } from 'react';
import { IAddress } from '../../../common/interfaces/property/propertyData';

interface IChangeAddressCheckbox {
  onAddressCheckboxChange: (value: boolean) => void;
  propertyAddress: any;
  userAddress: IAddress;
}

const ChangeAddressCheckbox: React.FC<IChangeAddressCheckbox> = ({
  onAddressCheckboxChange,
  propertyAddress,
  userAddress,
}) => {
  const [isSameAddress, setIsSameAddress] = useState(true);
  const [propAddress, setPropAddress] = useState(Object.keys(propertyAddress).some((k) => k === 'address') ? propertyAddress : propertyAddress?.storedData)

  const propertyAddressData = {
    // zipCode: isSameAddress
    //   ? propertyAddress?.address?.zipCode
    //   : userAddress?.zipCode,
    zipCode: '96215-180',
    city: isSameAddress ? propertyAddress?.address?.city : userAddress?.city,
    streetName: isSameAddress
      ? propertyAddress?.address?.streetName
      : userAddress?.streetName,
    // streetNumber: isSameAddress
    //   ? propertyAddress?.address?.streetNumber
    streetNumber: '123',
    //   : userAddress.streetNumber,
    complement: isSameAddress
      ? propertyAddress?.address?.complement
      : userAddress?.complement,
    neighborhood: isSameAddress
      ? propertyAddress?.address?.neighborhood
      : userAddress?.neighborhood,
    uf: isSameAddress ? propertyAddress?.address?.uf : userAddress?.uf,
  };

  useEffect(() => {
    onAddressCheckboxChange(isSameAddress);
  }, [isSameAddress]);

  return (
    <div className="mx-5">
      <h2 className="md:text-3xl text-2xl leading-10 text-quaternary font-bold md:mb-10">
        Endereço de cobrança
      </h2>
      <div className="lg:flex">
        <div className="flex lg:w-3/6 my-5 lg:my-0">
          <div
            className={` w-8 h-8 shrink-0 rounded-full bg-tertiary drop-shadow-lg mr-5 flex justify-center cursor-pointer ${isSameAddress
              ? 'border-[3px] border-secondary'
              : 'border border-quaternary'
              }`}
            onClick={() => setIsSameAddress(true)}
          >
            {isSameAddress && (
              <div className="bg-secondary w-4 h-4 rounded-full mt-[5px]"></div>
            )}
          </div>
          <p className="text-xl font-normal text-quaternary leading-7">
            Usar o mesmo endereço do imóvel
          </p>
        </div>
        <div className="flex">
          <div
            className={`w-8 h-8 shrink-0 rounded-full bg-tertiary drop-shadow-lg mr-5 flex justify-center cursor-pointer ${!isSameAddress
              ? 'border-[3px] border-secondary'
              : 'border border-quaternary'
              }`}
            onClick={() => setIsSameAddress(false)}
          >
            {!isSameAddress && (
              <div className="bg-secondary w-4 h-4 rounded-full mt-1"></div>
            )}
          </div>
          <p className="text-xl font-normal text-quaternary leading-7">
            Usar outro endereço
          </p>
        </div>
      </div>

      {isSameAddress && (
        <div className="my-5 lg:w-1/2">
          <div className="border border-quaternary bg-tertiary p-5">
            <p className="text-xl font-normal text-quaternary leading-7">
              {`${propertyAddressData?.streetName}, ${propertyAddressData?.streetNumber}`}
            </p>
            <p className="text-xl font-normal text-quaternary leading-7">
              {propertyAddressData?.neighborhood}
            </p>
            <p className="text-xl font-normal text-quaternary leading-7">
              {`${propertyAddressData?.city} - ${propertyAddressData?.uf}`}
            </p>
            <p className="text-xl font-normal text-quaternary leading-7">
              {`CEP - ${propertyAddressData?.zipCode}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeAddressCheckbox;
