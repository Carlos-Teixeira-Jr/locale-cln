import { useState } from "react";
import AdvertiseIcon from "../components/atoms/icons/advertiseIcon";
import BlogIcon from "../components/atoms/icons/blogIcon";
import BuyIcon from "../components/atoms/icons/buyIcon";
import CloseIcon from "../components/atoms/icons/closeIcon";
import DataIcon from "../components/atoms/icons/dataIcon";
import RentIcon from "../components/atoms/icons/rentIcon";
import Loading from "../components/atoms/loading";
import { Header } from "../components/organisms";

type LoadingState = {
  [key: string]: boolean;
};

const BlogPage = () => {

  const [loading, setLoading] = useState<LoadingState>({
    home: false,
    data: false,
    rent: false,
    buy: false,
    advertise: false
  });

  const [selectedPage, setSelectedPage] = useState<LoadingState>({
    home: true,
    data: false,
    rent: false,
    buy: false,
    advertise: false
  });

  const getThemes = () => {
    const iconClassName = "group-hover:fill-tertiary mx-2";
    const iconFill = "#6B7280";
    const loadingFill = "#6B7280";
    const tagsShortcuts = [
      {
        label: 'Home',
        key: 'home',
        icon: !loading.blog ? <BlogIcon fill={iconFill} className={iconClassName} /> : <Loading fill={loadingFill} />,
      },
      {
        label: 'Dados & Índices',
        key: 'data',
        icon: !loading.data ? <DataIcon fill={iconFill} className={iconClassName} /> : <Loading fill={loadingFill} />,
      },
      {
        label: 'Para quem quer alugar',
        key: 'rent',
        icon: !loading.rent ? <RentIcon fill={iconFill} className={iconClassName} /> : <Loading fill={loadingFill} />,
      },
      {
        label: 'Para quem quer comprar',
        key: 'buy',
        icon: !loading.buy ? <BuyIcon fill={iconFill} className={iconClassName} /> : <Loading fill={loadingFill} />,
      },
      {
        label: 'Para quem quer anunciar',
        key: 'advertise',
        icon: !loading.advertise ? <AdvertiseIcon
          fill={iconFill}
          width="24"
          height="48"
          className={iconClassName}
        /> : <Loading fill={loadingFill} />
      },
    ];
    return tagsShortcuts;
  };

  const handleClick = (key: string) => {
    setSelectedPage(prevState => {
      const newState = Object.keys(prevState).reduce((acc, currKey) => {
        acc[currKey] = currKey === key;
        return acc;
      }, {} as LoadingState);
      return newState;
    });
  }

  return (
    <main className="overflow-x-scroll overflow-y-hidden scroll-smooth md:overflow-hidden lg:overflow-hidden xl:overflow-hidden flex flex-row items-center justify-between max-w-full lg:w-[95%] h-[70px] bg-tertiary shadow-md mt-2 md:mt-8 lg:mt-28 mx-auto rounded-[30px] px-2 gap-5">

      <Header />

      {getThemes().map((option) => (
        <div
          key={option.key}
          onClick={() => handleClick(option.key)}
          className={`group flex flex-row items-center w-fit h-[40px] border rounded-[30px] p-3 bg-transparent hover:bg-quaternary cursor-pointer ${selectedPage[option.key]
            ? 'border-2 border-secondary'
            : 'border-quaternary'
            }`}
        >
          <div
            className="flex flex-row items-center justify-between"
          >
            {selectedPage[option.key] ? (
              <CloseIcon
                width="40"
                height="40"
                fill="quaternary"
                className={`group-hover:fill-tertiary p-1 ${selectedPage[option.key]
                  ? 'fill-secondary'
                  : 'fill-quaternary'
                  }`}
              />
            ) : (
              <span>{option.icon}</span>
            )}
            <h3
              className={`font-semibold text-quaternary text-sm leading-5 group-hover:text-tertiary mx-4 ${selectedPage[option.key]
                ? 'font-extrabold text-secondary'
                : 'font-bold'
                }`}
            >
              {option.label}
            </h3>
          </div>
        </div>
      ))}
    </main>
  )
}

export default BlogPage