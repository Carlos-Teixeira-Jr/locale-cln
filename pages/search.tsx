import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { ILocation } from '../common/interfaces/locationDropdown';
import { IData } from '../common/interfaces/property/propertyData';
import { IPropertyTypes } from '../common/interfaces/property/propertyTypes';
import { ITagsData } from '../common/interfaces/tagsData';
import DropdownOrderBy from '../components/atoms/dropdowns/dropdownOrderBy';
import ArrowDropdownIcon from '../components/atoms/icons/arrowDropdownIcon';
import CloseIcon from '../components/atoms/icons/closeIcon';
import GridIcon from '../components/atoms/icons/gridIcon';
import ListIcon from '../components/atoms/icons/listIcon';
import LocationIcon from '../components/atoms/icons/location';
import Pagination from '../components/atoms/pagination/pagination';
import PropertyInfoCard from '../components/molecules/cards/PropertyInfoCard/PropertyInfoCard';
import PropertyCard from '../components/molecules/cards/propertyCard/PropertyCard';
import FilterList from '../components/molecules/filterList/FilterList';
import SearchShortcut from '../components/molecules/searchShortcut/searchShortcut';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';
import useTrackLocation from '../hooks/trackLocation';
import { useIsMobile } from '../hooks/useIsMobile';
import { NextPageWithLayout } from './page';

export interface IPropertyInfo {
  docs: IData[];
  page: number;
  totalCount: number;
  totalPages: number;
}

export interface ISearch {
  propertyInfo: IPropertyInfo;
  propertyTypes: IPropertyTypes[];
  locations: ILocation[];
  tagsData: ITagsData[];
}

