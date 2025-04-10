import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/app';
import { HttpStatus } from '../../../src/core/types/httpStatus';
import { blogInputDto } from '../../../src/blogs/dto/blogsDto';
import { generateBasicAuthToken } from '../../utils/generateAdminAuthToken';
import { getBlogDto } from '../../utils/blogs/getBlogDto';
import { clearDb } from '../../utils/clearDb';
import { createPost } from '../../utils/posts/createPost';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { getPostById } from '../../utils/posts/getPostById';
import { runDB, stopDb } from '../../../src/db/mongoDb';
import { ObjectId } from 'mongodb';

describe('Blog API body validation check', () => {
  const app = express();
  setupApp(app);

  const correctTestPostData: blogInputDto = getBlogDto();

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB('mongodb://localhost:27017/blogger-platform');
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it(`'❌ Should not creat blog when passed with a wrong body: POST api/blogs'`, async () => {
    await request(app)
      .post(BLOGS_PATH)
      .send(correctTestPostData)
      .expect(HttpStatus.Unauthorized);

    const invalidDataSet1 = await request(app)
        .post(BLOGS_PATH)
        .set ('Authorization', generateBasicAuthToken())
        .send({
            name: "   ", // empty string
            description: "   ", // empty string
            websiteUrl: "   ", // empty string
        })
        .expect(HttpStatus.BadRequest);

        expect(invalidDataSet1.body.errorMessages).toHaveLength(3);
  });


  
})