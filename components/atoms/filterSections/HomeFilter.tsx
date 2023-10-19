import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  ILocation,
  ILocationProp,
} from '../../../common/interfaces/locationDropdown';
import { IPropertyTypes } from '../../../common/interfaces/property/propertyTypes';
import ArrowDownIcon from '../icons/arrowDownIcon';
import CheckIcon from '../icons/checkIcon';
import propertyTypesData from '../../../data/propertyTypesData.json';

export interface IHomeFilter extends React.ComponentPropsWithoutRef<'div'> {
  isBuyProp: boolean;
  isRentProp: boolean;
  propertyTypesProp: IPropertyTypes[];
  locationProp: ILocationProp[];
  setBuyProp: (value: boolean) => void;
  setRentProp: (value: boolean) => void;
}

export interface Iquery extends ParsedUrlQueryInput {
  adType: string | undefined;
  propertyType?: string;
  location?: string;
  category?: string;
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

  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isBuy, setIsBuy] = useState(true);
  const [isRent, setIsRent] = useState(false);
  const [propertyType, setPropertyType] = useState({
    propertyType: '',
    propertySubtype: ''
  });
  const [propTypeDropdownIsOpen, setPropTypeDropdownIsOpen] = useState(false);
  const [location, setLocation] = useState<ILocation[]>([]);
  const [open, setOpen] = useState(false);
  const [openLocationDropdown, setOpenLocationDropdown] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<ILocation[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [allLocations, setAllLocations] = useState(false);

  //// AD TYPE ////

  const handleBuy = () => {
    setIsBuy(true);
    setIsRent(false);
    setBuyProp(true);
    setRentProp(false);
  };

  const handleRent = () => {
    setIsBuy(false);
    setIsRent(true);
    setBuyProp(false);
    setRentProp(true);
  };

  // Estilos do switch button de aluguel/compra;
  const buyBtnClassName = `w-full h-[34px] md:h-fit lg:h-[34px] rounded-full border-black text-quaternary font-bold lg:text-lg transition-all ${
    isBuy ? 'bg-secondary text-quinary border' : 'bg-tertiary  text-quaternary'
  }`;

  const rentBtnClassName = `w-full h-[34px] md:h-fit lg:h-[34px] rounded-full border-black text-quaternary font-bold lg:text-lg transition-all ${
    isRent ? 'bg-secondary text-quinary border' : 'bg-tertiary text-quaternary'
  }`;

  //// ADDRESS ////

  //Filtra os docs de location retornados pela query para mostrar apenas os docs referentes ao que foi digitado no input;
  const filterLocation = (value: string) => {
    const filtered: ILocation[] = locationProp.filter((location) =>
      location.name.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredLocations(filtered);
  };

  // Traduz o nome das categorias de endereço do inglês para o portugues para mostrar no dropdown;
  const categoryTranslations: Record<string, string> = {
    city: 'Cidade',
    state: 'Estado',
    streetName: 'Rua',
    neighborhood: 'Bairro',
  };

  // Lida com a retradução para o inglês pois é dessa forma que a rota realiza a busca;
  const categoryMappings: Record<string, string> = {
    Cidade: 'city',
    Estado: 'state',
    Rua: 'streetName',
    Bairro: 'neighborhood',
  };

  // Reorganiza filteredLocations para que se torne um objeto onde cada prop é representa uma categoria em forma de um array com todas as strings de localização referentes à essa categoria;
  const categorizedLocations: Record<string, ILocation[]> =
    filteredLocations.reduce(
      (categories: Record<string, ILocation[]>, location) => {
        const translatedCategory =
          categoryTranslations[location.category] || location.category;
        if (!categories[translatedCategory]) {
          categories[translatedCategory] = [];
        }
        const index = categories[translatedCategory].findIndex(
          (item) => item.category === location.category
        );
        if (index === -1) {
          categories[translatedCategory].push({
            name: [location.name],
            category: location.category,
          });
        } else {
          categories[translatedCategory].push({
            name: location.name,
            category: location.category,
          });
        }
        return categories;
      },
      {}
    );

  // Insere e remove os objetos de location ao clicar nas opções do dropdown;
  const toggleLocation = (name: string, category: string) => {
    // Procura no array location um objeto que tenha a categoria igual a selecionada;
    const existingCategory = location.find(
      (item) => item.category === category
    );

    if (existingCategory) {
      // Verifica se já existe um objeto com a categoria selecionada, então apenas atualizamos o array name dentro do objeto dessa categoria;
      const updatedLocation = location
        .map((item) => {
          if (item.category === category) {
            // Verifica se o name selecionado já está presente no array name do objeto com a categoria selecionada;
            if (item.name.includes(name)) {
              // Se já existir esse name, ele é removido do array;
              const updatedName = item.name.filter(
                (itemName: string) => itemName !== name
              );
              // Se o name removido for o ultimo do array, retornamos um valor null para posteriormente remover todo o objeto da categoria correspondente;
              if (updatedName.length === 0) {
                return null; // Retorna null para filtrar o objeto do array
              } else {
                // Se não for o ultimo, então retornamos um novo array name com o novo name selecionado;
                return {
                  ...item,
                  name: updatedName,
                };
              }
            } else {
              // Se não houver o name no array retornamos um novo array name com o novo name selecionado;
              return {
                ...item,
                name: [...item.name, name],
              };
            }
          }
          return item;
          // O filter remove os objetos que tenham retoornado null no map acima para removê-los de updatedLocation;
        })
        .filter(Boolean) as ILocation[];
      setLocation(updatedLocation);
      // Caso a opção selecionada pertença a uma categoria ainda não inserida em location, apenas é inserido um objeto com o name e category selecionados;
    } else {
      setLocation([...location, { name: [name], category }]);
    }
  };

  const handleFindBtnClick = () => {
    let adType;
    if (isBuy) {
      adType = 'comprar';
    } else if (isRent) {
      adType = 'alugar';
    }

    const query: Iquery = {
      adType,
      page: 1,
    };

    const translatedLocations: { category: string; name: string[] }[] = [];

    if (location.length > 0 && !allLocations) {
      location.forEach((loc) => {
        if (!allLocations) {
          const { name, category } = loc;
          // Traduz o nome das categories de volta para o inglês para facilitar a busca no back;
          const formattedCategory = categoryMappings[category] || category;
          const existingLocation = translatedLocations.find(
            (item) => item.category === formattedCategory
          );
          if (existingLocation) {
            existingLocation.name.push(...name);
          } else {
            translatedLocations.push({ category: formattedCategory, name });
          }
        }
      });
      query.location = JSON.stringify(translatedLocations);
    } else {
      query.location = JSON.stringify('todos');
    }

    if (propertyType.propertyType && propertyType.propertyType !== 'todos') {
      query.propertyType = JSON.stringify(propertyType.propertyType);
      query.propertySubtype = JSON.stringify(propertyType.propertySubtype);
    } else {
      query.propertyType = JSON.stringify('todos');
      query.propertySubtype = JSON.stringify('todos');
    }

    router.push({
      pathname: '/search',
      query,
    });
  };

  //// FUNCTIONALITIES ////

  // Lida com cliques fora e dentro dos dropdowns para o comportamento de fechamento;
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

        <div className='flex flex-col md:flex-row gap-5 justify-center'>
          <div className='flex flex-col gap-5'>
            <div className="w-full mx-auto flex flex-col gap-2 md:gap-0">
              <label className="text-base">O que procura?</label>
              <div className="flex flex-row rounded-full border border-quaternary lg:h-9 w-full mx-auto md:mt-3 lg:mt-2 justify-center">
                <div className='w-full'>
                  <button className={buyBtnClassName} onClick={handleBuy}>
                    Comprar
                  </button>
                </div>
                <div className='w-full'>
                  <button className={rentBtnClassName} onClick={handleRent}>
                    Alugar
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:w-56 w-full lg:mr-10 flex flex-col gap-2">
              <label>Qual o tipo do imóvel?</label>

              <div 
                className="drop-shadow-lg lg:h-9 lg:w-64 lg:text-lg text-quaternary rounded-lg p-2 mb-1 border border-quaternary flex justify-between"
                onClick={() => setPropTypeDropdownIsOpen(!propTypeDropdownIsOpen)}
              >
                <p className='self-center'>{propertyType.propertyType ? propertyType.propertySubtype : `Tipo de imóvel`}</p>
                <ArrowDownIcon
                  className={`my-auto cursor-pointer ${
                    propTypeDropdownIsOpen
                    ? 'transform rotate-360 transition-transform duration-300 ease-in-out'
                    : 'transform rotate-180 transition-transform duration-300 ease-in-out'
                  }`}
                />
              </div>
              <div 
                className={`z-50 md:w-fit w-full h-fit rounded-xl bg-tertiary overflow-hidden cursor-pointer shadow-md mt-20 ${
                  !propTypeDropdownIsOpen
                  ? 'hidden '
                  : 'absolute'
                }`}
              >
                {propertyTypesData.map((prop, index) => (
                  <div className='w-full rounded-t-8 bg-tertiary'>
                    <p className='text-quaternary lg:text-2xl p-1 text-center font-bold '>{prop.type}</p>
                    {propertyTypesData[index].subTypes.map((type) =>  (
                      <div 
                        className='text-center p-1 hover:bg-quaternary hover:text-tertiary'
                        onClick={() => {
                          setPropertyType({
                            ...propertyType,
                            propertyType: prop.type,
                            propertySubtype: type
                          });
                          setPropTypeDropdownIsOpen(false);
                        }}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='flex flex-col-reverse md:flex-col gap-5'>
            <div className='w-full'>
              <button
                className="bg-primary rounded-full w-full h-12 md:h-fit lg:h-[34px] md:mt-9 lg:mt-8 float-right text-tertiary text-xl shadow-md hover:bg-red-600 hover:text-tertiary hover:shadow-lg transition-all duration-200 active:bg-primary-dark active:text-tertiary active:shadow-none focus:outline-none"
                onClick={handleFindBtnClick}
              >
                Buscar
              </button>
            </div>
            
            <div className="flex flex-col lg:mt-0 gap-2">
              <label className="text-base">Onde?</label>
              <input
                className="drop-shadow-lg lg:h-9 lg:text-lg rounded-lg p-2 mb-1 placeholder:text-sm"
                placeholder="Digite um bairro, cidade, rua..."
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  const newName = event.target.value;
                  setInputValue(newName);
                  filterLocation(newName);
                  setOpenLocationDropdown(newName.length > 0 ? true : false);
                }}
                value={location.length > 0 ? location[0].name[0] : inputValue}
              />
              <div
                className={`z-50 w-full md:w-48 mt-20 h-fit rounded-xl bg-tertiary overflow-hidden cursor-pointer shadow-md ${
                  openLocationDropdown ? 'absolute' : 'hidden'
                }`}
                ref={ref}
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
                        {locations.map(({ name }: ILocation, index: number) => (
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
                                  {name?.charAt(0).toUpperCase() +
                                    name?.slice(1).toLowerCase()}
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
        </div>

      </div>
    </div>
    </>
  );
};

export default HomeFilter;