const Search: NextPageWithLayout<ISearch> = ({
  propertyInfo,
  propertyTypes,
  locations,
  tagsData,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const query = router.query;

  // userLocation
  const { latitude, longitude, location } = useTrackLocation();
  // mobile
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const [mobileFilterIsOpen, setMobileFilterIsOpen] = useState<boolean>(false);
  const [isSearchBtnClicked, setIsSearchBtnClicked] = useState(false);
  // grid or list
  const [grid, setGrid] = useState(false);
  const [list, setList] = useState(true);

  //// FILTER ON MOBILE ////

  // Mobile: quando os filtros são abertos no componente de atalhos essa função recebe essa informação e altera o valor de mobileFilterIsOpen para enviar esse valor para o componente de filtragem para que o mesmo seja aberto;
  const handleMobileFilterIsOpen = (isOpen: boolean) => {
    setMobileFilterIsOpen(isOpen);
  };

  //Mobile: Quando os filtros são fechados no componente de filtragem essa função é ativada e muda o valor do estado que controla a abertura dos filtros para false;
  const handleMobileFilterClose = (isClosed: boolean) => {
    setMobileFilterIsOpen(isClosed);
  };

  // Lida com o botão de 'buscar' do filtro quando aberto no mobile;
  const handleFilterSearchBtn = () => {
    setIsSearchBtnClicked(true);
  };

  useEffect(() => {
    if (isSearchBtnClicked) {
      setMobileFilterIsOpen(false);
      setIsSearchBtnClicked(false);
    }
  }, [isSearchBtnClicked]);

  //// DROPDOWN ////

  // Lida com o comportamento de fechamento do dropdown de endereço quando há um clique fora do elemento;
  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
    function handleClick(event: MouseEvent) {
      if (ref && ref.current) {
        const myRef = ref.current;
        if (!myRef.contains(event.target as Node)) {
          setOpen(false);
        }
      }
    }
  });

  //// CARDS VISUALIZATION MODE ////

  const handleGrid = () => {
    setList(false);
    setGrid(true);
  };

  const handleList = () => {
    setList(true);
    setGrid(false);
  };

  //// GEOLOCATION ////

  // Insere a latitude e longitude do usuário nos parametros da URL quando esteliberar a geolocalização;
  useEffect(() => {
    if (latitude && longitude) {
      const queryParams = { ...query, latitude, longitude };
      router.push({ query: queryParams }, undefined, { scroll: false });
    }
  }, [latitude, longitude, query, router]);

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center mt-16">
        <div className="lg:flex justify-center max-w-[1232px]">
          <div className="flex flex-col md:flex-row mt-[-16px] md:mt-0">
            <div className="mx-auto">
              <FilterList
                propertyTypesProp={propertyTypes}
                locationProp={locations}
                tagsProp={tagsData}
                mobileFilterIsOpenProp={mobileFilterIsOpen}
                isMobileProp={isMobile}
                onMobileFilterIsOpenChange={handleMobileFilterClose}
                onSearchBtnClick={handleFilterSearchBtn}
              />
            </div>

            <div className="flex flex-col">
              <div
                className={`${
                  mobileFilterIsOpen ? 'hidden' : ''
                } md:hidden lg:visible xl:visible`}
              >
                <SearchShortcut
                  onMobileFilterIsOpenChange={handleMobileFilterIsOpen}
                />
              </div>

              <div className="flex flex-row items-center justify-evenly px-26 mt-2 md:mt-0 mr-0">
                <h3 className="text-quaternary text-sm md:text-base leading-5 font-extrabold text-justify -ml-2">
                  {propertyInfo.totalCount} Imóveis encontrados com base na
                  pesquisa
                </h3>
                {/* SearchView - start*/}
                <div className="flex flex-row justify-around items-center gap-8">
                  {!isMobile && (
                    <div className="flex flex-row items-center gap-1 mr-[-30px]">
                      <button
                        onClick={handleList}
                        className={`w-[47px] h-[44px] border border-[#6B7280] rounded-[10px] ${
                          list && 'border-[#F5BF5D] shadow-inner'
                        }`}
                      >
                        <ListIcon list={list} />
                      </button>
                      <button
                        onClick={handleGrid}
                        className={`w-[47px] h-[44px] border border-[#6B7280] rounded-[10px] ${
                          grid && 'border-[#F5BF5D] shadow-inner'
                        }`}
                      >
                        <GridIcon grid={grid} />
                      </button>
                    </div>
                  )}

                  {/* SearchView - end*/}
                  {!isMobile && (
                    <div ref={ref} onClick={() => setOpen(!open)}>
                      <div className="flex flex-row items-center justify-around cursor-pointer mb-6 bg-tertiary sm:max-w-[188px] md:w-[188px] h-[44px] font-bold text-sm md:text-lg text-quaternary leading-5 shadow-lg p-[10px] border border-quaternary rounded-[30px] mt-7 md:mr-4 ml-2">
                        <span>Ordenar Por</span>
                        <span>
                          <ArrowDropdownIcon />
                        </span>
                      </div>
                      {open && <DropdownOrderBy />}
                    </div>
                  )}
                </div>
              </div>

              {!mobileFilterIsOpen &&
                propertyInfo.docs &&
                propertyInfo.docs.length > 0 && (
                  <div className="mx-auto mb-5">
                    <Pagination totalPages={propertyInfo.totalPages} />
                  </div>
                )}

              {propertyInfo?.docs?.length === 0 && (
                <div className="flex flex-col mt-5">
                  <h2 className="text-quaternary text-sm md:text-base lg:text-2xl leading-5 font-bold md:ml-4 text-justify px-5">
                    Oops! Não encontramos nenhum resultado para essa busca.
                  </h2>
                  <div className="flex flex-col mx-auto justify-center my-5 md:my-10">
                    <LocationIcon width="100" height="100" fill="#F75D5F" />
                    <CloseIcon
                      fill="red"
                      width="100"
                      height="100"
                      className="ml-1"
                    />
                  </div>
                  <h2 className="text-quaternary text-sm md:text-base lg:text-2xl leading-5 font-bold md:ml-4 text-justify px-5">
                    Você pode tentar remover alguns filtros para tentar
                    encontrar algum resultado.
                  </h2>
                </div>
              )}

              {!propertyInfo.docs && (
                <div className="flex flex-col mt-5">
                  <h2 className="text-quaternary text-sm md:text-base lg:text-2xl leading-5 font-bold md:ml-4 text-justify px-5">
                    Oops! Não encontramos nenhum imóvel referente ao código
                    informado.
                  </h2>
                  <div className="flex flex-col mx-auto justify-center my-5 md:my-10">
                    <LocationIcon width="100" height="100" fill="#F75D5F" />
                    <CloseIcon
                      fill="red"
                      width="100"
                      height="100"
                      className="ml-1"
                    />
                  </div>
                  <h2 className="text-quaternary text-sm md:text-base lg:text-2xl leading-5 font-bold md:ml-4 text-justify px-5">
                    Verifique se o código está correto e tente novamente.
                  </h2>
                </div>
              )}

              {grid ? (
                <div
                  className={`sm:grid sm:grid-cols-1 md:grid md:grid-cols-2  justify-center gap-9 mx-14 ${
                    mobileFilterIsOpen ? 'hidden' : ''
                  }`}
                >
                  {propertyInfo.docs &&
                    propertyInfo?.docs.map(
                      ({
                        _id,
                        prices,
                        description,
                        address,
                        images,
                        metadata,
                        highlighted,
                      }: IData) => (
                        <PropertyCard
                          key={_id}
                          prices={prices}
                          description={description}
                          images={images}
                          location={address.streetName}
                          bedrooms={metadata[0].amount}
                          bathrooms={metadata[1].amount}
                          parking_spaces={metadata[2].amount}
                          id={_id}
                          highlighted={highlighted}
                        />
                      )
                    )}
                </div>
              ) : (
                <div
                  className={`lg:float-right${
                    mobileFilterIsOpen ? 'hidden' : ''
                  }`}
                >
                  {propertyInfo?.docs.map(
                    ({
                      _id,
                      prices,
                      description,
                      address,
                      images,
                      metadata,
                      highlighted,
                    }: IData) => (
                      <PropertyInfoCard
                        _id={_id}
                        key={_id}
                        href={`/property/${_id}`}
                        prices={prices[0].value.toString()}
                        description={description}
                        images={images}
                        location={address.streetName}
                        bedrooms={metadata[0].amount}
                        bathrooms={metadata[1].amount}
                        parking_spaces={metadata[2].amount}
                        highlighted={highlighted}
                      />
                    )
                  )}
                </div>
              )}

              {!mobileFilterIsOpen &&
                propertyInfo.docs &&
                propertyInfo.docs.length > 0 && (
                  <div className="mx-auto mt-5">
                    <Pagination totalPages={propertyInfo.totalPages} />
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
      <Footer smallPage={false} />
    </div>
  );
};

