import { useRouter } from 'next/router';
import React, { ChangeEvent, useRef, useState } from 'react';
import {
  ILocation,
  ILocationProp,
} from '../../../common/interfaces/locationDropdown';
import { IPropertyTypes } from '../../../common/interfaces/property/propertyTypes';
import { useOutsideClick } from '../../../common/utils/actions/clickOutside';
import { toggleLocation } from '../../../common/utils/actions/toggleLocations';
import { categorizeLocations } from '../../../common/utils/format/categorizedLocations';
import { lowerLetters } from '../../../common/utils/strings/capitalizeFirstLetter';
import {
  categoryMappings,
  categoryTranslations,
  translateLocations,
} from '../../../common/utils/translateLocations';
import propertyTypeSubtype from '../../../data/propertyTypeSubType.json';
import useTrackLocation from '../../../hooks/trackLocation';
import { useIsMobile } from '../../../hooks/useIsMobile';
import Button from '../../molecules/buttons/btn';
import BuyRentSelector from '../../molecules/switchers/buyRentSelector';
import ArrowDownIcon from '../icons/arrowDownIcon';
import CheckIcon from '../icons/checkIcon';

export interface IHomeFilter extends React.ComponentPropsWithoutRef<'div'> {
  isBuyProp: boolean;
  isRentProp: boolean;
  propertyTypesProp: IPropertyTypes[];
  locationProp: ILocationProp[];
  setBuyProp: (value: boolean) => void;
  setRentProp: (value: boolean) => void;
}

type HomeQuery = {
  adType: string | undefined,
  page: number,
  location?: string,
  propertyType?: string,
  propertySubtype?: string,
  longitude?: string,
  latitude?: string
}

