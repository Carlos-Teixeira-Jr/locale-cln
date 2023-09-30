import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import DropdownOrderBy from '../components/atoms/dropdowns/dropdownOrderBy';
import Pagination from '../components/atoms/pagination/pagination';
import PropertyInfoCard from '../components/molecules/cards/PropertyInfoCard/PropertyInfoCard';
import PropertyCard from '../components/molecules/cards/propertyCard/PropertyCard';
import FilterList from '../components/molecules/filterList/FilterList';
import SearchShortcut from '../components/molecules/searchShortcut/searchShortcut';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';
import useTrackLocation from '../hooks/trackLocation';
import { NextPageWithLayout } from './page';

const Search: NextPageWithLayout = ({ propertyInfo }: any) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const [grid, setGrid] = useState(false);
  const [list, setList] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { latitude, longitude, location } = useTrackLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const query = router.query;
  const [announcementCode, setAnnouncementCode] = useState<string>('');
  const [propertiesData, setPropertiesData] = useState(propertyInfo);

  const handlePageChange = async (newPageIndex: number) => {
    setCurrentPage(newPageIndex);
  };

  const handleSearchByCode = (code: string) => {
    setAnnouncementCode(code);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filter = [];

        filter.push(query);

        let geolocation;

        if (location) {
          geolocation = encodeURIComponent(
            JSON.stringify([{ latitude: latitude, longitude: longitude }])
          );
          filter.push({ latitude, longitude });
        }

        const encodedFilter = encodeURIComponent(JSON.stringify(filter));

        let response;

        if (announcementCode) {
          try {
            const url = `http://localhost:3001/property/announcementCode/${announcementCode}`;
            response = await fetch(url).then((res) => res.json());
          } catch (error) {
            throw new Error(
              `Não foi possível buscar o imóvel com o código: ${announcementCode}`
            );
          }
        } else {
          const url = `http://localhost:3001/property/filter/?page=${currentPage}&limit=10&filter=${encodedFilter}&need_count=true`;

          console.log('🚀 ~ file: search.tsx:68 ~ fetchData ~ url:', url);
          response = await fetch(url).then((res) => res.json());
        }

        setPropertiesData(response);
      } catch (error: any) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [currentPage, query, latitude, longitude, location, announcementCode]);

  useEffect(() => {
    console.log('🚀 ~ file: search.tsx:28 ~ propertiesData:', propertiesData);
  }, [propertiesData]);

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => document.removeEventListener('click', handleClick);

    function handleClick(event: any) {
      if (ref && ref.current) {
        const myRef: any = ref.current;
        if (!myRef.contains(event.target)) {
          setOpen(false);
        }
      }
    }
  });

  const handleGrid = () => {
    setList(false);
    setGrid(true);
  };

  const handleList = () => {
    setList(true);
    setGrid(false);
  };

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 850);
      setGrid(true);
      setList(false);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center">
        <div className="lg:flex justify-center max-w-[1232px]">
          <div className="flex flex-col md:flex-row mt-[-16px] md:mt-0 ">
            <FilterList
              propertyTypesProp={[]}
              locationProp={[]}
              tagsProp={[]}
              mobileFilterIsOpenProp={false}
              isMobileProp={false}
              onMobileFilterIsOpenChange={function (isOpen: boolean): void {
                // throw new Error('Function not implemented.');
              }}
              onSearchBtnClick={() => handleSearchByCode}
            />
            <div className="flex flex-col">
              <SearchShortcut
                onMobileFilterIsOpenChange={function (isOpen: boolean): void {
                  throw new Error('Function not implemented.');
                }}
              />
              <div className="flex flex-row items-center justify-between px-5 gap-8 mt-2 md:mt-0">
                <h3 className="text-quaternary text-sm md:text-base leading-5 font-extrabold md:ml-4 text-justify">
                  {propertiesData.totalCount} Imóveis encontrados com base na
                  pesquisa
                </h3>
                {/* SearchView - start*/}
                {!isMobile && (
                  <div className="flex flex-row items-center gap-1 mr-[-30px]">
                    <button
                      onClick={handleList}
                      className={`w-[47px] h-[44px] border border-[#6B7280] rounded-[10px] ${
                        list && 'border-[#F5BF5D] shadow-inner'
                      }`}
                    >
                      <svg
                        width="33"
                        height="25"
                        viewBox="0 0 33 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`ml-[5px] ${
                          list && 'selected:fill-[#F5BF5D]'
                        }`}
                      >
                        <rect
                          width="7"
                          height="6"
                          rx="2"
                          fill="#6B7280"
                          className={`${list && 'fill-[#F5BF5D]'}`}
                        />
                        <rect
                          y="10"
                          width="7"
                          height="6"
                          rx="2"
                          fill="#6B7280"
                          className={`${list && 'fill-[#F5BF5D]'}`}
                        />
                        <rect
                          y="19"
                          width="7"
                          height="6"
                          rx="2"
                          fill="#6B7280"
                          className={`${list && 'fill-[#F5BF5D]'}`}
                        />
                        <rect
                          x="10"
                          width="23"
                          height="6"
                          rx="2"
                          fill="#6B7280"
                          className={`${list && 'fill-[#F5BF5D]'}`}
                        />
                        <rect
                          x="10"
                          y="10"
                          width="23"
                          height="6"
                          rx="2"
                          fill="#6B7280"
                          className={`${list && 'fill-[#F5BF5D]'}`}
                        />
                        <rect
                          x="10"
                          y="19"
                          width="23"
                          height="6"
                          rx="2"
                          fill="#6B7280"
                          className={`${list && 'fill-[#F5BF5D]'}`}
                        />
                      </svg>
                    </button>
                    <button
                      onClick={handleGrid}
                      className={`w-[47px] h-[44px] border border-[#6B7280] rounded-[10px] ${
                        grid && 'border-[#F5BF5D] shadow-inner'
                      }`}
                    >
                      <svg
                        width="33"
                        height="25"
                        viewBox="0 0 33 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`ml-[5px] ${grid && 'fill-[#F5BF5D]'} `}
                      >
                        <rect
                          y="15"
                          width="15"
                          height="10"
                          rx="2"
                          fill="#6B7280"
                          className={`${grid && 'fill-[#F5BF5D]'} `}
                        />
                        <rect
                          width="15"
                          height="11"
                          rx="2"
                          fill="#6B7280"
                          className={`${grid && 'fill-[#F5BF5D]'} `}
                        />
                        <rect
                          x="18"
                          width="15"
                          height="11"
                          rx="2"
                          fill="#6B7280"
                          className={`${grid && 'fill-[#F5BF5D]'} `}
                        />
                        <rect
                          x="18"
                          y="15"
                          width="15"
                          height="10"
                          rx="2"
                          fill="#6B7280"
                          className={`${grid && 'fill-[#F5BF5D]'} `}
                        />
                      </svg>
                    </button>
                  </div>
                )}
                {/* SearchView - end*/}
                {!isMobile && (
                  <div ref={ref as any} onClick={() => setOpen(!open)}>
                    <div className="flex flex-row items-center justify-around cursor-pointer mb-6 bg-tertiary sm:max-w-[188px] md:w-[188px] h-[44px] font-bold text-sm md:text-lg text-quaternary leading-5 shadow-lg p-[10px] border border-quaternary rounded-[30px] mt-7 md:mr-4 ml-2">
                      <span>Ordenar Por</span>
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="40"
                          width="40"
                          fill="#6B7280"
                          className="mr-[-10px]"
                        >
                          <path d="m20 25-8.333-8.292h16.666Z" />
                        </svg>
                      </span>
                    </div>
                    {open && <DropdownOrderBy />}
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                <Pagination
                  totalPages={propertiesData.totalPages}
                  page={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>

              {grid ? (
                <div className="sm:grid sm:grid-cols-1 md:grid md:grid-cols-2  justify-center gap-9 mx-14">
                  {propertiesData.docs?.map(
                    ({
                      _id,
                      prices,
                      description,
                      address,
                      images,
                      metadata,
                      highlighted,
                    }: any) => (
                      <PropertyCard
                        key={_id}
                        prices={prices[0].value}
                        description={description}
                        images={images}
                        location={address.streetName}
                        bedrooms={metadata[0].amount}
                        bathrooms={metadata[1].amount}
                        parking_spaces={metadata[2].amount}
                        _id={_id}
                        highlighted={highlighted}
                      />
                    )
                  )}
                </div>
              ) : (
                <div className="lg:float-right">
                  {propertiesData.docs?.map(
                    ({
                      id,
                      prices,
                      description,
                      address,
                      images,
                      metadata,
                      highlighted,
                    }: any) => (
                      <PropertyInfoCard
                        _id={id}
                        key={id}
                        href={`/property/${id}`}
                        prices={prices[0].value}
                        description={description}
                        images={images}
                        location={address.streetName}
                        bedrooms={metadata[0].amount}
                        bathrooms={metadata[1].amount}
                        parking_spaces={metadata[2].amount}
                        highlighted={highlighted}
                        announcementCode={announcementCode}
                        nameA={propertiesData.owner?.name}
                      />
                    )
                  )}
                </div>
              )}

              <div className="flex justify-center">
                <Pagination
                  totalPages={propertiesData.totalPages}
                  page={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
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

  const adType = query.adType;
  const adTypeFormatted = { adType: adType };

  const type = query.type;
  const typeFormatted: any = { propertyType: type };

  const tags = query.tags;
  const tagsFormatted: any = { tags: tags };

  const minSize = query.minSize;
  const minSizeFormatted: any = { minSize: minSize };

  const filter = [];

  if (adType) {
    filter.push(adTypeFormatted);
  }

  if (type) {
    filter.push(typeFormatted);
  }

  if (tags) {
    filter.push(tagsFormatted);
  }

  if (minSize) {
    filter.push(minSizeFormatted);
  }

  const encodedFilter = decodeURIComponent(JSON.stringify(filter));

  const highlighted = [{ highlighted: -1 }];
  const sortParam = encodeURIComponent(JSON.stringify(highlighted));

  const propertyInfo = await fetch(
    `http://localhost:3001/property/filter/?page=1&limit=10&sort=${sortParam}&filter=${encodedFilter}&need_count=true`
  ).then((res) => res.json());

  return {
    props: {
      propertyInfo,
    },
  };
}
