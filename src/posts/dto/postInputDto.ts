export type PostInputDto = {
    title: string, // maxLength: 30
    shortDescription: string, // maxLength: 100
    content: string, // maxLength: 1000
    blogId: string
}