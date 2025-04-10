import request from 'supertest';
import {postInputDto} from '../../../src/posts/dto/postInputDto';
import {Express} from 'express';
import {HttpStatus} from '../../../src/core/types/httpStatus';
import {generateBasicAuthToken} from '../generateAdminAuthToken';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { getPostDto } from './getPostDto';
import { postViewModel } from '../../../src/posts/types/postViewModel';

export async function createPost(
    app: Express,
    postDto?: postInputDto,
): Promise<postViewModel> {
    const defaultPostData: postInputDto = getPostDto();
    const testPostData = {...defaultPostData, ...postDto}

    const createdPostResponse = await request(app)
        .post(POSTS_PATH)
        .set('Authorization', generateBasicAuthToken())
        .send(testPostData)
        .expect(HttpStatus.Created)
    
    return createdPostResponse.body 
}