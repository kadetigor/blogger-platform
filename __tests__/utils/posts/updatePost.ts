import request from 'supertest';
import { Express } from 'express';
import { postInputDto } from '../../../src/posts/dto/postInputDto';
import { HttpStatus } from '../../../src/core/types/httpStatus';
import { getPostDto } from './getPostDto';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generateAdminAuthToken';

export async function updateDriver(
  app: Express,
  postId: string,
  postDto?: postInputDto,
): Promise<void> {
  const defaultPostData: postInputDto = getPostDto();

  const testDriverData = { ...defaultPostData, ...postDto };

  const updatedDriverResponse = await request(app)
    .put(`${POSTS_PATH}/${postId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testDriverData)
    .expect(HttpStatus.NoContent);

  return updatedDriverResponse.body;
}