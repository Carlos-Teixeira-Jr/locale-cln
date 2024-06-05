import { useEffect, useState } from "react";
import Pagination from "../components/atoms/pagination/pagination";
import { Footer, Header } from "../components/organisms";
import BlogBanner from "../components/organisms/blog/blogBanner";
import BlogSearchBox from "../components/organisms/blog/blogSearchBox";
import BlogShortcuts, { LoadingState } from "../components/organisms/blog/blogShortcuts";
import BlogUpdatesContainer from "../components/organisms/blog/blogUpdatesContainer";
import PostCard from "../components/organisms/blog/postCards";
import Posts from "../data/blog/blogPosts.json";

const BlogPage = () => {

  const [searchInput, setSearchInput] = useState('');
  console.log("🚀 ~ BlogPage ~ searchInput:", searchInput)
  const [isSearch, setIsSearch] = useState(false);
  const posts = Posts.filter((post) => {
    return post.tags.some(tag => tag.includes(searchInput));
  });
  const totalPages = Posts.length / 6 >= 1 ? Posts.length / 6 : 1;
  const currentPage = 1;
  const [selectedPage, setSelectedPage] = useState<LoadingState>({
    home: true,
    data: false,
    rent: false,
    buy: false,
    advertise: false
  });

  useEffect(() => {
    if (selectedPage.home) {
      setSearchInput('');
      setIsSearch(false);
    }
    if (selectedPage.data) {
      setSearchInput('dados');
      setIsSearch(true);
    }
    if (selectedPage.rent) {
      setSearchInput('aluguel');
    }
    if (selectedPage.buy) {
      setSearchInput('comprar');
    }
    if (selectedPage.advertise) {
      setSearchInput('anunciar');
    }
  }, [selectedPage])

  useEffect(() => {
    if (searchInput === '') {
      setIsSearch(false)
    }
  }, [searchInput])

  return (
    <main>

      <Header />

      <BlogShortcuts onPageSelect={(pageSelected: LoadingState) => setSelectedPage(pageSelected)} />

      {!isSearch ? (
        <>
          <BlogBanner
            onChangeSearchInput={(text: string) => setSearchInput(text)}
            isSearch={isSearch}
            onSearchBtnClick={(isClicked: boolean) => setIsSearch(isClicked)}
          />

          <BlogUpdatesContainer posts={Posts} />
        </>
      ) : (
        <div className="w-full px-10 py-5 text-quaternary space-y-5">
          <h1 className="font-bold text-xl">Resultados encontrados para: {searchInput}</h1>
          <div className="flex w-1/2">
            <input
              className="border border-quaternary w-full rounded-md font-semibold text-lg h-12 my-5 pl-5 shadow-md"
              type="text"
              value={searchInput}
              placeholder="Digite aqui o que você precisa..."
              maxLength={500}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              className="bg-primary rounded-full text-tertiary text-xl font-semibold py-2 px-5 my-5 mx-2 h-12 hover:bg-red-600 ease-in-out duration-300 shadow-md"
              onClick={() => {
                setIsSearch(false);
                setIsSearch(true);
              }}
            >
              Procurar
            </button>
          </div>

          <hr className="h-[0.10rem] bg-quaternary w-full my-5" />

          <div className="flex flex-wrap gap-10">
            {posts.map((post) => (
              <div key={post.id} className="w-[31%]">
                <PostCard post={post} />
              </div>
            ))}
          </div>

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      )}

      <BlogSearchBox />

      <Footer />

    </main>
  )
}

export default BlogPage