import Image from "next/image"
import { BlogPosts } from "./blogUpdatesContainer"

export interface IPostCard {
  post: BlogPosts
}

const PostCard = ({ post }: IPostCard) => {
  return (
    <section className="rounded-[30px]">
      <Image
        src={post.img}
        alt={"Imagem do card da notícia"}
        width={300}
        height={300}
        className="rounded-t-[30px] w-full"
      />

      <div className="w-full bg-tertiary gap-2 flex flex-col p-2 pb-5 rounded-b-[30px] shadow-lg">
        <h3 className="text-lg font-semibold">{post.title}</h3>
        <h4 className="text-normal">{post.resume}</h4>
      </div>
    </section>
  )
}

export default PostCard