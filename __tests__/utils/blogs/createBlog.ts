import request from 'supertest';
import {postInputDto} from '../../../src/posts/dto/postInputDto';
import {Express} from 'express';
import {HttpStatus} from '../../../src/core/types/httpStatus';
import {generateBasicAuthToken} from '../generateAdminAuthToken';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { getBlogDto } from './getBlogDto';
import { blogViewModel } from '../../../src/blogs/types/blogViewModel';
import { blogInputDto } from '../../../src/blogs/dto/blogsDto';

export async function createBlog(
    app: Express,
    blogDto?: blogInputDto,
): Promise<blogViewModel> {
    const defaultBlogData: blogInputDto = getBlogDto();
    const testPostData = {...defaultBlogData, ...blogDto}

    const createdPostResponse = await request(app)
        .post(POSTS_PATH)
        .set('Authorization', generateBasicAuthToken())
        .send(testPostData)
        .expect(HttpStatus.Created)
    
    return createdPostResponse.body 
}