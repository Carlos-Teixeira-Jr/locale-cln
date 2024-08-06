
type BlogPost = {
  subImage: string,
  subTitle: string,
  text: string,
}

export interface IBlogPost {
  _id: string
  title: string,
  resume: string,
  timeToRead: number,
  author: string,
  tags: string[],
  img: string,
  post: BlogPost[]
}