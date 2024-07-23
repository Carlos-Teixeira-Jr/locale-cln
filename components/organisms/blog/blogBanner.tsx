import { useEffect, useState } from "react";
import SearchIcon from "../../atoms/icons/searchIcon";
import Loading from "../../atoms/loading";

export interface IBlogBanner {
  onChangeSearchInput: (text: string) => void;
  isSearch: boolean,
  onSearchBtnClick: (isClecked: boolean) => void
}

const BlogBanner = ({
  onChangeSearchInput,
  isSearch,
  onSearchBtnClick
}: IBlogBanner) => {

  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchBtnIsClicked, setSearchBtnIsClicked] = useState(isSearch);

  useEffect(() => {
    onChangeSearchInput(searchInput)
  }, [searchInput]);

  return (
    <section className="bg-cover bg-center p-8 md:p-36 my-5 md:my-6 bg-[url('/images/header-image.png')] shadow-md">
      <div className="bg-tertiary p-5 rounded-[30px] text-center text-quaternary w-full lg:w-fit mx-auto lg:px-44 space-y-2">
        <h1 className="font-bold text-xl md:text-2xl">Tudo sobre comprar, alugar ou vender um imóvel!</h1>
        <h2 className="font-semibold">Confira dicas, ferramentas, guias e outros conteúdos criados para tirar todas as suas dúvidas</h2>

        <div className="relative w-full">
          <input
            className="border border-quaternary w-full rounded-md font-semibold text-lg h-12 my-5 pl-11 md:pl-16 shadow-md placeholder:text-sm md:placeholder:text-base"
            type="text"
            value={searchInput}
            placeholder="Digite aqui o que você precisa..."
            maxLength={500}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            className="bg-primary rounded-full text-tertiary text-xl font-semibold py-2 px-10 lg:absolute mt-5 lg:my-0 rigth-3 mx-2 top-1/2 transform -translate-y-1/2 hover:bg-red-600 ease-in-out duration-300 shadow-md"
            onClick={() => onSearchBtnClick(!searchBtnIsClicked)}
          >
            Procurar
          </button>

          {loading ? (
            <Loading />
          ) : (
            <SearchIcon className="absolute left-1 lg:left-3 top-[2.8rem] lg:top-1/2 transform -translate-y-1/2 h-10 w-10 text-quaternary opacity-60" fill="#6B7280" />
          )}

        </div>

      </div>
    </section>
  )
}

export default BlogBanner