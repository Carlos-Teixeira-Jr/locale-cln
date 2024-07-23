import Link from "next/link"
import { useIsMobile } from "../../../hooks/useIsMobile"
import HouseIcon from "../../atoms/icons/houseIcon"


const BlogSearchBox = () => {

  const isMobile = useIsMobile()

  return (
    <section className="flex lg:flex-row flex-col gap-5 md:gap-10 w-full justify-center">
      <div className="bg-tertiary text-quaternary w-[90%] lg:w-[40%] lg:mx-auto m-auto p-10 space-y-5 my-5 flex flex-col justify-between shadow-lg">
        <h3 className="text-3xl font-bold">Sobre o Blog Locale Imóveis</h3>
        <p className="text-lg font-medium">O Blog Locale Imóveis é uma fonte de referência repleta de informações, orientações e recursos úteis para quem está interessado em alugar, comprar ou vender imóveis. Explore nossos conteúdos exclusivos e descubra tudo o que é necessário para entender o mercado imobiliário!</p>
      </div>
      <div className="bg-primary flex flex-col justify-between text-tertiary w-[90%] m-auto  my-5 lg:w-[40%] p-10 shadow-lg">
        <h3 className="text-2xl font-semibold">Procurando um Imóvel?</h3>
        <p className="text-3xl font-bold">Já pesquisou na Locale Imóveis?</p>

        <div className="flex justify-center md:justify-between mt-7">
          <div className="flex flex-col gap-5 text-quaternary text-lg font-semibold">
            <Link href={"/search?adType=alugar"}>
              <button className="md:p-5 p-4 bg-tertiary shadow-lg w-full">Imóveis para alugar</button>
            </Link>
            <Link href={"/search?adType=comprar"}>
              <button className="md:p-5 whitespace-nowrap p-4 bg-tertiary shadow-lg">Imóveis para comprar</button>
            </Link>
          </div>

          {!isMobile && (
            <div className="flex justify-center p-2 md:p-0 w-full">
              <HouseIcon className='mx-auto' width={isMobile ? '100' : '150'} height={isMobile ? '100' : '150'} />
            </div>
          )}

        </div>
      </div>
    </section>
  )
}

export default BlogSearchBox