export default Search;

export async function getServerSideProps(context: NextPageContext) {
  const { query } = context;

  const filter = [];

  if (query.adType) {
    filter.push({ adType: query.adType });
  }

  if (query.propertyType) {
    const propertyType = query.propertyType.toString();
    const parsedPropertyType = JSON.parse(propertyType);
    if (parsedPropertyType !== 'todos') {
      filter.push({ propertyType: parsedPropertyType });
    }
  }

  if (query.tags) {
    filter.push({ tags: query.tags });
  }

  if (query.minSize) {
    filter.push({ minSize: query.minSize });
  }

  if (query.minPrice) {
    filter.push({ minPrice: query.minPrice });
  }

  if (query.maxPrice) {
    filter.push({ maxPrice: query.maxPrice });
  }

  if (query.minCondominium) {
    filter.push({ minCondominium: query.minCondominium });
  }

  if (query.maxCondominium) {
    filter.push({ maxCondominium: query.maxCondominium });
  }
  if (query.bedroom) {
    filter.push({ bedroom: query.bedroom });
  }
  if (query.bathroom) {
    filter.push({ bathroom: query.bathroom });
  }
  if (query.parkingSpaces) {
    filter.push({ parkingSpaces: query.parkingSpaces });
  }
  if (query.location) {
    const location = query.location.toString();
    if (location !== 'todos' && query.location !== 'todos') {
      const parsedLocation = JSON.parse(location);
      filter.push({ locationFilter: parsedLocation });
    }
  }
  if (query.latitude && query.longitude) {
    const formattedGeolocation = {
      latitude: query.latitude,
      longitude: query.longitude,
    };
    filter.push({ geolocation: formattedGeolocation });
  }

  const encodedFilter = decodeURIComponent(JSON.stringify(filter));

  //// SORT ////
  let encodedSort;
  if (query.sort !== '') {
    if (query.sort === 'mostRecent') {
      encodedSort = encodeURIComponent(JSON.stringify([{ createdAt: -1 }]));
    }
    if (query.sort === 'lowestPrice') {
      encodedSort = encodeURIComponent(
        JSON.stringify([{ 'prices.0.value': 1 }])
      );
    }
    if (query.sort === 'biggestPrice') {
      encodedSort = encodeURIComponent(
        JSON.stringify([{ 'prices.0.value': -1 }])
      );
    }
  }

  //// OTHER FETCHES ////
  const propertyTypes = await fetch('http://localhost:3001/property-type')
    .then((res) => res.json())
    .catch(() => ({}));

  const locations = await fetch('http://localhost:3001/location')
    .then((res) => res.json())
    .catch(() => ({}));

  const tagsData = await fetch('http://localhost:3001/tag')
    .then((res) => res.json())
    .catch(() => ({}));

  let propertyInfo;
  let currentPage = query.page;

  if (query.code) {
    try {
      const url = `http://localhost:3001/property/announcementCode/${query.code}`;

      propertyInfo = await fetch(url)
        .then((res) => res.json())
        .catch(() => ({}));
    } catch (error) {
      throw new Error(
        `Não foi possível buscar o imóvel com o código: ${query.code}`
      );
    }
  } else {
    const url = `http://localhost:3001/property/filter/?page=${currentPage}&limit=5&filter=${encodedFilter}${
      encodedSort ? `&sort=${encodedSort}` : ``
    }&need_count=true`;
    propertyInfo = await fetch(url).then((res) => res.json());
  }

  return {
    props: {
      propertyInfo,
      propertyTypes,
      locations,
      tagsData,
    },
  };
}
