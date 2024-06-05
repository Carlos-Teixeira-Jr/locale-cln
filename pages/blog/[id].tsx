import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ILocation } from "../../common/interfaces/locationDropdown";
import {
  IPropertyInfo,
} from '../../common/interfaces/property/propertyData';
import { IPropertyTypes } from "../../common/interfaces/property/propertyTypes";
import { fetchJson, handleResult } from "../../common/utils/fetchJson";
import { Footer, Header } from "../../components/organisms";
import BlogShortcuts, { LoadingState } from "../../components/organisms/blog/blogShortcuts";
import PostContainer from "../../components/organisms/blog/post";
import Post from "../../data/blog/blogPosts.json";

export interface IPostPage {
  propertyInfo: IPropertyInfo;
  propertyTypes: IPropertyTypes[];
  locations: ILocation[];
}

const PostPage = ({
  propertyInfo,
  propertyTypes,
  locations,
}: IPostPage) => {

  const { query, push } = useRouter();

  const [isSearch, setIsSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const post = Post.find((post) => post.id.toString() === query.id)

  const [selectedPage, setSelectedPage] = useState<LoadingState>({
    home: false,
    data: false,
    rent: false,
    buy: false,
    advertise: false
  });

  useEffect(() => {
    if (selectedPage.home) {
      push('/blog')
    }
  }, [selectedPage])

  return (
    <main>
      <Header />

      <div className="px-5">
        <BlogShortcuts onPageSelect={(pageSelected: LoadingState) => setSelectedPage(pageSelected)} />
      </div>
      <div className="w-full px-5 md:px-10 py-2 text-quaternary">
        <div className="flex md:flex-row flex-col w-full lg:w-1/2">
          <input
            className="border border-quaternary w-full rounded-md font-semibold text-lg h-10 my-2 pl-5 shadow-md"
            type="text"
            value={searchInput}
            placeholder="Digite aqui o que você precisa..."
            maxLength={500}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            className="bg-primary rounded-full text-tertiary text-xl font-semibold py-2 px-5 my-2 mx-2 h-10 hover:bg-red-600 ease-in-out duration-300 shadow-md"
            onClick={() => {
              setIsSearch(false);
              setIsSearch(true);
            }}
          >
            Procurar
          </button>
        </div>

        <hr className="h-[0.10rem] bg-quaternary w-full my-5" />

      </div>

      <PostContainer
        post={post ?
          post :
          {
            id: 0,
            title: '',
            resume: '',
            timeToRead: 0,
            author: '',
            tags: [],
            timestamp: '',
            img: '',
            post: [{
              subImg: '',
              subTitle: '',
              text: ''
            }]
          }
        }
        locations={locations}
        propertyTypes={propertyTypes}
        propertyInfo={propertyInfo}
      />

      <div className="md:mt-[20rem]">
        <Footer />
      </div>

    </main>
  )
}

export default PostPage;

export async function getStaticPaths() {
  const postIds = Post.map(post => ({ params: { id: post.id.toString() } }));

  return {
    paths: postIds,
    fallback: false
  };
}

export async function getStaticProps() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  const promises = [
    fetchJson(`${baseUrl}/property/filter/?page=1&limit=4`),
    fetchJson(`${baseUrl}/property-type`),
    fetchJson(`${baseUrl}/location`),
  ];

  const results = await Promise.allSettled(promises);

  const propertyInfoResult = results[0];
  const propertyTypesResult = results[1];
  const locationsResult = results[2];

  const propertyInfo = handleResult(propertyInfoResult);
  const propertyTypes = handleResult(propertyTypesResult);
  const locations = handleResult(locationsResult);

  return {
    props: {
      propertyInfo: propertyInfo,
      propertyTypes: propertyTypes,
      locations: locations,
    },
  };
}