import { blogInputDto } from '../../../src/blogs/dto/blogsDto';

export function getBlogDto(): blogInputDto {
  return {
    name: "Igor's Blog", // maxLength: 30
    description: "This is Igor's blog", // maxLength: 100
    websiteUrl: "https://wB57uS8dfakny4xGpS3ULt6z1KCzrpR_sj-1akoI5kD-9d2uNlJR3GfTUoVP0a3m8MgzFVpj5.pW1fGSfIWTW41QoQYl", // maxLength: 1000
  }
}
