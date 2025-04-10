import { postInputDto } from '../../../src/posts/dto/postInputDto';

export function getPostDto(): postInputDto {
    return {
        title: "Igor's Blog", // maxLength: 30
        shortDescription: "This is Igor's blog", // maxLength: 100
        content: "lksdjfkasdjfhsadflsdjklfsdjklgsdkjlhglkasdjfsdlkfjsdalkjflksdjkl", // maxLength: 1000
        blogId: "478923748237"
    }
}