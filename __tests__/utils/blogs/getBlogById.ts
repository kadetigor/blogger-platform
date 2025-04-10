import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/httpStatus';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generateAdminAuthToken';
import { blogViewModel } from '../../../src/blogs/types/blogViewModel';

export async function getBlogById(
  app: Express,
  blogId: string,
): Promise<blogViewModel> {
  const postResponse = await request(app)
    .get(`${POSTS_PATH}/${blogId}`)
    .set('Authorization', generateBasicAuthToken())
    .expect(HttpStatus.Ok);

  return postResponse.body;
}