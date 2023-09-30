import React, { useEffect, useMemo, useState } from "react"
import { IAddress } from "../../../common/interfaces/property/propertyData";

interface IChangeAddressCheckbox {
  onAddressCheckboxChange: (value: boolean) => void;
  address: IAddress
}

const ChangeAddressCheckbox: React.FC<IChangeAddressCheckbox> = ({
  onAddressCheckboxChange,
  address
}) => {

  const [isSameAddress, setIsSameAddress] = useState(true);

  const propertyAddress = {
    zipCode: address ? address.zipCode : '',
    city: address ? address.city : '',
    streetName: address ? address.streetName : '',
    streetNumber: address ? address.streetNumber : '',
    complement: address ? address.complement : '',
    neighborhood: address ? address.neighborhood : '',
    uf: address ? address.uf : '',
  };

  useEffect(() => {
    onAddressCheckboxChange(isSameAddress)
  }, [isSameAddress])

  return (
    <div>
      <h2 className="md:text-3xl text-2xl leading-10 text-quaternary font-bold md:mb-10">
        Endereço de cobrança
      </h2>
      <div className="lg:flex">
        <div className="flex lg:w-3/6 my-5 lg:my-0">
          <div
            className={` w-8 h-8 shrink-0 rounded-full bg-tertiary drop-shadow-lg mr-5 flex justify-center cursor-pointer ${
              isSameAddress
                ? 'border-[3px] border-secondary'
                : 'border border-quaternary'
            }`}
            onClick={() => setIsSameAddress(true)}
          >
            {isSameAddress && (
              <div className="bg-secondary w-4 h-4 rounded-full mt-1"></div>
            )}
          </div>
          <p className="text-xl font-normal text-quaternary leading-7">
            Usar o mesmo endereço do imóvel
          </p>
        </div>
        <div className="flex">
          <div
            className={`w-8 h-8 shrink-0 rounded-full bg-tertiary drop-shadow-lg mr-5 flex justify-center cursor-pointer ${
              !isSameAddress
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
              {`${propertyAddress?.streetName}, ${propertyAddress?.streetNumber}`}
            </p>
            <p className="text-xl font-normal text-quaternary leading-7">
              {propertyAddress?.neighborhood}
            </p>
            <p className="text-xl font-normal text-quaternary leading-7">
              {`${propertyAddress?.city} - ${propertyAddress?.uf}`}
            </p>
            <p className="text-xl font-normal text-quaternary leading-7">
              {`CEP - ${propertyAddress?.zipCode}`}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChangeAddressCheckbox