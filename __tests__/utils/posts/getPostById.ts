import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/httpStatus';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generateAdminAuthToken';
import { postViewModel } from '../../../src/posts/types/postViewModel';

export async function getPostById(
  app: Express,
  postId: string,
): Promise<postViewModel> {
  const postResponse = await request(app)
    .get(`${POSTS_PATH}/${postId}`)
    .set('Authorization', generateBasicAuthToken())
    .expect(HttpStatus.Ok);

  return postResponse.body;
}