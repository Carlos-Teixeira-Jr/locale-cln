import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IBlogPost } from "../../common/interfaces/blog/blogPost";
import { ILocation } from "../../common/interfaces/locationDropdown";
import { IOwnerProperties } from "../../common/interfaces/properties/propertiesList";
import {
  IPropertyInfo
} from '../../common/interfaces/property/propertyData';
import { IPropertyTypes } from "../../common/interfaces/property/propertyTypes";
import { fetchJson, handleResult } from "../../common/utils/fetchJson";
import { Footer, Header } from "../../components/organisms";
import BlogShortcuts, { LoadingState } from "../../components/organisms/blog/blogShortcuts";
import PostContainer from "../../components/organisms/blog/post";

export interface IPostPage {
  propertyInfo: IPropertyInfo;
  propertyTypes: IPropertyTypes[];
  locations: ILocation[];
  post: IBlogPost
}

const defaultOwnerProperties: IOwnerProperties = {
  docs: [],
  count: 0,
  totalPages: 0,
  messages: []
};

const PostPage = ({
  propertyInfo,
  propertyTypes,
  locations,
  post
}: IPostPage) => {

  const { query, push } = useRouter();

  const [isSearch, setIsSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');

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
    <main className="min-h-screen flex flex-col">
      <Header userIsOwner={false} />

      <div className="px-5">
        <BlogShortcuts onPageSelect={(pageSelected: LoadingState) => setSelectedPage(pageSelected)} />
      </div>

      <div className="max-w-7xl mx-auto">
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
          post={post}
          locations={locations}
          propertyTypes={propertyTypes}
          propertyInfo={propertyInfo}
        />
      </div>


      <div className="md:mt-[20rem]">
        <Footer />
      </div>

    </main>
  )
}

export default PostPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {

  const postId = context.params ? context.params.id : '';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  const promises = [
    fetchJson(`${baseUrl}/property/filter/?page=1&limit=4`),
    fetchJson(`${baseUrl}/property-type`),
    fetchJson(`${baseUrl}/location`),
    fetchJson(`${baseUrl}/blog/${postId}`),
  ];

  const results = await Promise.allSettled(promises);

  const propertyInfoResult = results[0];
  const propertyTypesResult = results[1];
  const locationsResult = results[2];
  const postResult = results[3];

  const propertyInfo = handleResult(propertyInfoResult);
  const propertyTypes = handleResult(propertyTypesResult);
  const locations = handleResult(locationsResult);
  const post = handleResult(postResult);

  return {
    props: {
      propertyInfo,
      propertyTypes,
      locations,
      post
    },
  };
}