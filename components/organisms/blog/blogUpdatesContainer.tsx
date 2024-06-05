import Image from "next/image"
import Link from "next/link"

export type BlogPosts = {
  id: number,
  title: string,
  resume: string,
  timeToRead: number,
  author: string,
  tags: string[],
  timestamp: string,
  img: string,
  post: {
    subImg: string,
    subTitle: string,
    text: string
  }[]
}

export interface IPosts {
  posts: BlogPosts[]
}

const BlogUpdatesContainer = ({
  posts
}: IPosts) => {

  return (
    <section className="bg-tertiary text-quaternary px-40 py-10 shadow-md my-10">
      <h3 className="font-bold text-2xl">Últimas notícias</h3>

      <div className="flex w-full py-5">
        <Link href={`/blog/${posts[0].id}`}>
          <div className="bg-white rounded-l-[30px]">
            <Image
              src={posts[0].img}
              alt={"Foto da notícia publicação correspondente"}
              width={300}
              height={300}
              className="w-96 h-80 object-cover rounded-l-[30px]"
            />
          </div>
        </Link>
        <div className="flex flex-col gap-2 justify-between bg-white px-5 py-3 w-full rounded-r-[30px]">
          <Link href={`/blog/${posts[0].id}`}>
            <div>
              <h3 className="text-3xl font-bold">{posts[0].title}</h3>
              <h4 className="text-lg font-semibold">{posts[0].resume}</h4>
            </div>
          </Link>

          <Link href={`/blog/${posts[0].id}`}>
            <button className="bg-primary rounded-full w-fit text-tertiary text-xl font-semibold py-2 px-5 mx-2 hover:bg-red-600 ease-in-out duration-300 shadow-md">Ver Publicação</button>
          </Link>

        </div>
      </div>
    </section>
  )
}

export default BlogUpdatesContainer