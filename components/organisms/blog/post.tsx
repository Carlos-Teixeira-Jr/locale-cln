import Image from "next/image"
import { useEffect, useState } from "react"
import { ILocation } from "../../../common/interfaces/locationDropdown"
import { IPropertyInfo } from "../../../common/interfaces/property/propertyData"
import { IPropertyTypes } from "../../../common/interfaces/property/propertyTypes"
import HomeFilter from "../../atoms/filterSections/HomeFilter"
import ClockIcon from "../../atoms/icons/clockIcon"
import { BlogPosts } from "./blogUpdatesContainer"

export interface IPostContainer {
  post: BlogPosts,
  locations: ILocation[],
  propertyTypes: IPropertyTypes[],
  propertyInfo: IPropertyInfo
}

const PostContainer = ({
  post,
  locations,
  propertyTypes,
}: IPostContainer) => {

  const [isBuy, setIsBuy] = useState(true);
  const [isRent, setIsRent] = useState(false);
  const [filterFixed, setFilterFixed] = useState(false);

  const handleSetBuy = (value: boolean) => {
    setIsBuy(value);
  };

  const handleSetRent = (value: boolean) => {
    setIsRent(value);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop > 900) {
        setFilterFixed(true);
      } else {
        setFilterFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="md:px-32 p-5 text-quaternary space-y-5">
      <h1 className="text-3xl md:text-4xl font-bold">{post.title}</h1>
      <h2 className="text-xl font-normal">{post.resume}</h2>

      <div className="flex">
        <ClockIcon width="25" />
        <p>Tempo estimado de leitura: {post.timeToRead} minutos</p>
      </div>

      <p>Por {post.author} em 04/06/24 às 20:59</p>

      <Image src={post.img} alt={"Imagem da notícia"} width={1000} height={1000} className="w-full lg:max-h-[27rem]" />

      <div className="flex lg:flex-row flex-col">
        <div className={`lg:top-[15%] lg:left-50 mx-auto md:block ${filterFixed ? 'lg:fixed' : ''}`}>
          <HomeFilter
            isBuyProp={isBuy}
            isRentProp={isRent}
            propertyTypesProp={propertyTypes}
            locationProp={locations}
            setBuyProp={handleSetBuy}
            setRentProp={handleSetRent}
          />
        </div>

        <div className="flex flex-col gap-5 lg:w-1/2 ml-auto pl-5">
          {post.post.map((e) => (
            <>
              {e.subImg !== '' && (
                <Image src={e.subImg} alt={"Imagem da notícia"} width={1000} height={1000} className="w-full" />
              )}
              <p className="text-xl font-semibold">{e.subTitle}</p>
              <p>{e.text}</p>
            </>
          ))}
        </div>
      </div>

    </section>
  )
}

export default PostContainer