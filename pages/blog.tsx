import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { IOwnerProperties } from "../common/interfaces/properties/propertiesList";
import Pagination from "../components/atoms/pagination/pagination";
import { Footer, Header } from "../components/organisms";
import BlogBanner from "../components/organisms/blog/blogBanner";
import BlogSearchBox from "../components/organisms/blog/blogSearchBox";
import BlogShortcuts, { LoadingState } from "../components/organisms/blog/blogShortcuts";
import BlogUpdatesContainer from "../components/organisms/blog/blogUpdatesContainer";
import PostCard from "../components/organisms/blog/postCards";
import Posts from "../data/blog/blogPosts.json";

interface IBlogPage {
  ownerProperties: IOwnerProperties
}

const defaultOwnerProperties: IOwnerProperties = {
  docs: [],
  count: 0,
  totalPages: 0,
  messages: []
};

const BlogPage = ({ ownerProperties = defaultOwnerProperties }: IBlogPage) => {

  const [searchInput, setSearchInput] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const isOwner = ownerProperties?.docs.length > 0;
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

  console.log("🚀 ~ BlogPage ~ selectedPage:", selectedPage)

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
      setIsSearch(true);
    }
    if (selectedPage.buy) {
      setSearchInput('comprar');
      setIsSearch(true);
    }
    if (selectedPage.advertise) {
      setSearchInput('anunciar');
      setIsSearch(true);
    }
  }, [selectedPage])

  useEffect(() => {
    if (searchInput === '') {
      setIsSearch(false)
    }
  }, [searchInput])

  return (
    <main className="min-h-screen flex flex-col">

      <Header userIsOwner={isOwner} />

      <div className="px-5">
        <BlogShortcuts onPageSelect={(pageSelected: LoadingState) => setSelectedPage(pageSelected)} />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col flex-grow">

        {!isSearch ? (
          <div className="flex flex-col">
            <BlogBanner
              onChangeSearchInput={(text: string) => setSearchInput(text)}
              isSearch={isSearch}
              onSearchBtnClick={(isClicked: boolean) => setIsSearch(isClicked)}
            />

            <BlogUpdatesContainer posts={Posts} />
          </div>
        ) : (
          <div className="flex flex-col w-full px-5 md:px-10 py-5 text-quaternary space-y-5">
            <h1 className="font-bold text-xl">Resultados encontrados para: {searchInput}</h1>
            <div className="flex md:flex-row flex-col w-full lg:w-1/2">
              <input
                className="border border-quaternary w-full rounded-md font-semibold text-lg h-12 my-2 lg:my-5 pl-5 shadow-md"
                type="text"
                value={searchInput}
                placeholder="Digite aqui o que você precisa..."
                maxLength={500}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button
                className="bg-primary rounded-full text-tertiary text-xl font-semibold py-2 px-5 my-2 lg:my-5 mx-2 h-12 hover:bg-red-600 ease-in-out duration-300 shadow-md"
                onClick={() => {
                  setIsSearch(false);
                  setIsSearch(true);
                }}
              >
                Procurar
              </button>
            </div>

            <hr className="h-[0.10rem] bg-quaternary w-full my-5" />

            <div className="flex md:flex-row flex-col flex-wrap gap-10 md:gap-5 lg:gap-10">
              {posts.map((post) => (
                <div key={post.id} className="md:w-[31%]">
                  <PostCard post={post} />
                </div>
              ))}
            </div>

            {posts.length > 0 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
              />
            )}
          </div>
        )}

        <BlogSearchBox />

      </div>

      <Footer />

    </main>
  )
}

export default BlogPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await getSession(context)) as any;
  const userId = session?.user.data._id || session?.user.id;
  const page = 1;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  let ownerData;
  let ownerProperties;

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
      ownerProperties: ownerProperties ?? defaultOwnerProperties
    },
  };
}