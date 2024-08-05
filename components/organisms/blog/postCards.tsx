import Image from "next/image"
import Link from "next/link"
import { IBlogPost } from "../../../common/interfaces/blog/blogPost"

export interface IPostCard {
  post: IBlogPost
}

const PostCard = ({ post }: IPostCard) => {
  return (
    <section className="rounded-[30px]">
      <Link href={`/blog/${post._id}`} className=" lg:h-[340px]">
        <Image
          src={post.img}
          alt={"Imagem do card da notícia"}
          width={300}
          height={300}
          className="rounded-t-[30px] w-full lg:min-h-[12rem] md:min-h-[7rem] md:max-h-[7rem] lg:max-h-[12rem]"
        />

        <div className="w-full h-full lg:min-h-[10rem] lg:max-h-[10rem] md:min-h-[17rem] md:max-h-[17rem] bg-tertiary flex flex-col gap-5 px-5 pb-5 rounded-b-[30px] shadow-lg">
          <h3 className="text-xl md:text-lg font-bold md:font-semibold">{post.title}</h3>
          <h4 className="text-normal">{post.resume}</h4>
        </div>
      </Link>
    </section>
  )
}

export default PostCard