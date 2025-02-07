import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { ILocation } from '../common/interfaces/locationDropdown';
import { IOwnerProperties } from '../common/interfaces/properties/propertiesList';
import { IData } from '../common/interfaces/property/propertyData';
import { ITagsData } from '../common/interfaces/tagsData';
import { isCardVisualized } from '../common/utils/actions/isCardVisualized';
import { saveVisualizedCards } from '../common/utils/actions/saveVisualizedCards';
import { handleClickOutside } from '../common/utils/clickOutsideDropdownHandler';
import updateGeolocationQueryParam from '../common/utils/search/updateGeolocationQueryParam';
import updateLocationQueryParam from '../common/utils/search/updateLocationQueryParam';
import DropdownOrderBy from '../components/atoms/dropdowns/dropdownOrderBy';
import ArrowDropdownIcon from '../components/atoms/icons/arrowDropdownIcon';
import GridIcon from '../components/atoms/icons/gridIcon';
import ListIcon from '../components/atoms/icons/listIcon';
import Pagination from '../components/atoms/pagination/pagination';
import { PropertyCard, PropertyInfoCard } from '../components/molecules/cards';
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

const defaultOwnerProperties: IOwnerProperties = {
  docs: [],
  count: 0,
  totalPages: 0,
  messages: []
};

export interface ISearch {
  propertyInfo: IPropertyInfo;
  locations: ILocation[];
  tagsData: ITagsData[];
  ownerProperties: IOwnerProperties
}

