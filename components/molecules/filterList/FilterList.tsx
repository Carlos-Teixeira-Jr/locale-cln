import { ChangeEvent, useEffect, useRef, useState } from 'react';
import CheckIcon from '../../atoms/icons/checkIcon';
import SearchIcon from '../../atoms/icons/searchIcon';
import { useRouter } from 'next/router';
import ArrowDownIconcon from '../../atoms/icons/arrowDownIcon';
import { stringify } from 'querystring';
import { ITagsData } from '../../../common/interfaces/tagsData';
import { ILocation, ILocationProp } from '../../../common/interfaces/locationDropdown';
import { IPropertyTypes } from '../../../common/interfaces/property/propertyTypes';

interface IFilterListProps {
  propertyTypesProp: IPropertyTypes[];
  locationProp: ILocationProp[],
  tagsProp: ITagsData[],
  mobileFilterIsOpenProp: boolean;
  isMobileProp: boolean;
  onMobileFilterIsOpenChange: (isOpen: boolean) => void;
  onSearchBtnClick: () => void;
}

const FilterList: React.FC<IFilterListProps> = ({
  propertyTypesProp,
  locationProp,
  tagsProp,
  mobileFilterIsOpenProp,
  isMobileProp,
  onMobileFilterIsOpenChange,
  onSearchBtnClick
}) => {
  console.log("🚀 ~ file: FilterList.tsx:30 ~ propertyTypesProp:", propertyTypesProp)
  
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const query = router.query;

  // adType
  const [isBuy, setIsBuy] = useState(true);
  const [isRent, setIsRent] = useState(false);
  // propertyType
  const [propertyType, setPropertyType] = useState<string[]>([]);
  // Lida apenas com o valor que aparecerá no input de localização;
  const [locationInput, setLocationInput] = useState('');
  // Lida com a formatação da lozalização e categoria da localização para mostrá-las no dropdown;
  const [filteredLocations, setFilteredLocations] = useState<ILocation[]>([]);
  const [location, setLocation] = useState<ILocation[]>([]);
  const [initialLocation, setInitialLocation] = useState<ILocation[]>([])
  const [allLocations, setAllLocations] = useState(false);

  // prices
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  // condominium
  const [minCondominium, setMinCondominium] = useState('');
  const [maxCondominium, setMaxCondominium] = useState('');
  // metadata
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [parkingSpaces, setParkingSpaces] = useState(0);
  // tags
  const tagsData: ITagsData[] = tagsProp;
  // code
  const [codeToSearch, setCodeToSearch] = useState('');
  // dropdown
  const [open, setOpen] = useState(false);
  const [openLocationDropdown, setOpenLocationDropdown] = useState(false);
  // mobile
  const [mobileFilterIsOpen, setMobileFilterIsOpen] = useState<boolean>(false);

  const [firstRender, setFirstRender] = useState(true);
  
  // ADTYPE

  // Lida com o switcher de aluguel/compra quando o valor já vem do filtro da homepage;
  useEffect(() => {
    if (query.adType === 'aluguel') {
      setIsRent(true);
      setIsBuy(false);
    }
  }, [query]);

  const handleBuy = () => {
    setIsBuy(true);
    setIsRent(false);
    const queryParams = { ...query, adType: 'compra', page: 1 };
    router.push(
      { query: queryParams}, 
      undefined, 
      {scroll: false}
    )
  };

  const handleRent = () => {
    setIsBuy(false);
    setIsRent(true);
    const queryParams = { ...query, adType: 'aluguel', page: 1 };
    router.push(
      { query: queryParams}, 
      undefined, 
      {scroll: false}
    )
  };

  // Estilos do switch button de compra/aluguel;
  const buyBtnClassName = `lg:w-44 md:w-32 w-40 h-[34px] md:h-fit lg:h-[34px] rounded-full border-black text-quaternary font-bold text-xl transition-all ${
    isBuy
      ? 'bg-secondary text-quinary border'
      : 'bg-tertiary  text-quaternary'
  }`;

  const rentBtnClassName = `lg:w-44 w-32 w-40 h-[34px] md:h-fit lg:h-[34px] rounded-full border-black text-quaternary font-bold text-xl transition-all ${
    isRent
      ? 'bg-secondary text-quinary border'
      : 'bg-tertiary text-quaternary'
  }`;

  // PROPERTY TYPE

  const togglePropertyTypeSelection = (name: string) => {
    if (name === 'todos') {
      const hasTodos = propertyType.some((item) => item === name);
      if (hasTodos) {
        setPropertyType(propertyType.filter((item) => item !== name));
      } else {
        setPropertyType([name]);
      }
    } else {
      if (propertyType.includes(name)) {
        setPropertyType(propertyType.filter((item: string) => item !== name));
      } else {
        setPropertyType([...propertyType, name]);
      }
    }
  }

  // Insere o valor de propertyType nos parâmetros da URL;
  useEffect(() => {
    // Atualizar os parâmetros da URL
    if (propertyType.length < 1) {
      if(!query.propertyType?.includes('todos')){
        removeQueryParam('propertyType');
      }
    } else {
      const queryParams = { ...query, propertyType: JSON.stringify([...propertyType]), page: 1 };
      router.push({ query: queryParams }, undefined, { scroll: false });
    }
  }, [propertyType, query.propertyType]);

  // ADDRESS

  // Traduz o nome das categorias de endereço do inglês para o portugues para mostrar no dropdown;
  const categoryMappings: Record<string, string> = {
    Cidade: 'city',
    Estado: 'state',
    Rua: 'streetName',
    Bairro: 'neighborhood',
  };

  // Lida com a retradução para o inglês pois é dessa forma que a rota realiza a busca;
  const categoryTranslations: Record<string, string> = {
    city: 'Cidade',
    state: 'Estado',
    streetName: 'Rua',
    neighborhood: 'Bairro',
  };

  //Filtra os docs de location retornados pela query para mostrar apenas os docs referentes ao que foi digitado no input;
  const filterLocation = (value: string) => {
    const filtered = locationProp.filter((city) =>
      city.name.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredLocations(filtered);
  };

  // Reorganiza filteredLocations para que se torne um objeto onde cada prop representa uma categoria em forma de um array com todas as strings de localização referentes à essa categoria;
  const categorizedLocations: Record<string, ILocation[]> = filteredLocations.reduce(
    (categories: Record<string, ILocation[]>, location) => {
      const translatedCategory = categoryTranslations[location.category] || location.category;
      if (!categories[translatedCategory]) {
        categories[translatedCategory] = [];
      }
      categories[translatedCategory].push(location);
      return categories;
    },
    {}
  );

  // Insere e remove os objetos de location ao clicar nas opções do dropdown;
  const toggleLocation = (name: string, category: string) => {
    // Procura no array location um objeto que tenha a categoria igual a selecionada;da
    const existingCategory = location.find(item => item.category === category);
  
    if (existingCategory) {
      // Verifica se já existe um objeto com a categoria selecionada, então apenas atualizamos o array name dentro do objeto dessa categoria;
      const updatedLocation = location.map(item => {
        if (item.category === category) {
          // Verifica se o name selecionado já está presente no array name do objeto com a categoria selecionada;
          if (item.name.includes(name)) {
            // Se já existir esse name, ele é removido do array;
            const updatedName = item.name.filter((itemName: string) => itemName !== name);
            // Se o name removido for o ultimo do array, retornamos um valor null para posteriormente remover todo o objeto da categoria correspondente;
            if (updatedName.length === 0) {
              return null; // Retorna null para filtrar o objeto do array
            } else {
              // Se não for o ultimo, então retornamos um novo array name com o novo name selecionado;
              return {
                ...item,
                name: updatedName
              };
            }
          } else {
            // Se não houver o name no array retornamos um novo array name com o novo name selecionado;
            return {
              ...item,
              name: [...item.name, name]
            };
          }
        }
        return item;
        // O filter remove os objetos que tenham retoornado null no map acima para removê-los de updatedLocation;
      }).filter(Boolean) as ILocation[];
      setLocation(updatedLocation);
      // Caso a opção selecionada pertença a uma categoria ainda não inserida em location, apenas é inserido um objeto com o name e category selecionados;
    } else {
      setLocation([...location, { name: [name], category }]);
    }
  };

  useEffect(() => {
    let locationParam;
    if(query.location){
      const locationParamString = query.location.toString()
      locationParam = JSON.parse(locationParamString);
    }

    if(locationParam){
      setInitialLocation([...location, {name: locationParam[0].name, category: locationParam[0].category}])
    }
  }, []);

  // Insere e remove as opções selecionadas de location nos parâmetros da URL;
  useEffect(() => {
    // Atualizar os parâmetros da URL
    if (location.length < 1) {
      if(!query.location?.includes('todos')){
        removeQueryParam('location');
      }
    } else {

      const translatedLocations: { category: string; name: string[] }[] = [];

      location.forEach((loc) => {
        if (!allLocations) {
          const { name, category } = loc;
          const formattedCategory = categoryMappings[category] || category;
          const existingLocation = translatedLocations.find((item) => item.category === formattedCategory);
          if (existingLocation) {
            existingLocation.name.push(...name);
          } else {
            translatedLocations.push({ category: formattedCategory, name });
          }
        }
      })

      const queryParams = { ...query, location: JSON.stringify([...translatedLocations]), page: 1 };
      router.push({ query: queryParams }, undefined, { scroll: false });
    }
  }, [location, query.location]);

  //// METADATA ////

  // Lida com a inserção e remoção do parametro na url;
  useEffect(() => {
    // Verifica se essa é a primeira renderização, se for, não executa automaticamente a função removeQueryParams, o que impede que os parametros da URL sofram uma atualização e assim não realizando uma nova requisição duplicada na primeira renderização da página;
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    if(bedrooms > 0){
      const queryParams = { ...router.query, bedroom: bedrooms };
      router.push(
        { query: queryParams }, 
        undefined, 
        { scroll: false}
      );
    } else{
      removeQueryParam('bedroom')
    }
  }, [bedrooms]);

  // Lida com a inserção e remoção do parametro na url;
  useEffect(() => {
    // Verifica se essa é a primeira renderização, se for, não executa automaticamente a função removeQueryParams, o que impede que os parametros da URL sofram uma atualização e assim não realizando uma nova requisição duplicada na primeira renderização da página;
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    if(bathrooms > 0){
      const queryParams = { ...router.query, bathroom: bathrooms };
      router.push(
        { query: queryParams }, 
        undefined, 
        { scroll: false}
      );
    } else{
      removeQueryParam('bathroom')
    }
  }, [bathrooms]);

  // Lida com a inserção e remoção do parametro na url;
  useEffect(() => {
    // Verifica se essa é a primeira renderização, se for, não executa automaticamente a função removeQueryParams, o que impede que os parametros da URL sofram uma atualização e assim não realizando uma nova requisição duplicada na primeira renderização da página;
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    if(parkingSpaces > 0){
      const queryParams = { ...router.query, parkingSpaces: parkingSpaces };
      router.push(
        { query: queryParams }, 
        undefined, 
        { scroll: false}
      );
    } else{
      removeQueryParam('parkingSpaces')
    }
  }, [parkingSpaces]);
  
  // Lida com o comportamento do estilo de seleção dos checkboxes dependendo do valor vindo dos parametros daurl;
  useEffect(() => {
    setBedrooms(parseInt(
      query.bedroom !== undefined 
      ? query.bedroom.toString() 
      : '0'
      )
    )

    setBathrooms(parseInt(
      query.bathroom !== undefined 
      ? query.bathroom.toString() 
      : '0'
      )
    )

    setParkingSpaces(parseInt(
      query.parkingSpaces !== undefined 
      ? query.parkingSpaces.toString() 
      : '0'
      )
    )
  }, [query]);

  //// TAGS ////

  // Insere e remove as tags clicadas nos parâmetros da URL;
  const toggleSelection = (item: string) => {
    const tags: string[] = Array.isArray(query.tags) ? query.tags : query.tags ? query.tags.split(',') : [];
  
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
        {scroll: false}
      );
    } else {
      const { tags, ...updatedQuery } = query;
      // Faz com que o parametro page volte a ser 1 quando o parametro tags é removido da url;
      updatedQuery.page = "1";
      router.push(
        {
          pathname: router.pathname,
          query: updatedQuery,
        }, 
        undefined, 
        {scroll: false}
      );
    }
  };

  //// FILTER BOX ON MOBILE ////

  // Mobile: Envia a informação de que o botão de fechar os filtros foi clicado;
  useEffect(() => {
    if(!mobileFilterIsOpen){
      onMobileFilterIsOpenChange(false)
    }
  }, [mobileFilterIsOpen]);

  // Mobile: se o filtro for aberto no componente de atalhos esse efeito recebe a informação emuda o valor do estado que contra a abertura do compnente de filtros;
  useEffect(() => {
    setMobileFilterIsOpen(mobileFilterIsOpenProp);
  }, [mobileFilterIsOpenProp])

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

  //// PRICES ////

  const maskedPrice = (value: string) => {
    let price = value;
    price = price.replace(/\D/g, '');
    price = price.replace(/(\d)(\d{2})$/, '$1,$2');
    price = price.replace(/(?=(\d{3})+(\D))\B/g, '.');
    return price;
  };

  // As funções abaixo lidam com a remoção da máscara para inserção do valor nos parâmetros da url para que sejam usados na busca;
  useEffect(() => {
    // Verifica se essa é a primeira renderização, se for, não executa automaticamente a função removeQueryParams, o que impede que os parametros da URL sofram uma atualização e assim não realizando uma nova requisição duplicada na primeira renderização da página;
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    const formatMinPrice = minPrice.replace(/\./g, '').replace(/,(\d{2})$/, '.$1');
    if(minPrice.length !== 0 || minPrice !== ''){
      const minPriceQueryParams = { ...query, minPrice: formatMinPrice };
      router.push(
        { query: minPriceQueryParams}, 
        undefined, 
        {scroll: false}
      );
    } else {
      removeQueryParam('minPrice');
    }
  }, [minPrice]);

  useEffect(() => {
    // Verifica se essa é a primeira renderização, se for, não executa automaticamente a função removeQueryParams, o que impede que os parametros da URL sofram uma atualização e assim não realizando uma nova requisição duplicada na primeira renderização da página;
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    const formatMaxPrice = maxPrice.replace(/\./g, '').replace(/,(\d{2})$/, '.$1');
    if(maxPrice.length !== 0 || maxPrice !== ''){
      const maxPriceQueryParams = { ...query, maxPrice: formatMaxPrice, page: 1 };
      router.push(
        { query: maxPriceQueryParams}, 
        undefined, 
        {scroll: false}
      );
    } else {
      removeQueryParam('maxPrice')
    }
  }, [maxPrice]);

  useEffect(() => {
    // Verifica se essa é a primeira renderização, se for, não executa automaticamente a função removeQueryParams, o que impede que os parametros da URL sofram uma atualização e assim não realizando uma nova requisição duplicada na primeira renderização da página;
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    const formatMinCondominium = minCondominium.replace(/\./g, '').replace(/,(\d{2})$/, '.$1');
    if(minCondominium.length !== 0 || minCondominium !== ''){
      const minCondominiumQueryParams = { ...query, minCondominium: formatMinCondominium, page: 1 };
      router.push(
        { query: minCondominiumQueryParams}, 
        undefined, 
        {scroll: false}
      );
    } else {
      removeQueryParam('minCondominium')
    }
  }, [minCondominium]);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    
    const formatMaxCondominium = maxCondominium.replace(/\./g, '').replace(/,(\d{2})$/, '.$1');
    if(maxCondominium.length !== 0 || maxCondominium !== ''){
      const maxCondominiumQueryParams = { ...query, maxCondominium: formatMaxCondominium, page: 1 };
      router.push(
        { query: maxCondominiumQueryParams}, 
        undefined, 
        {scroll: false}
      );
    } else {
      removeQueryParam('maxCondominium')
    }
  }, [maxCondominium]);

  //// FUNCTIONALITIES ////

  // Remove parametros da URL da query e faz o refresh para que seja feita uma nova requisição a partir da url atualizada;
  const removeQueryParam = (param: string) => {
    const { pathname } = router;
    const params = new URLSearchParams(stringify(query));
    params.delete(param);
    params.set('page', '1');
    router.replace(
      { pathname, query: params.toString() },
      undefined, 
      { shallow: false, scroll: false }
    );
  };

  return (
    <div 
      className={`lg:block max-w-[403px] h-fit bg-tertiary shadow-md rounded-[30px] px-2 md:px-5 md:py-8 pt-8 pb-2 md:ml-7 mt-12 ${
        !mobileFilterIsOpen ?
        'hidden' :
        ''
      }`}
    >
      {mobileFilterIsOpen && (
        <div
          className="flex flex-col sticky top-0 z-10"
        >
          <div className="sticky z-[100] bg-tertiary flex flex-row items-center justify-between px-6 py-6">
            <h1 className="font-semibold text-quaternary text-4xl z-[100]">
              Filtros
            </h1>
            <button onClick={() => setMobileFilterIsOpen(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="40"
                viewBox="0 96 960 960"
                width="40"
                fill="#F75D5F"
              >
                <path d="m251.333 851.333-46.666-46.666L433.334 576 204.667 347.333l46.666-46.666L480 529.334l228.667-228.667 46.666 46.666L526.666 576l228.667 228.667-46.666 46.666L480 622.666 251.333 851.333Z" />
              </svg>
            </button>
          </div>
          <div className="border border-b-quaternary/30 mb-9 z-[100]" />
        </div>
      )}

      {/* Basic info */}
      <div>
        <h3 className="font-normal text-base text-quaternary leading-[19px] mb-2 ">
          O que procura?
        </h3>
        <div className="flex flex-row rounded-full border border-quaternary mb-6 h-9 max-w-[354px]">
          <div>
            <button className={buyBtnClassName} onClick={handleBuy}>
              Comprar
            </button>
          </div>
          <div>
            <button className={rentBtnClassName} onClick={handleRent}>
              Alugar
            </button>
          </div>
        </div>

        <div className='relative'>
          <div className="my-5">
            <label className='"font-normal text-base text-quaternary leading-[19px] mb-2"'>Qual o tipo do imóvel?</label>
            <div
              className="flex flex-row items-center justify-between cursor-pointer bg-tertiary md:w-[360px] h-[44px] font-normal text-sm md:text-base text-quaternary leading-5 shadow-lg p-3 border border-quaternary rounded-xl mt-2"
              ref={ref}
              onClick={() => setOpen(!open)}
            >
              <p>{propertyType?.length > 0 ? propertyType[propertyType.length - 1] : 'Todos'}</p>
              <ArrowDownIconcon 
                width="15" 
                height="15" 
                className={`my-auto ${
                  open
                  ? 'transform rotate-180 transition-transform duration-300 ease-in-out'
                  : 'transition-transform duration-300 ease-in-out'
                }`}
              />
            </div>
            <div
              className={`absolute z-50 w-full h-fit rounded-xl bg-tertiary overflow-hidden cursor-pointer shadow-md ${
                open ? 'md:flex' : 'hidden'
              }`}
            >
              <div 
                className="flex flex-col w-full text-center font-normal text-base text-quaternary leading-5"
              >
                <div 
                  className='flex rounded-t-xl hover:bg-quaternary hover:text-tertiary'
                  onClick={() => togglePropertyTypeSelection('todos')}
                >
                  <div 
                    className="w-[20px] h-[20px] shrink-0 my-auto border border-quaternary rounded-[3px] bg-tertiary m-2"
                  >
                    {propertyType.includes('todos') && (
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

                {propertyTypesProp ? (
                  propertyTypesProp?.map(
                    (
                      {
                        _id,
                        name, 
                      }: IPropertyTypes, 
                      index: number
                    ) => (
                      <div 
                        key={index}
                        className='flex hover:bg-quaternary hover:text-tertiary'
                        onClick={() => togglePropertyTypeSelection(name)}
                      >
                        <div 
                          className="w-[20px] h-[20px] shrink-0 my-auto border border-quaternary rounded-[3px] bg-tertiary m-2"
                        >
                          {(propertyType.includes(name) || propertyType[0] === 'todos') && (
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
                          key={_id}
                          className="translate-x-[1px] w-full h-[50px]  py-3"
                        >
                          {name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}
                        </span>
                      </div>
                    )
                  )
                ) : []}

              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col my-5">
          <label className="font-normal text-base text-quaternary leading-[19px] mb-2">Onde?</label>
          <input
            className="bg-transparent w-full font-normal text-base text-quaternary leading-[19px] shadow-lg p-3 border border-quaternary rounded-xl outline-none"
            placeholder="Digite um bairro, cidade, rua..."
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const value = event.target.value;
              setLocationInput(value !== 'todos' ? value : '');
              filterLocation(value);
              setOpenLocationDropdown(value !== '' && locationInput.length > 1 ? true : false)
            }}
            value={locationInput}
            // value={location.length > 0
            //   ? location[0].name[0]
            //   : locationInput
            // }
          />
          <div
            className={`z-50 w-full h-fit rounded-xl bg-tertiary overflow-hidden cursor-pointer shadow-md ${
              openLocationDropdown ? 'md:flex' : 'hidden'
            }`}
            ref={ref}
          >
            <div className="flex flex-col w-full text-center font-normal text-base text-quaternary leading-5" >
              <div
                className='flex rounded-t-xl hover:bg-quaternary hover:text-tertiary'
                onClick={() => {
                  setAllLocations(!allLocations)
                  setLocation([])
                } }
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

              {Object.entries(categorizedLocations).map(([category, locations]) => (
                <div key={category} className="w-full py-2 h-fit">
                  <h3 className="font-bold text-xl ml-[20px]">{category}</h3>
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
                            <div 
                              className="w-[20px] h-[20px] shrink-0 my-auto border border-quaternary rounded-[3px] bg-tertiary"
                            >
                              {(location.some(obj => obj.name.includes(option)) || allLocations) && (
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
                              {option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()}
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
                            {(location.some(obj => obj.name.includes(name)) || allLocations) && (
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
                            {name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>

      {/* Characteristics */}
      <div>
        <h3 className="font-normal text-base text-quaternary leading-[19px] my-2">
          Preço
        </h3>
        <div className="flex flex-row">
          <input
            value={maskedPrice(minPrice)}
            placeholder='Min.'
            className={
              'bg-transparent outline-none w-full font-normal text-base text-quaternary leading-[19px] mb-11 shadow-lg p-3 border border-quaternary rounded-xl'
            }
            onChange={(e) =>
              setMinPrice(maskedPrice(e.target.value))
            }
          />
          <span className="px-3 md:px-6 mt-2 text-quaternary">a</span>
          <input
            value={maskedPrice(maxPrice)}
            placeholder='Max.'
            className={
              'bg-transparent outline-none w-full font-normal text-base text-quaternary leading-[19px] mb-11 shadow-lg p-3 border border-quaternary rounded-xl'
            }
            onChange={(e) =>
              setMaxPrice(maskedPrice(e.target.value))
            }
          />
        </div>

        <h3 className="font-normal text-base text-quaternary leading-[19px] mb-2">
          Condomínio
        </h3>
        <div className="flex flex-row">
          <input
            value={maskedPrice(minCondominium)}
            placeholder='Min.'
            className={
              'bg-transparent outline-none w-full font-normal text-base text-quaternary leading-[19px] mb-11 shadow-lg p-3 border border-quaternary rounded-xl'
            }
            onChange={(e) =>
              setMinCondominium(maskedPrice(e.target.value))
            }
          />
          <span className="px-3 md:px-6 mt-2 text-quaternary">a</span>
          <input
            value={maskedPrice(maxCondominium)}
            placeholder='Max.'
            className={
              'bg-transparent outline-none w-full font-normal text-base text-quaternary leading-[19px] mb-11 shadow-lg p-3 border border-quaternary rounded-xl'
            }
            onChange={(e) =>
              setMaxCondominium(maskedPrice(e.target.value))
            }
          />
        </div>

        <h3 className="font-normal text-base text-quaternary leading-[19px] mb-2">
          Quartos
        </h3>
        <div>
          <button
            className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-11 shadow-lg p-3 border border-quaternary rounded-xl mr-14 hover:bg-secondary hover:text-tertiary hover:border-secondary"
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
            className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-11 shadow-lg p-3 border border-quaternary rounded-xl mr-14 hover:bg-secondary hover:text-tertiary hover:border-secondary"
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
            className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-11 shadow-lg p-3 border border-quaternary rounded-xl mr-14 hover:bg-secondary hover:text-tertiary hover:border-secondary"
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
            className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-11 shadow-lg p-3 border border-quaternary rounded-xl hover:bg-secondary hover:text-tertiary hover:border-secondary"
            onClick={() => {
              setBedrooms(bedrooms != 4 ? 4 : 0);
            } }
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

        <h3 className="font-normal text-base text-quaternary leading-[19px] mb-2">
          Banheiros
        </h3>
        <div>
          <button
            className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-11 shadow-lg p-3 border border-quaternary rounded-xl mr-14 hover:bg-secondary hover:text-tertiary hover:border-secondary"
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
            className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-11 shadow-lg p-3 border border-quaternary rounded-xl mr-14 hover:bg-secondary hover:text-tertiary hover:border-secondary"
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
            className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-11 shadow-lg p-3 border border-quaternary rounded-xl mr-14 hover:bg-secondary hover:text-tertiary hover:border-secondary"
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
            className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-11 shadow-lg p-3 border border-quaternary rounded-xl hover:bg-secondary hover:text-tertiary hover:border-secondary"
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

        <h3 className="font-normal text-base text-quaternary leading-[19px] mb-2">
          Vagas de garagem
        </h3>
        <div>
          <button
            className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-11 shadow-lg p-3 border border-quaternary rounded-xl mr-14 hover:bg-secondary hover:text-tertiary hover:border-secondary"
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
            className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-11 shadow-lg p-3 border border-quaternary rounded-xl mr-14 hover:bg-secondary hover:text-tertiary hover:border-secondary"
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
            className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-11 shadow-lg p-3 border border-quaternary rounded-xl mr-14 hover:bg-secondary hover:text-tertiary hover:border-secondary"
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
            className="cursor-pointer bg-transparent max-w-[66px] font-normal text-base text-quaternary leading-[19px] mb-11 shadow-lg p-3 border border-quaternary rounded-xl hover:bg-secondary hover:text-tertiary hover:border-secondary"
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

        <div className="border border-b-quaternary mb-9" />

        {/* Other filters */}
        <div>
          <h3 className="font-normal text-base text-quaternary leading-[19px] mb-3">
            Outros filtros
          </h3>

          {tagsData?.length > 0 ? tagsData?.map(({
            name,
            amount
          }) => (
            <div className="flex flex-row items-center mb-3" key={name}>
              <div
                id={name}
                className={`w-[20px] h-[20px] border border-quaternary rounded-[3px] bg-tertiary ${
                  query.tags?.includes(name)
                    ? 'border-yellow-500' // estilo de clique
                    : '' // estilo normal
                }`}
                onClick={() => toggleSelection(name)}
              >
                {query.tags?.includes(name) && (
                  <CheckIcon
                    width="20"
                    height="20"
                    fill="#F5BF5D"
                    viewBox="40 126 960 960"
                  />
                )}
              </div>
              <h3 className="font-normal text-base text-quaternary leading-[19px] ml-3">
                {name} ({amount})
              </h3>
            </div>
          )) : (
            <div>
              <p className="font-normal text-base text-quaternary leading-[19px] mb-3">Houve um problema ao buscar os filtros</p>
            </div>
          )}

          <div className="border border-b-quaternary my-9" />
        </div>

        {/* Search by code */}
        <div>
          <h3 className="font-normal text-base text-quaternary leading-[19px] mb-3">
            Buscar imóvel por código
          </h3>
          <div className='flex gap-3'>
            <input
              placeholder="Digite o código..."
              className="bg-transparent w-full font-normal text-base text-quaternary leading-[19px] mb-1 shadow-lg p-3 border border-quaternary rounded-xl outline-none"
              value={codeToSearch}
              onChange={(e) => setCodeToSearch(e.target.value)}
            />
            <div 
              className="bg-secondary shadow-lg border border-quaternary rounded-xl outline-none px-2 mb-1 cursor-pointer hover:bg-primary active:bg-primary transition-colors"
              onClick={() => {
                const queryParams = { ...router.query, code: codeToSearch };
                router.push({ query: queryParams });
              } }
            >
              <SearchIcon
                fill='#F7F7F6'
                width='30'
              />
            </div>
          </div>
        </div>
        
        {mobileFilterIsOpen && isMobileProp && (
          <div className="bg-tertiary sticky z-10 bottom-0 flex flex-row items-center justify-between mt-2 p-4 w-full">
            <h3 className="text-primary text-lg font-bold">Remover filtros</h3>
            <button 
              className="bg-primary rounded-[30px] p-2 text-tertiary text-lg font-extrabold"
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