const HomeFilter: React.FC<IHomeFilter> = ({
  isBuyProp,
  isRentProp,
  setBuyProp,
  setRentProp,
  propertyTypesProp,
  locationProp,
  ...homeFilterProps
}) => {

  const refPorpertyType = useRef<HTMLDivElement>(null);
  const refLoation = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [buyOrRentOptions, setBuyOrRentOptions] = useState({
    isBuy: true,
    isRent: false
  });
  const [propertyType, setPropertyType] = useState({
    propertyType: '',
    propertySubtype: '',
  });
  const [propTypeDropdownIsOpen, setPropTypeDropdownIsOpen] = useState(false);
  const [location, setLocation] = useState<ILocation[]>([]);
  const [openLocationDropdown, setOpenLocationDropdown] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<ILocation[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [allLocations, setAllLocations] = useState(false);
  const { longitude, latitude, location: geolocation } = useTrackLocation();
  const isMobile = useIsMobile();
  useOutsideClick(refLoation, setOpenLocationDropdown, openLocationDropdown);
  useOutsideClick(refPorpertyType, setPropTypeDropdownIsOpen, propTypeDropdownIsOpen);

  const filterLocation = (value: string) => {
    const filtered: ILocation[] = locationProp.filter((location) =>
      location.name.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredLocations(filtered);
  };

  const categorizedLocations = categorizeLocations(filteredLocations, categoryTranslations);

  const handleFindBtnClick = () => {
    const adType = buyOrRentOptions.isBuy ? 'comprar' : buyOrRentOptions.isRent ? 'alugar' : undefined;

    const query: HomeQuery = {
      adType,
      page: 1,
      location: translateLocations(location, allLocations, categoryMappings),
      propertyType:
        propertyType.propertyType && propertyType.propertyType !== 'todos'
          ? JSON.stringify(propertyType.propertyType)
          : JSON.stringify('todos'),
      propertySubtype:
        propertyType.propertyType && propertyType.propertyType !== 'todos'
          ? JSON.stringify(propertyType.propertySubtype)
          : JSON.stringify('todos'),
    };

    if (geolocation) {
      query.longitude = longitude,
        query.latitude = latitude
    }

    router.push(
      {
        pathname: '/search',
        query,
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  return (
    <>
      <div
        className="flex flex-col md:flex-row gap-4 bg-tertiary lg:p-4 p-3 text-quaternary w-full md:w-fit lg:h-fit rounded-[30px] shadow-lg"
        {...homeFilterProps}
      >
        <div className="relative">
          <h1 className="font-bold md:text-lg lg:text-xl text-xl lg:pb-4 mb-5 md:mb-0 text-center">
            Encontre o lar dos seus sonhos sem sair de casa
          </h1>

          <div className="flex flex-col md:flex-row gap-5 justify-center">
            <div className="flex flex-col gap-5">

              <BuyRentSelector buyOrRent={buyOrRentOptions} onBuyRentChange={(buyOrRent) => setBuyOrRentOptions(buyOrRent)} />

              {isMobile && (
                <Button onClick={handleFindBtnClick} />
              )}

              <div className="lg:w-56 w-full lg:mr-10 flex flex-col gap-2">
                <label>Qual o tipo do imóvel?</label>

                <div
                  className="drop-shadow-lg lg:h-9 lg:w-64 lg:text-sm text-gray-500 rounded-lg p-2 mb-1 border border-quaternary flex justify-between"
                  onClick={() =>
                    setPropTypeDropdownIsOpen(!propTypeDropdownIsOpen)
                  }
                  ref={refPorpertyType}
                >
                  <p className="self-center">
                    {propertyType.propertyType
                      ? propertyType.propertySubtype
                      : `Tipo de imóvel`}
                  </p>
                  <ArrowDownIcon
                    className={`my-auto cursor-pointer ${propTypeDropdownIsOpen
                      ? 'transform rotate-360 transition-transform duration-300 ease-in-out'
                      : 'transform rotate-180 transition-transform duration-300 ease-in-out'
                      }`
                    }
                  />
                </div>
                <div
                  className={`z-50 md:w-fit w-full h-fit rounded-xl bg-tertiary overflow-hidden cursor-pointer shadow-md mt-20 ${!propTypeDropdownIsOpen ? 'hidden ' : 'absolute'
                    }`
                  }
                >
                  {propertyTypeSubtype.map((prop, index) => (
                    <div
                      className="w-full rounded-t-8 bg-tertiary"
                      key={index}
                      ref={refLoation}
                    >
                      <p
                        className="text-quaternary lg:text-lg text-left px-6 font-bold"
                        onClick={() => {
                          if (prop.type === 'todos') {
                            setPropertyType({
                              ...propertyType,
                              propertyType: prop.type,
                              propertySubtype: prop.type
                            })
                          }
                        }}
                      >
                        {lowerLetters(prop.type)}
                      </p>
                      {propertyTypeSubtype[index].subTypes.map((type) => (
                        <div
                          key={type}
                          className="items-start text-sm text-left px-6 hover:bg-quaternary hover:text-tertiary last:mb-1"
                          onClick={() => {
                            setPropertyType({
                              ...propertyType,
                              propertyType: prop.type,
                              propertySubtype: type,
                            });
                            setPropTypeDropdownIsOpen(false);
                          }}
                        >
                          {lowerLetters(type)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse md:flex-col gap-5">

              {!isMobile && (
                <Button onClick={handleFindBtnClick} />
              )}

              <div className="flex flex-col lg:mt-0 gap-2">
                <label className="text-base">Onde?</label>
                <input
                  className="lg:h-9 lg:text-lg border bg-transparent border-quaternary rounded-lg p-2 mt-[0.1rem] placeholder:text-sm"
                  placeholder="digite um bairro, cidade, rua..."
                  maxLength={30}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const newName = event.target.value;
                    setInputValue(newName);
                    filterLocation(newName);
                    setOpenLocationDropdown(newName.length > 0 ? true : false);
                  }}
                  value={location.length > 0 ? location[0].name[0] : inputValue}
                />
                <div
                  className={`z-50 w-full md:w-48 mt-20 h-fit rounded-xl bg-tertiary overflow-hidden cursor-pointer shadow-md ${openLocationDropdown ? 'absolute' : 'hidden'
                    }`}
                  ref={refLoation}
                >
                  <div className="flex flex-col w-full text-center font-normal text-base text-quaternary leading-5">
                    <div
                      className="flex hover:bg-quaternary hover:text-tertiary"
                      onClick={() => {
                        setAllLocations(!allLocations);
                        setLocation([]);
                      }}
                    >
                      <div
                        className={`w-[20px] h-[20px] shrink-0 my-auto border border-quaternary rounded-[3px] bg-white mx-2`}
                      >
                        {allLocations && (
                          <CheckIcon
                            width="20"
                            height="20"
                            fill="#F5BF5D"
                            viewBox="40 126 960 960"
                          />
                        )}
                      </div>
                      <span
                        id="todos"
                        className="translate-x-[1px] w-full h-[50px] rounded-t-xl py-3"
                      >
                        Todos
                      </span>
                    </div>

                    {Object.entries(categorizedLocations).map(
                      ([category, locations]) => (
                        <div key={category} className="w-full py-2 h-fit">
                          <h3 className="font-bold text-xl ml-[20px]">
                            {category}
                          </h3>
                          {locations.map(
                            ({ name }: ILocation, index: number) => (
                              <div
                                key={`${index}-${name}`}
                                className="flex flex-col hover:bg-quaternary hover:text-tertiary px-2"
                              >
                                {Array.isArray(name) ? (
                                  name?.map((option: string, idx: number) => (
                                    <div
                                      key={`${option}-${idx}`}
                                      className={`flex h-[50px]`}
                                      onClick={() => {
                                        toggleLocation(option, category, location, setLocation);
                                      }}
                                    >
                                      <div className="w-[20px] h-[20px] shrink-0 my-auto border border-quaternary rounded-[3px] bg-tertiary">
                                        {(location.some((obj) =>
                                          obj.name.includes(option)
                                        ) ||
                                          allLocations) && (
                                            <CheckIcon
                                              width="20"
                                              height="20"
                                              fill="#F5BF5D"
                                              viewBox="40 126 960 960"
                                            />
                                          )}
                                      </div>
                                      <span
                                        id={option}
                                        className={`translate-x-[1px] w-full h-fit py-1.5 px-2 flex justify-center my-auto`}
                                      >
                                        {option.charAt(0).toUpperCase() +
                                          option.slice(1).toLowerCase()}
                                      </span>
                                    </div>
                                  ))
                                ) : (
                                  <div
                                    className="flex h-[50px]"
                                    onClick={() => {
                                      toggleLocation(name, category, location, setLocation);
                                    }}
                                  >
                                    <div className="w-[20px] h-[20px] shrink-0 my-auto border border-quaternary rounded-[3px] bg-tertiary">
                                      {(location.some((obj) =>
                                        obj.name.includes(name)
                                      ) ||
                                        allLocations) && (
                                          <CheckIcon
                                            width="20"
                                            height="20"
                                            fill="#F5BF5D"
                                            viewBox="40 126 960 960"
                                          />
                                        )}
                                    </div>
                                    <span
                                      id={name}
                                      className="translate-x-[1px] w-full h-fit py-1.5 px-2 flex justify-center my-auto"
                                    >
                                      {name?.charAt(0).toUpperCase() +
                                        name?.slice(1).toLowerCase()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeFilter;
