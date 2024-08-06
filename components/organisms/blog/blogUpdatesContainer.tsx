import Image from "next/image"
import Link from "next/link"
import { IBlogPost } from "../../../common/interfaces/blog/blogPost"

export interface IPosts {
  posts: IBlogPost[]
}

const BlogUpdatesContainer = ({
  posts
}: IPosts) => {

  return (
    <section className="bg-tertiary text-quaternary p-5 lg:px-40 lg:py-10 shadow-md my-10">
      <h3 className="font-bold text-2xl">Últimas notícias</h3>

      <div className="flex md:flex-row flex-col w-full py-5">
        <Link href={`/blog/${posts[0]._id}`}>
          <div className="bg-white rounded-t-[30px] md:rounded-l-[30px] lg:rounded-l-[30px]">
            <Image
              src={posts[0].img}
              alt={"Foto da notícia publicação correspondente"}
              width={300}
              height={300}
              className="w-96 h-80 object-cover rounded-t-[30px] md:rounded-tr-none md:rounded-l-[30px] lg:rounded-l-[30px]"
            />
          </div>
        </Link>
        <div className="flex flex-col gap-2 justify-between bg-white px-5 py-3 w-full rounded-b-[30px] md:rounded-r-[30px]">
          <Link href={`/blog/${posts[0]._id}`}>
            <div className="flex flex-col gap-2">
              <h3 className="text-3xl font-bold">{posts[0].title}</h3>
              <h4 className="text-lg font-semibold">{posts[0].resume}</h4>
            </div>
          </Link>

          <Link href={`/blog/${posts[0]._id}`}>
            <button className="bg-primary rounded-full w-fit text-tertiary text-xl font-semibold py-2 px-10 my-2 md:my-0 md:mx-2 hover:bg-red-600 ease-in-out duration-300 shadow-md block mx-auto">Ver Publicação</button>
          </Link>

        </div>
      </div>
    </section>
  )
}

export default BlogUpdatesContainer