const Search: NextPageWithLayout<ISearch> = ({
  propertyInfo,
  locations,
  tagsData,
  ownerProperties = defaultOwnerProperties
}) => {

  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const query = router.query as any;
  const isOwner = ownerProperties?.docs.length > 0;
  const [currentPage, setCurrentPage] = useState(1);
  const isCodeSearch = query.code ? true : false;
  const { latitude, longitude, location: geolocation } = useTrackLocation();

  const defaultPropertyPhoto = "/images/property-not-found.png";

  // mobile
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const [mobileFilterIsOpen, setMobileFilterIsOpen] = useState<boolean>(false);
  const [isSearchBtnClicked, setIsSearchBtnClicked] = useState(false);
  const [grid, setGrid] = useState(false);
  const [list, setList] = useState(true);
  const queryParsed = query.location ? JSON.parse(query.location) : [];
  const [location, setLocation] = useState<any>(queryParsed);
  const [isAlreadyClicked, setIsAlreadyClicked] = useState<null | boolean>(null);
  const [params, setParams] = useState('');

  useEffect(() => {
    updateLocationQueryParam(location, query, router);
  }, [location]);

  useEffect(() => {
    if (router.query.page !== undefined && typeof query.page === 'string') {
      const parsedPage = parseInt(query.page);
      setCurrentPage(parsedPage);
    }
  });

  const handleCardClick = (id: string, params: string) => {
    const alreadyClicked = isCardVisualized(id);
    if (!alreadyClicked) {
      saveVisualizedCards(id);
    }
    setIsAlreadyClicked(alreadyClicked);
    setParams(params);
  };

  // Insere a flag de incrementação de visualizações do imóvel na url;
  useEffect(() => {
    let newParams;
    if (isAlreadyClicked !== null) {
      const firstSubstring = params.split('increment=')[0];
      const lastSubstring = params.split('increment=')[1];
      newParams = firstSubstring + `increment=${!isAlreadyClicked}` + lastSubstring
      router.push(`/property/${newParams}`)
    }
  }, [isAlreadyClicked, params]);

  useEffect(() => {
    const pageQueryParam =
      router.query.page !== undefined && typeof query.page === 'string'
        ? parseInt(query.page)
        : 1;

    if (pageQueryParam !== currentPage) {
      const queryParams = {
        ...query,
        page: currentPage,
      };
      router.push({ query: queryParams }, undefined, { scroll: false });
    }
  }, [currentPage]);

  //// GEOLOCATION SEARCH ////

  // Insere as coordenadas geográficas do usuário na url para buscar os imóveis mais próximos
  useEffect(() => {
    const isFirstRender = true;
    if (isFirstRender) {
      setTimeout(() => {
        updateGeolocationQueryParam(geolocation, router, latitude, longitude);
      }, 2000);
    }
  }, [geolocation]);

  //// FILTER ON MOBILE ////

  useEffect(() => {
    if (isSearchBtnClicked) {
      setMobileFilterIsOpen(false);
      setIsSearchBtnClicked(false);
    }
  }, [isSearchBtnClicked]);

  useEffect(() => {
    const clickHandler = handleClickOutside(ref, setOpen);
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [ref, setOpen]);

  const handleGrid = () => {
    setList(false);
    setGrid(true);
  };

  const handleList = () => {
    setList(true);
    setGrid(false);
  };

  const classes = {
    root: 'flex justify-center mt-20 flex-grow',
    bodyContainer: 'lg:flex justify-center lg:max-w-[1232px] w-full md:w-none',
    body: 'flex flex-col lg:flex-row md:mt-0',
    content: 'flex flex-row items-center justify-between gap-7 ml-0 xl:ml-20',
    filterList: `mx-auto md:w-full lg:w-[25%] lg:flex ${mobileFilterIsOpen ? '' : 'hidden'}`,
    searchShortcut: `justify-center ${mobileFilterIsOpen ? 'hidden' : ''
      } flex w-screen px-2 md:w-full itens-center md:px-0`,
    propertiesGridListOrderBy:
      'flex flex-row items-center justify-around mt-2 md:my-3 mr-0',
    listGridContainer: 'flex flex-row items-center gap-1 mr-[-30px] w-fit',
    list: `w-[47px] h-[44px] border border-[#6B7280] rounded-[10px] ${list && 'border-[#F5BF5D] shadow-inner'
      }`,
    grid: `w-[47px] h-[44px] border border-[#6B7280] rounded-[10px] ${grid && 'border-[#F5BF5D] shadow-inner'
      }`,
    propertyNotFound: 'flex flex-col mx-auto justify-center',
    orderBy:
      'flex flex-row items-center justify-around cursor-pointer md:my-auto bg-tertiary sm:max-w-[188px] md:w-[180px] h-[44px] font-bold text-sm md:text-md text-quaternary leading-5 shadow-lg p-[10px] border border-quaternary rounded-[30px] mt-7 md:mr-4 ml-2',
    h2: 'text-quaternary text-sm md:text-base lg:text-lg leading-5 font-bold md:ml-4 text-justify px-5',
    h3: 'text-quaternary text-sm lg:text-md leading-5 font-bold text-justify ml-2',
    gridContainer:
      'sm:grid sm:grid-cols-1 md:flex flex-wrap justify-between gap-2 lg:gap-5 mx-2 lg:mx-10',
  };

  return (
    <main className='flex flex-col min-h-screen'>
      <Header userIsOwner={isOwner} />
      <div className={classes.root}>
        <div className={classes.bodyContainer}>
          <div className={classes.body}>
            <div className={classes.filterList}>
              <FilterList
                locationProp={locations}
                tagsProp={tagsData}
                mobileFilterIsOpenProp={mobileFilterIsOpen}
                isMobileProp={isMobile}
                onMobileFilterIsOpenChange={(isOpen) =>
                  setMobileFilterIsOpen(isOpen)
                }
                onSearchBtnClick={() => setIsSearchBtnClicked(true)}
                locationChangeProp={(loc) => setLocation(loc)}
              />
            </div>

            <div className="flex flex-col lg:w-[75%] lg:ml-5">
              <div className={classes.searchShortcut}>
                <SearchShortcut
                  onMobileFilterIsOpenChange={(isOpen) =>
                    setMobileFilterIsOpen(isOpen)
                  }
                />
              </div>
              <div className={classes.propertiesGridListOrderBy}>
                <h3 className={classes.h3}>
                  {propertyInfo.totalCount} imóveis encontrados com base na
                  pesquisa
                </h3>
                <div className={classes.content}>
                  {!isMobile && (
                    <div className={classes.listGridContainer}>
                      <button onClick={handleList} className={classes.list}>
                        <ListIcon list={list} />
                      </button>
                      <button onClick={handleGrid} className={classes.grid}>
                        <GridIcon grid={grid} />
                      </button>
                    </div>
                  )}

                  {!isMobile && (
                    <div ref={ref} onClick={() => setOpen(!open)}>
                      <div className={classes.orderBy}>
                        <span>Ordenar por</span>
                        <span>
                          <ArrowDropdownIcon open={false} />
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
                  <div className="mx-auto mb-0">
                    <Pagination
                      totalPages={propertyInfo.totalPages}
                      setCurrentPage={setCurrentPage}
                      currentPage={currentPage}
                    />
                  </div>
                )}

              {propertyInfo?.docs?.length === 0 && (
                <div className="flex flex-col my-5 md:mx-8">
                  <h2 className={classes.h2}>
                    Oops! Não encontramos nenhum resultado para essa busca.
                  </h2>
                  <div className={classes.propertyNotFound}>
                    <Image
                      src={'/images/property-not-found.png'}
                      width={250}
                      height={250}
                      alt={'Property not found'}
                    />
                  </div>
                  <h2 className={classes.h2}>
                    Você pode tentar remover alguns filtros para tentar
                    encontrar algum resultado.
                  </h2>
                </div>
              )}

              {!propertyInfo.docs && isCodeSearch && (
                <div className="flex flex-col mt-5">
                  <h2 className={classes.h2}>
                    Oops! Não encontramos nenhum imóvel referente ao código
                    informado.
                  </h2>
                  <div className={classes.propertyNotFound}>
                    <Image
                      src={'/images/property-not-found.png'}
                      width={300}
                      height={300}
                      alt={'Property not found'}
                    />
                  </div>
                  <h2 className={classes.h2}>
                    Verifique se o código está correto e tente novamente.
                  </h2>
                </div>
              )}

              {grid ? (
                <div
                  className={`${classes.gridContainer} ${mobileFilterIsOpen ? 'hidden' : ''}`}
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
                        owner,
                        adType,
                        propertyType
                      }: IData) => (
                        <div className="md:w-60 lg:w-64" key={_id}>
                          <PropertyCard
                            key={_id}
                            prices={prices}
                            description={description}
                            images={images.length > 0 ? images : [defaultPropertyPhoto]}
                            location={address.streetName}
                            bedrooms={metadata[0].amount}
                            bathrooms={metadata[1].amount}
                            parking_spaces={metadata[2].amount}
                            id={_id}
                            highlighted={highlighted}
                            adType={adType}
                            propertyType={propertyType}
                            address={address}
                            onCardClick={(id: string, params: string) => handleCardClick(id, params)}
                          />
                        </div>
                      )
                    )}
                </div>
              ) : (
                <div
                  className={`lg:float-right${mobileFilterIsOpen ? 'hidden' : ''
                    }`}
                >
                  {propertyInfo?.docs?.map(
                    (
                      {
                        _id,
                        prices,
                        description,
                        address,
                        images,
                        metadata,
                        highlighted,
                      }: IData,
                      index
                    ) => (
                      <PropertyInfoCard
                        _id={_id}
                        key={_id}
                        href={`/property/${_id}`}
                        prices={prices[0]?.value.toString()}
                        description={description}
                        images={images?.length > 0 ? images : [defaultPropertyPhoto]}
                        location={address?.streetName}
                        bedrooms={metadata[0]?.amount}
                        bathrooms={metadata[1]?.amount}
                        parking_spaces={metadata[2]?.amount}
                        highlighted={highlighted}
                        propertyInfo={propertyInfo?.docs[index]}
                        onCardClick={(id: string, params: string) => handleCardClick(id, params)}
                      />
                    )
                  )}
                </div>
              )}

              {!mobileFilterIsOpen &&
                propertyInfo?.docs &&
                propertyInfo?.docs.length > 0 && (
                  <div className="mx-auto">
                    <Pagination
                      totalPages={propertyInfo?.totalPages}
                      setCurrentPage={setCurrentPage}
                      currentPage={currentPage}
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Search;

export async function getServerSideProps(context: NextPageContext) {
  const { query } = context;
  const filter = [];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  const session = (await getSession(context)) as any;
  const userId = session?.user.data._id || session?.user.id;
  const page = 1;
  let ownerData;
  let ownerProperties;

  if (query.adType) filter.push({ adType: query.adType });
  if (query.propertyType) {
    const propertyType = query.propertyType.toString();
    const parsedPropertyType = JSON.parse(propertyType);
    if (parsedPropertyType !== 'todos') {
      filter.push({ propertyType: parsedPropertyType });
    }
  }
  if (query.propertySubtype) {
    const propertySubtype = query.propertySubtype.toString();
    const parsedPropertySubtype = JSON.parse(propertySubtype);
    if (parsedPropertySubtype !== 'todos') {
      filter.push({ propertySubtype: parsedPropertySubtype });
    }
  }
  if (query.tags) filter.push({ tags: query.tags });
  if (query.minSize) filter.push({ minSize: query.minSize });
  if (query.minPrice) filter.push({ minPrice: query.minPrice });
  if (query.maxPrice) filter.push({ maxPrice: query.maxPrice });
  if (query.minCondominium)
    filter.push({ minCondominium: query.minCondominium });
  if (query.maxCondominium)
    filter.push({ maxCondominium: query.maxCondominium });
  if (query.bedroom) filter.push({ bedroom: query.bedroom });
  if (query.bathroom) filter.push({ bathroom: query.bathroom });
  if (query.parkingSpaces) filter.push({ parkingSpaces: query.parkingSpaces });
  if (query.location) {
    const location = query.location.toString();
    if (location !== 'todos' && query.location !== 'todos') {
      const parsedLocation = JSON.parse(location);
      filter.push({ locationFilter: parsedLocation });
    }
  }
  if (query.longitude && query.latitude) {
    const geoQuery = {
      geolocation: {
        longitude: query.longitude,
        latitude: query.latitude
      }
    }
    filter.push(geoQuery)
  }

  const encodedFilter = decodeURIComponent(JSON.stringify(filter));

  let encodedSort;
  if (query.sort !== '') {
    if (query.sort === 'mostRecent')
      encodedSort = encodeURIComponent(JSON.stringify([{ createdAt: -1 }]));
    if (query.sort === 'lowestPrice')
      encodedSort = encodeURIComponent(
        JSON.stringify([{ 'prices.0.value': 1 }])
      );
    if (query.sort === 'biggestPrice')
      encodedSort = encodeURIComponent(
        JSON.stringify([{ 'prices.0.value': -1 }])
      );
  }

  const locationsPromise = fetch(`${baseUrl}/location`)
    .then((res) => res.json())
    .catch(() => ({}));

  const tagsDataPromise = fetch(`${baseUrl}/tag`)
    .then((res) => res.json())
    .catch(() => ({}));

  const [locationsResult, tagsDataResult] = await Promise.allSettled([
    locationsPromise,
    tagsDataPromise,
  ]);

  const locations = locationsResult.status === 'fulfilled' ? locationsResult.value : {};
  const tagsData = tagsDataResult.status === 'fulfilled' ? tagsDataResult.value : {};

  let propertyInfo;
  let currentPage = query.page;

  if (query.code) {
    try {
      const url = `${baseUrl}/property/announcementCode/${query.code}`;

      propertyInfo = await fetch(url)
        .then((res) => res.json())
        .catch(() => ({}));
    } catch (error) {
      throw new Error(
        `Não foi possível buscar o imóvel com o código: ${query.code}`
      );
    }
  } else {
    const url = `${baseUrl}/property/filter/?page=${currentPage}&limit=15&filter=${encodedFilter}${encodedSort ? `&sort=${encodedSort}` : ``
      }&need_count=true`;

    propertyInfo = await fetch(url)
      .then((res) => res.json())
      .catch(() => ({}));
  }

  try {
    const ownerIdResponse = await fetch(
      `${baseUrl}/user/find-owner-by-user`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      }
    );

    if (ownerIdResponse.ok) {
      const response = await ownerIdResponse.json();
      if (response?.owner?._id) {
        ownerData = response;

        ownerProperties = await fetch(`${baseUrl}/property/owner-properties`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ownerId: ownerData?.owner?._id,
            page,
          }),
        })
          .then((res) => res.json())
          .catch(() => defaultOwnerProperties)
      } else {
        ownerProperties = defaultOwnerProperties;
      }
    } else {
      ownerData = {};
    }
  } catch (error) {
    console.error(`Error:`, error)
  }

  return {
    props: {
      propertyInfo,
      locations,
      tagsData,
      ownerProperties: ownerProperties ?? defaultOwnerProperties
    },
  };
}
