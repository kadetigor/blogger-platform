import request from 'supertest';
import { Express } from 'express';
import { blogInputDto } from '../../../src/blogs/dto/blogsDto';
import { HttpStatus } from '../../../src/core/types/httpStatus';
import { getBlogDto } from './getBlogDto';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generateAdminAuthToken';

export async function updateBlog(
  app: Express,
  blogId: string,
  blogDto?: blogInputDto,
): Promise<void> {
  const defaultPostData: blogInputDto = getBlogDto();

  const testDriverData = { ...defaultPostData, ...blogDto };

  const updatedDriverResponse = await request(app)
    .put(`${POSTS_PATH}/${blogId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testDriverData)
    .expect(HttpStatus.NoContent);

  return updatedDriverResponse.body;
}