import { blogInputDto } from '../../../src/blogs/dto/blogsDto';

export function getBlogDto(): blogInputDto {
    return {
        name: "Igor's Blog", // maxLength: 30
        description: "This is Igor's blog", // maxLength: 100
        websiteUrl: "lksdjfkasdjfhsadflsdjklfsdjklgsdkjlhglkasdjfsdlkfjsdalkjflksdjkl", // maxLength: 1000
    }
}