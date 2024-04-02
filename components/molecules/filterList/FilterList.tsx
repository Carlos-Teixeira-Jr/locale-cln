import { useRouter } from 'next/router';
import { stringify } from 'querystring';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  ILocation,
  ILocationProp,
} from '../../../common/interfaces/locationDropdown';
import { ITagsData } from '../../../common/interfaces/tagsData';
import { categorizeLocations } from '../../../common/utils/format/categorizedLocations';
import propertyTypesData from '../../../data/propertyTypesData.json';
import ArrowDownIcon from '../../atoms/icons/arrowDownIcon';
import CheckIcon from '../../atoms/icons/checkIcon';
import SearchIcon from '../../atoms/icons/searchIcon';
import XIcon from '../../atoms/icons/xIcon';

interface IFilterListProps {
  locationProp: ILocationProp[];
  tagsProp: ITagsData[];
  mobileFilterIsOpenProp: boolean;
  isMobileProp: boolean;
  onMobileFilterIsOpenChange: (isOpen: boolean) => void;
  onSearchBtnClick: () => void;
  locationChangeProp: (loc: ILocation[]) => void;
}

const FilterList: React.FC<IFilterListProps> = ({
  locationProp,
  tagsProp,
  mobileFilterIsOpenProp,
  isMobileProp,
  onMobileFilterIsOpenChange,
  onSearchBtnClick,
  locationChangeProp,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const query = router.query as any;
  const [isBuy, setIsBuy] = useState(true);
  const [isRent, setIsRent] = useState(false);
  const [propertyType, setPropertyType] = useState({
    propertyType: query.propertyType ? query.propertyType : 'todos',
    propertySubtype:
      typeof query.propertySubtype === 'string'
        ? query.propertySubtype.replace(/"/g, '')
        : query.propertySubtype,
  });
  const [propTypeDropdownIsOpen, setPropTypeDropdownIsOpen] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<ILocation[]>([]);
  const queryParsed = query.location ? JSON.parse(query.location) : [];
  const [location, setLocation] = useState<ILocation[]>(queryParsed);
  const [allLocations, setAllLocations] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minCondominium, setMinCondominium] = useState('');
  const [maxCondominium, setMaxCondominium] = useState('');
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [parkingSpaces, setParkingSpaces] = useState(0);
  const tagsData: ITagsData[] = tagsProp;
  const [codeToSearch, setCodeToSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [openLocationDropdown, setOpenLocationDropdown] = useState(false);
  const [mobileFilterIsOpen, setMobileFilterIsOpen] = useState<boolean>(false);
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (query.adType === 'alugar') {
      setIsRent(true);
      setIsBuy(false);
    }
  }, [query.adType]);

  const handleBuy = () => {
    setIsBuy(true);
    setIsRent(false);
    const queryParams = { ...query, adType: 'comprar', page: 1 };
    router.push({ query: queryParams }, undefined, { scroll: false });
  };

  const handleRent = () => {
    setIsBuy(false);
    setIsRent(true);
    const queryParams = { ...query, adType: 'alugar', page: 1 };
    router.push({ query: queryParams }, undefined, { scroll: false });
  };

  const buyBtnClassName = `w-full h-[34px] md:h-fit lg:h-[33px] rounded-full border-black text-quaternary font-bold lg:text-md transition-all ${isBuy
    ? 'bg-secondary text-quinary border-secondary border'
    : 'bg-tertiary  text-quaternary'
    }`;

  const rentBtnClassName = `w-full h-[34px] md:h-fit lg:h-[33px] rounded-full border-black text-quaternary font-bold lg:text-md transition-all ${isRent
    ? 'bg-secondary text-quinary border border-secondary'
    : 'bg-tertiary text-quaternary'
    }`;

  const handlePropertyTypeSelection = (type: string, subType: string) => {
    setPropertyType({
      ...propertyType,
      propertyType: type,
      propertySubtype: subType,
    });

    const propertyTypeQueryParams = {
      ...query,
      propertyType: JSON.stringify(type),
      propertySubtype: JSON.stringify(subType),
      page: 1,
    };

    setPropTypeDropdownIsOpen(false);
    router.push({ query: propertyTypeQueryParams }, undefined, {
      scroll: false,
    });
  };

  const categoryMappings: Record<string, string> = {
    Cidade: 'city',
    Estado: 'state',
    Rua: 'streetName',
    Bairro: 'neighborhood',
  };

  const categoryTranslations: Record<string, string> = {
    city: 'Cidade',
    state: 'Estado',
    streetName: 'Rua',
    neighborhood: 'Bairro',
  };

  const filterLocation = (value: string) => {
    const filtered = locationProp.filter((city) =>
      city.name.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredLocations(filtered);
  };

  const categorizedLocations = categorizeLocations(filteredLocations, categoryTranslations);

  const toggleLocation = (name: string, category: string) => {
    const existingCategory = location.find(
      (item) => item.category === categoryMappings[category]
    );

    if (existingCategory) {
      const updatedLocation = location
        .map((item) => {
          if (item.category === categoryMappings[category]) {
            if (item.name.includes(name)) {
              const updatedName = item.name.filter(
                (itemName: string) => itemName !== name
              );
              if (updatedName.length === 0) {
                return null;
              } else {
                return {
                  ...item,
                  name: updatedName,
                };
              }
            } else {
              return {
                ...item,
                name: [...item.name, name],
              };
            }
          }
          return item;
        })
        .filter(Boolean) as ILocation[];
      setLocation(updatedLocation);
    } else {
      setLocation([
        ...location,
        { name: [name], category: categoryMappings[category] },
      ]);
    }
  };

  useEffect(() => {
    locationChangeProp(location);
  }, [location]);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    if (bedrooms > 0) {
      const queryParams = { ...router.query, bedroom: bedrooms };
      router.push({ query: queryParams }, undefined, { scroll: false });
    } else {
      removeQueryParam('bedroom');
    }
  }, [bedrooms]);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    if (bathrooms > 0) {
      const queryParams = { ...router.query, bathroom: bathrooms };
      router.push({ query: queryParams }, undefined, { scroll: false });
    } else {
      removeQueryParam('bathroom');
    }
  }, [bathrooms]);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    if (parkingSpaces > 0) {
      const queryParams = { ...router.query, parkingSpaces: parkingSpaces };
      router.push({ query: queryParams }, undefined, { scroll: false });
    } else {
      removeQueryParam('parkingSpaces');
    }
  }, [parkingSpaces]);

  useEffect(() => {
    setBedrooms(
      parseInt(query.bedroom !== undefined ? query.bedroom.toString() : '0')
    );

    setBathrooms(
      parseInt(query.bathroom !== undefined ? query.bathroom.toString() : '0')
    );

    setParkingSpaces(
      parseInt(
        query.parkingSpaces !== undefined ? query.parkingSpaces.toString() : '0'
      )
    );
  }, [query]);

  const toggleSelection = (item: string) => {
    const tags: string[] = Array.isArray(query.tags)
      ? query.tags
      : query.tags
        ? query.tags.split(',')
        : [];

    let updatedTags: string[];

    if (tags.includes(item)) {
      updatedTags = tags.filter((tag) => tag !== item);
    } else {
      updatedTags = [...tags, item];
    }

    const updatedQueryTags = updatedTags.join(',');

    if (updatedQueryTags) {
      router.push(
        {
          pathname: router.pathname,
          query: { ...query, tags: updatedQueryTags, page: 1 },
        },
        undefined,
        { scroll: false }
      );
    } else {
      const { tags, ...updatedQuery } = query;
      updatedQuery.page = '1';
      router.push(
        {
          pathname: router.pathname,
          query: updatedQuery,
        },
        undefined,
        { scroll: false }
      );
    }
  };

  useEffect(() => {
    if (!mobileFilterIsOpen) {
      onMobileFilterIsOpenChange(false);
    }
  }, [mobileFilterIsOpen]);

  useEffect(() => {
    setMobileFilterIsOpen(mobileFilterIsOpenProp);
  }, [mobileFilterIsOpenProp]);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
    function handleClick(event: MouseEvent) {
      if (ref && ref.current) {
        const myRef = ref.current;
        if (!myRef.contains(event.target as Node)) {
          setOpenLocationDropdown(false);
        }
      }
    }
  });

  const maskedPrice = (value: string) => {
    let price = value;
    price = price.replace(/\D/g, '');
    price = price.replace(/(\d)(\d{0})$/, '$1,$2');
    price = price.replace(/(?=(\d{3})+(\D))\B/g, '.');
    price = price.substring(0, price.length - 1);
    return price;
  };

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    const formatMinPrice = minPrice
      .replace(/\./g, '')
      .replace(/,(\d{2})$/, '.$1');
    if (minPrice.length !== 0 || minPrice !== '') {
      const minPriceQueryParams = { ...query, minPrice: formatMinPrice };
      router.push({ query: minPriceQueryParams }, undefined, { scroll: false });
    } else {
      removeQueryParam('minPrice');
    }
  }, [minPrice]);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    const formatMaxPrice = maxPrice
      .replace(/\./g, '')
      .replace(/,(\d{2})$/, '.$1');
    if (maxPrice.length !== 0 || maxPrice !== '') {
      const maxPriceQueryParams = {
        ...query,
        maxPrice: formatMaxPrice,
        page: 1,
      };
      router.push({ query: maxPriceQueryParams }, undefined, { scroll: false });
    } else {
      removeQueryParam('maxPrice');
    }
  }, [maxPrice]);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    const formatMinCondominium = minCondominium
      .replace(/\./g, '')
      .replace(/,(\d{2})$/, '.$1');
    if (minCondominium.length !== 0 || minCondominium !== '') {
      const minCondominiumQueryParams = {
        ...query,
        minCondominium: formatMinCondominium,
        page: 1,
      };
      router.push({ query: minCondominiumQueryParams }, undefined, {
        scroll: false,
      });
    } else {
      removeQueryParam('minCondominium');
    }
  }, [minCondominium]);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    const formatMaxCondominium = maxCondominium
      .replace(/\./g, '')
      .replace(/,(\d{2})$/, '.$1');
    if (maxCondominium.length !== 0 || maxCondominium !== '') {
      const maxCondominiumQueryParams = {
        ...query,
        maxCondominium: formatMaxCondominium,
        page: 1,
      };
      router.push({ query: maxCondominiumQueryParams }, undefined, {
        scroll: false,
      });
    } else {
      removeQueryParam('maxCondominium');
    }
  }, [maxCondominium]);

  const removeQueryParam = (param: string) => {
    const { pathname } = router;
    const params = new URLSearchParams(stringify(query));
    params.delete(param);
    params.set('page', '1');
    router.replace({ pathname, query: params.toString() }, undefined, {
      shallow: false,
      scroll: false,
    });
  };

  return (
    <div
      className={`lg:block md:w-full lg:max-w-[400px] h-fit bg-tertiary shadow-md rounded-[30px] px-2 md:px-5 md:py-8 pt-8 pb-2 lg:ml-7 mt-12 ${!mobileFilterIsOpen ? 'hidden' : ''
        }`}
    >
      {mobileFilterIsOpen && (
        <div className="flex flex-col sticky top-0 z-10">
          <div className="sticky z-[100] bg-tertiary flex flex-row items-center justify-between px-6 py-6">
            <h1 className="font-semibold text-quaternary text-4xl z-[100]">
              Filtros
            </h1>
            <button onClick={() => setMobileFilterIsOpen(false)}>
              <XIcon />
            </button>
          </div>
          <div className="border border-b-quaternary/30 mb-9 z-[100]" />
        </div>
      )}

      <div className="flex flex-col md:flex-row lg:flex-col justify-between">
        <div>
          <h3 className="font-normal text-base text-quaternary leading-[19px] mb-2 ">
            O que procura?
          </h3>
          <div className="flex flex-row rounded-full border border-quaternary lg:h-9 w-full mx-auto md:mt-3 lg:mt-2 justify-center mb-5">
            <div className="w-full">
              <button className={buyBtnClassName} onClick={handleBuy}>
                Comprar
              </button>
            </div>
            <div className="w-full">
              <button className={rentBtnClassName} onClick={handleRent}>
                Alugar
              </button>
            </div>
          </div>

          <div className="relative">
            <h3 className="font-normal text-base text-quaternary leading-[19px] mb-2 ">
              Qual o tipo?
            </h3>

            <div
              className="drop-shadow-lg h-10 w-full lg:text-md rounded-xl p-2 text-gray-400 mb-1 border border-quaternary flex justify-between"
              onClick={() => setPropTypeDropdownIsOpen(!propTypeDropdownIsOpen)}
            >
              <p className="text-gray-400 text-sm pl-1 font-normal">
                {propertyType.propertyType !== 'todos'
                  ? propertyType.propertySubtype
                  : `todos`}
              </p>
              <ArrowDownIcon
                className={`my-auto cursor-pointer ${propTypeDropdownIsOpen
                  ? 'transform rotate-360 transition-transform duration-300 ease-in-out'
                  : 'transform rotate-180 transition-transform duration-300 ease-in-out'
                  }`}
              />
            </div>
            <div
              className={`z-50 w-full px-2 h-fit rounded-xl bg-tertiary overflow-hidden text-quaternary cursor-pointer shadow-md ${!propTypeDropdownIsOpen ? 'hidden ' : 'absolute'
                }`}
            >
              <p
                className="text-left lowercase px-3 pt-1 hover:bg-quaternary hover:text-tertiary text-quaternary font-bold text-md"
                onClick={() => handlePropertyTypeSelection('todos', 'todos')}
              >
                todos
              </p>
              {propertyTypesData.map((prop, index) => (
                <div
                  key={index}
                  className="w-full rounded-t-8 bg-tertiary px-2"
                >
                  <p className="text-quaternary px-1 lg:text-lg text-left font-bold ">
                    {prop.type}
                  </p>
                  {propertyTypesData[index].subTypes.map((type) => (
                    <div
                      key={type}
                      className="text-left text-sm last:mb-1 px-1 hover:bg-quaternary hover:text-tertiary"
                      onClick={() =>
                        handlePropertyTypeSelection(prop.type, type)
                      }
                    >
                      {type}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col my-3">
            <label className="font-normal text-base text-quaternary leading-[19px] mb-2">
              Onde?
            </label>
            <input
              className="bg-transparent w-full h-10 font-normal text-sm text-quaternary leading-[19px] shadow-lg p-3 border border-quaternary rounded-xl outline-none"
              placeholder="digite um bairro, cidade, rua..."
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const value = event.target.value;
                setLocationInput(value !== 'todos' ? value : '');
                filterLocation(value);
                setOpenLocationDropdown(
                  value !== '' && locationInput.length > 1 ? true : false
                );
              }}
              value={locationInput}
              maxLength={30}
            />
            <div
              className={`z-50 w-full h-fit rounded-xl bg-tertiary overflow-hidden cursor-pointer shadow-md ${openLocationDropdown ? 'md:flex' : 'hidden'
                }`}
              ref={ref}
            >
              <div className="flex flex-col w-full text-center font-normal text-base text-quaternary leading-5">
                <div
                  className="flex rounded-t-xl hover:bg-quaternary hover:text-tertiary"
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
                    className="translate-x-[1px] w-full h-[50px] py-3"
                  >
                    Todos
                  </span>
                </div>

                {Object.entries(categorizedLocations).map(
                  ([category, locations]) => (
                    <div key={category} className="w-full py-2 h-fit">
                      <h3 className="font-bold text-lg ml-[20px]">
                        {category}
                      </h3>
                      {locations.map(({ name }: ILocation) => (
                        <div
                          key={`${category}-${name}`}
                          className="flex flex-col hover:bg-quaternary hover:text-tertiary px-2"
                        >
                          {Array.isArray(name) ? (
                            name.map((option: string) => (
                              <div
                                key={option}
                                className="flex h-[50px]"
                                onClick={() => {
                                  toggleLocation(option, category);
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
                                  className="translate-x-[1px] w-full h-fit py-1.5 px-2 flex justify-center my-auto"
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
                                toggleLocation(name, category);
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
                                {name.charAt(0).toUpperCase() +
                                  name.slice(1).toLowerCase()}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="md:mt-[87px] lg:mt-0">
          <h3 className="font-normal text-base text-quaternary leading-[19px] mb-2 lg:my-2">
            Preço
          </h3>
          <div className="flex flex-row mb-5 md:mb-3">
            <input
              value={maskedPrice(minPrice)}
              placeholder="min."
              className={
                'bg-transparent outline-none w-full h-10 font-normal text-sm text-quaternary leading-[19px] lg:mb-2 shadow-lg p-3 border border-quaternary rounded-xl'
              }
              onChange={(e) => setMinPrice(maskedPrice(e.target.value))}
              maxLength={10}
            />
            <span className="px-3 md:px-3 mt-2 text-quaternary">a</span>
            <input
              value={maskedPrice(maxPrice)}
              placeholder="max."
              className={
                'bg-transparent outline-none w-full h-10 font-normal text-sm text-quaternary leading-[19px] lg:mb-2 shadow-lg p-3 border border-quaternary rounded-xl'
              }
              onChange={(e) => setMaxPrice(maskedPrice(e.target.value))}
              maxLength={10}
            />
          </div>

          <h3 className="font-normal text-base text-quaternary leading-[19px] mb-2">
            Condomínio
          </h3>
          <div className="flex flex-row">
            <input
              value={maskedPrice(minCondominium)}
              placeholder="min."
              className={
                'bg-transparent outline-none w-full h-10 font-normal text-sm text-quaternary leading-[19px] lg:mb-2 shadow-lg p-3 border border-quaternary rounded-xl'
              }
              onChange={(e) => setMinCondominium(maskedPrice(e.target.value))}
              maxLength={10}
            />
            <span className="px-3 md:px-3 mt-2 text-quaternary">a</span>
            <input
              value={maskedPrice(maxCondominium)}
              placeholder="max."
              className={
                'bg-transparent outline-none w-full h-10 font-normal text-sm text-quaternary leading-[19px] mb-5 lg:mb-2 shadow-lg p-3 border border-quaternary rounded-xl'
              }
              onChange={(e) => setMaxCondominium(maskedPrice(e.target.value))}
              maxLength={10}
            />
          </div>
        </div>
      </div>

      <div className="md:flex lg:flex-col gap-2 justify-between md:w-full md:mt-3">
        <div className="-mb-5">
          <h3 className="font-normal text-base text-quaternary leading-[19px] mb-2">
            Quartos
          </h3>
          <div className="flex justify-between gap-2">
            <button
              className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-5 md:mb-11 shadow-lg p-3 border border-quaternary rounded-xl hover:bg-secondary hover:text-tertiary hover:border-secondary"
              onClick={() => setBedrooms(bedrooms != 1 ? 1 : 0)}
              style={
                bedrooms === 1
                  ? {
                    background: '#F5BF5D',
                    border: '1px solid #F5BF5D',
                    font: '#F7F7F6',
                  }
                  : {}
              }
            >
              1+
            </button>
            <button
              className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-5 md:mb-11 shadow-lg p-3 border border-quaternary rounded-xl hover:bg-secondary hover:text-tertiary hover:border-secondary"
              onClick={() => setBedrooms(bedrooms != 2 ? 2 : 0)}
              style={
                bedrooms === 2
                  ? {
                    background: '#F5BF5D',
                    border: '1px solid #F5BF5D',
                    font: '#F7F7F6',
                  }
                  : {}
              }
            >
              2+
            </button>
            <button
              className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-5 md:mb-11 shadow-lg p-3 border border-quaternary rounded-xl hover:bg-secondary hover:text-tertiary hover:border-secondary"
              onClick={() => setBedrooms(bedrooms != 3 ? 3 : 0)}
              style={
                bedrooms === 3
                  ? {
                    background: '#F5BF5D',
                    border: '1px solid #F5BF5D',
                    font: '#F7F7F6',
                  }
                  : {}
              }
            >
              3+
            </button>
            <button
              className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-5 md:mb-11 shadow-lg p-3 border border-quaternary rounded-xl hover:bg-secondary hover:text-tertiary hover:border-secondary"
              onClick={() => {
                setBedrooms(bedrooms != 4 ? 4 : 0);
              }}
              style={
                bedrooms === 4
                  ? {
                    background: '#F5BF5D',
                    border: '1px solid #F5BF5D',
                    font: '#F7F7F6',
                  }
                  : {}
              }
            >
              4+
            </button>
          </div>
        </div>

        <div className="w-1 h-16 mt-5 border-l border-quaternary hidden md:flex lg:hidden"></div>

        <div className="-mb-5">
          <h3 className="font-normal text-base text-quaternary leading-[19px] mb-2">
            Banheiros
          </h3>
          <div className="flex justify-between gap-5">
            <button
              className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-5 md:mb-11 shadow-lg p-3 border border-quaternary rounded-xl hover:bg-secondary hover:text-tertiary hover:border-secondary"
              onClick={() => setBathrooms(bathrooms != 1 ? 1 : 0)}
              style={
                bathrooms === 1
                  ? {
                    background: '#F5BF5D',
                    border: '1px solid #F5BF5D',
                    font: '#F7F7F6',
                  }
                  : {}
              }
            >
              1+
            </button>
            <button
              className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-5 md:mb-11 shadow-lg p-3 border border-quaternary rounded-xl hover:bg-secondary hover:text-tertiary hover:border-secondary"
              onClick={() => setBathrooms(bathrooms != 2 ? 2 : 0)}
              style={
                bathrooms === 2
                  ? {
                    background: '#F5BF5D',
                    border: '1px solid #F5BF5D',
                    font: '#F7F7F6',
                  }
                  : {}
              }
            >
              2+
            </button>
            <button
              className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-5 md:mb-11 shadow-lg p-3 border border-quaternary rounded-xl hover:bg-secondary hover:text-tertiary hover:border-secondary"
              onClick={() => setBathrooms(bathrooms != 3 ? 3 : 0)}
              style={
                bathrooms === 3
                  ? {
                    background: '#F5BF5D',
                    border: '1px solid #F5BF5D',
                    font: '#F7F7F6',
                  }
                  : {}
              }
            >
              3+
            </button>
            <button
              className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-5 md:mb-11 shadow-lg p-3 border border-quaternary rounded-xl hover:bg-secondary hover:text-tertiary hover:border-secondary"
              onClick={() => setBathrooms(bathrooms != 4 ? 4 : 0)}
              style={
                bathrooms === 4
                  ? {
                    background: '#F5BF5D',
                    border: '1px solid #F5BF5D',
                    font: '#F7F7F6',
                  }
                  : {}
              }
            >
              4+
            </button>
          </div>
        </div>

        <div className="w-1 h-16 mt-5 border-l border-quaternary hidden md:flex lg:hidden"></div>

        <div>
          <h3 className="font-normal text-base text-quaternary leading-[19px] mb-2">
            Vagas de garagem
          </h3>
          <div className="flex justify-between gap-5">
            <button
              className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-5 md:mb-11 shadow-lg p-3 border border-quaternary rounded-xl hover:bg-secondary hover:text-tertiary hover:border-secondary"
              onClick={() => setParkingSpaces(parkingSpaces != 1 ? 1 : 0)}
              style={
                parkingSpaces === 1
                  ? {
                    background: '#F5BF5D',
                    border: '1px solid #F5BF5D',
                    font: '#F7F7F6',
                  }
                  : {}
              }
            >
              1+
            </button>
            <button
              className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-5 md:mb-11 shadow-lg p-3 border border-quaternary rounded-xl hover:bg-secondary hover:text-tertiary hover:border-secondary"
              onClick={() => setParkingSpaces(parkingSpaces != 2 ? 2 : 0)}
              style={
                parkingSpaces === 2
                  ? {
                    background: '#F5BF5D',
                    border: '1px solid #F5BF5D',
                    font: '#F7F7F6',
                  }
                  : {}
              }
            >
              2+
            </button>
            <button
              className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-5 md:mb-11 shadow-lg p-3 border border-quaternary rounded-xl hover:bg-secondary hover:text-tertiary hover:border-secondary"
              onClick={() => setParkingSpaces(parkingSpaces != 3 ? 3 : 0)}
              style={
                parkingSpaces === 3
                  ? {
                    background: '#F5BF5D',
                    border: '1px solid #F5BF5D',
                    font: '#F7F7F6',
                  }
                  : {}
              }
            >
              3+
            </button>
            <button
              className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-5 md:mb-11 shadow-lg p-3 border border-quaternary rounded-xl hover:bg-secondary hover:text-tertiary hover:border-secondary"
              onClick={() => setParkingSpaces(parkingSpaces != 4 ? 4 : 0)}
              style={
                parkingSpaces === 4
                  ? {
                    background: '#F5BF5D',
                    border: '1px solid #F5BF5D',
                    font: '#F7F7F6',
                  }
                  : {}
              }
            >
              4+
            </button>
          </div>
        </div>
      </div>

      <div className="border border-b-quaternary -mt-2 mb-5" />

      <div>
        <div>
          <h3 className="font-normal text-base text-quaternary leading-[19px] mb-3">
            Outros filtros
          </h3>

          {tagsData?.length > 0 ? (
            tagsData?.map(({ name, amount }) => (
              <div className="flex flex-row items-center mb-3" key={name}>
                <div
                  id={name}
                  className={`w-[20px] h-[20px] border border-quaternary rounded-[3px] bg-tertiary ${query.tags?.toLowerCase().includes(name.toLowerCase())
                    ? 'border-yellow-500'
                    : ''
                    }`}
                  onClick={() => toggleSelection(name)}
                >
                  {query.tags?.toLowerCase().includes(name.toLowerCase()) && (
                    <CheckIcon
                      width="20"
                      height="20"
                      fill="#F5BF5D"
                      viewBox="40 126 960 960"
                    />
                  )}
                </div>
                <h3 className="font-normal text-sm text-quaternary leading-[19px] ml-3">
                  {name} ({amount})
                </h3>
              </div>
            ))
          ) : (
            <div>
              <p className="font-normal text-base text-quaternary leading-[19px] mb-3">
                Houve um problema ao buscar os filtros
              </p>
            </div>
          )}

          <div className="border border-b-quaternary my-6" />
        </div>

        <div className="md:w-1/2 lg:w-full">
          <h3 className="font-normal text-base text-quaternary leading-[19px] mb-3">
            Buscar imóvel por código
          </h3>
          <div className="flex gap-3">
            <input
              placeholder="digite o código..."
              className="bg-transparent w-full h-10 font-normal text-sm text-quaternary leading-[19px] mb-1 shadow-lg p-3 border border-quaternary rounded-xl outline-none"
              value={codeToSearch}
              onChange={(e) => setCodeToSearch(e.target.value)}
              maxLength={30}
            />
            <div
              className="bg-secondary shadow-lg border border-quaternary rounded-xl outline-none px-2 py-0 h-10 cursor-pointer hover:bg-primary active:bg-primary transition-colors"
              onClick={() => {
                const queryParams = { ...router.query, code: codeToSearch };
                router.push({ query: queryParams });
              }}
            >
              <SearchIcon fill="#F7F7F6" width="25" className="pb-1" />
            </div>
          </div>
        </div>

        {mobileFilterIsOpen && isMobileProp && (
          <div className="bg-tertiary sticky z-10 bottom-0 flex flex-row items-center justify-between mt-2 p-4 w-full">
            <h3 className="text-primary text-lg font-bold">Remover filtros</h3>
            <button
              className="bg-primary rounded-[30px] p-2 text-tertiary px-10 text-lg font-extrabold"
              onClick={onSearchBtnClick}
            >
              Buscar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterList;
