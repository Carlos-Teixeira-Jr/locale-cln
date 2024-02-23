import { NextPageContext } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { ILocation } from '../common/interfaces/locationDropdown';
import { IData } from '../common/interfaces/property/propertyData';
import { ITagsData } from '../common/interfaces/tagsData';
import { handleClickOutside } from '../common/utils/clickOutsideDropdownHandler';
import { removeQueryParam } from '../common/utils/removeQueryParams';
import DropdownOrderBy from '../components/atoms/dropdowns/dropdownOrderBy';
import ArrowDropdownIcon from '../components/atoms/icons/arrowDropdownIcon';
import GridIcon from '../components/atoms/icons/gridIcon';
import ListIcon from '../components/atoms/icons/listIcon';
import Pagination from '../components/atoms/pagination/pagination';
import PropertyInfoCard from '../components/molecules/cards/PropertyInfoCard/PropertyInfoCard';
import PropertyCard from '../components/molecules/cards/propertyCard/PropertyCard';
import FilterList from '../components/molecules/filterList/FilterList';
import SearchShortcut from '../components/molecules/searchShortcut/searchShortcut';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';
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
  locations: ILocation[];
  tagsData: ITagsData[];
}

const Search: NextPageWithLayout<ISearch> = ({
  propertyInfo,
  locations,
  tagsData,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [mobileFilterIsOpen, setMobileFilterIsOpen] = useState<boolean>(false);
  const [isSearchBtnClicked, setIsSearchBtnClicked] = useState(false);
  const [grid, setGrid] = useState(false);
  const [list, setList] = useState(true);
  const query = router.query as any;
  const queryParsed = query.location ? JSON.parse(query.location) : [];
  const [location, setLocation] = useState<any>(queryParsed);
  const isCodeSearch = query.code ? true : false;

  useEffect(() => {
    if (location.length > 0) {
      const queryParams = {
        ...query,
        location: JSON.stringify(location),
      };
      router.push({ query: queryParams }, undefined, { scroll: false });
    } else {
      removeQueryParam('location', router, query);
    }
  }, [location]);

  useEffect(() => {
    if (router.query.page !== undefined && typeof query.page === 'string') {
      const parsedPage = parseInt(query.page);
      setCurrentPage(parsedPage);
    }
  });

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
    root: 'flex items-center justify-center mt-20',
    bodyContainer: 'lg:flex justify-center lg:max-w-[1232px]',
    body: 'flex flex-col lg:flex-row md:mt-0',
    content: 'flex flex-row items-center justify-between gap-7 ml-0 xl:ml-20',
    filterList: 'mx-auto md:w-fit lg:w-[25%] hidden lg:flex',
    searchShortcut: `justify-center ${
      mobileFilterIsOpen ? 'hidden' : ''
    } flex w-screen px-2 md:w-full itens-center md:px-0`,
    propertiesGridListOrderBy:
      'flex flex-row items-center justify-around mt-2 md:my-3 mr-0',
    listGridContainer: 'flex flex-row items-center gap-1 mr-[-30px] w-fit',
    list: `w-[47px] h-[44px] border border-[#6B7280] rounded-[10px] ${
      list && 'border-[#F5BF5D] shadow-inner'
    }`,
    grid: `w-[47px] h-[44px] border border-[#6B7280] rounded-[10px] ${
      grid && 'border-[#F5BF5D] shadow-inner'
    }`,
    propertyNotFound: 'flex flex-col mx-auto justify-center my-5',
    orderBy:
      'flex flex-row items-center justify-around cursor-pointer md:my-auto bg-tertiary sm:max-w-[188px] md:w-[180px] h-[44px] font-bold text-sm md:text-md text-quaternary leading-5 shadow-lg p-[10px] border border-quaternary rounded-[30px] mt-7 md:mr-4 ml-2',
    h2: 'text-quaternary text-sm md:text-base lg:text-lg leading-5 font-bold md:ml-4 text-justify px-5',
    h3: 'text-quaternary text-sm lg:text-md leading-5 font-bold text-justify ml-2',
    gridContainer:
      'sm:grid sm:grid-cols-1 md:grid. md:grid-cols-2. md:flex flex-wrap justify-between gap-2 lg:gap-5 mx-2 lg:mx-10',
  };

  return (
    <div>
      <Header />
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
                <div className="flex flex-col mt-5">
                  <h2 className={classes.h2}>
                    Oops! Não encontramos nenhum resultado para essa busca.
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
                  className={
                    (classes.gridContainer, mobileFilterIsOpen ? 'hidden' : '')
                  }
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
                        <div className="md:w-60 lg:w-64" key={_id}>
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
                        </div>
                      )
                    )}
                </div>
              ) : (
                <div
                  className={`lg:float-right${
                    mobileFilterIsOpen ? 'hidden' : ''
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
                        prices={prices[0].value.toString()}
                        description={description}
                        images={images}
                        location={address.streetName}
                        bedrooms={metadata[0].amount}
                        bathrooms={metadata[1].amount}
                        parking_spaces={metadata[2].amount}
                        highlighted={highlighted}
                        propertyInfo={propertyInfo?.docs[index]}
                      />
                    )
                  )}
                </div>
              )}

              {!mobileFilterIsOpen &&
                propertyInfo?.docs &&
                propertyInfo?.docs.length > 0 && (
                  <div className="mx-auto mt-5">
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
    </div>
  );
};

export default Search;

export async function getServerSideProps(context: NextPageContext) {
  const { query } = context;
  const filter = [];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

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

  const locations = await fetch(`${baseUrl}/location`)
    .then((res) => res.json())
    .catch(() => ({}));

  const tagsData = await fetch(`${baseUrl}/tag`)
    .then((res) => res.json())
    .catch(() => ({}));

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
    const url = `${baseUrl}/property/filter/?page=${currentPage}&limit=15&filter=${encodedFilter}${
      encodedSort ? `&sort=${encodedSort}` : ``
    }&need_count=true`;

    propertyInfo = await fetch(url)
      .then((res) => res.json())
      .catch(() => ({}));
  }

  return {
    props: {
      propertyInfo,
      locations,
      tagsData,
    },
  };
}
