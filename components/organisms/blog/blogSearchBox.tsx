import HouseIcon from "../../atoms/icons/houseIcon"


const BlogSearchBox = () => {
  return (
    <section className="flex gap-10 w-full justify-center">
      <div className="bg-tertiary text-quaternary w-[40%] p-10 space-y-5 flex flex-col justify-between shadow-lg">
        <h3 className="text-3xl font-bold">Sobre o Blog Locale Imóveis</h3>
        <p className="text-lg font-medium">O Blog Locale Imóveis é uma fonte de referência repleta de informações, orientações e recursos úteis para quem está interessado em alugar, comprar ou vender imóveis. Explore nossos conteúdos exclusivos e descubra tudo o que é necessário para entender o mercado imobiliário!</p>
      </div>
      <div className="bg-primary flex flex-col justify-between text-tertiary w-[40%] p-10 shadow-lg">
        <h3 className="text-2xl font-semibold">Procurando um Imóvel?</h3>
        <p className="text-3xl font-bold">Já pesquisou na Locale Imóveis?</p>

        <div className="flex justify-between mt-7">
          <div className="flex flex-col gap-5 text-quaternary text-lg font-semibold">
            <button className="p-5 bg-tertiary shadow-lg">Imóveis para alugar</button>
            <button className="p-5 bg-tertiary shadow-lg">Imóveis para comprar</button>
          </div>
          <HouseIcon width="150" height="150" />
        </div>
      </div>
    </section>
  )
}

export default BlogSearchBox