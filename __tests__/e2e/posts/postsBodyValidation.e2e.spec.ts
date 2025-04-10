import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/app';
import { HttpStatus } from '../../../src/core/types/httpStatus';
import { postInputDto } from '../../../src/posts/dto/postInputDto';
import { generateBasicAuthToken } from '../../utils/generateAdminAuthToken';
import { getPostDto } from '../../utils/posts/getPostDto';
import { clearDb } from '../../utils/clearDb';
import { createPost } from '../../utils/posts/createPost';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { getPostById } from '../../utils/posts/getPostById';
import { runDB, stopDb } from '../../../src/db/mongoDb';

describe('Post API body validation check', () => {
  const app = express();
  setupApp(app);

  const correctTestPostData: postInputDto = getPostDto();

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB('mongodb://localhost:27017/blogger-platform');
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it(`❌ should not create post when incorrect body passed; POST /api/posts'`, async () => {
    await request(app)
      .post(POSTS_PATH)
      .send(correctTestPostData)
      .expect(HttpStatus.Unauthorized);

    const invalidDataSet1 = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send({
        title: '   ', // empty string
        shortDescription: '    ', // empty string
        content: ' .  ', // incorrect email
        blogId: ' .  ', // empty string
        blogName: 'A6',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send({
        name: 'Feodor',
        phoneNumber: '', // empty string
        email: 'feodor@example.com',
        vehicleModel: '', // empty string
        vehicleLicensePlate: '', // empty string
        vehicleMake: '', // empty string
        vehicleYear: 2020,
        vehicleDescription: null,
        vehicleFeatures: [],
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send({
        name: 'Feodor',
        email: 'feodor@example.com',
        phoneNumber: '', // empty string
        vehicleModel: '', // empty string
        vehicleLicensePlate: '', // empty string
        vehicleMake: '', // empty string
        vehicleYear: 2020,
        vehicleDescription: null,
        vehicleFeatures: [],
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(4);

    // check что никто не создался
    const driverListResponse = await request(app)
      .get(POSTS_PATH)
      .set('Authorization', adminToken);
    expect(driverListResponse.body).toHaveLength(0);
  });

  // it('❌ should not update driver when incorrect data passed; PUT /api/drivers/:id', async () => {
  //   const createdDriver = await createPost(app, correctTestPostData);

  //   const invalidDataSet1 = await request(app)
  //     .put(`${POSTS_PATH}/${createdDriver.id}`)
  //     .set('Authorization', generateBasicAuthToken())
  //     .send({
  //       name: '   ',
  //       phoneNumber: '    ',
  //       email: 'invalid email',
  //       vehicleMake: '',
  //       vehicleModel: 'A6',
  //       vehicleYear: 2020,
  //       vehicleLicensePlate: 'XYZ-456',
  //       vehicleDescription: null,
  //       vehicleFeatures: [],
  //     })
  //     .expect(HttpStatus.BadRequest);

  //   expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

  //   const invalidDataSet2 = await request(app)
  //     .put(`${POSTS_PATH}/${createdDriver.id}`)
  //     .set('Authorization', generateBasicAuthToken())
  //     .send({
  //       name: 'Ted',
  //       email: 'ted@example.com',
  //       vehicleMake: 'Audi',
  //       vehicleYear: 2020,
  //       vehicleDescription: null,
  //       vehicleFeatures: [],
  //       phoneNumber: '', // empty string
  //       vehicleModel: '', // empty string
  //       vehicleLicensePlate: '', // empty string
  //     })
  //     .expect(HttpStatus.BadRequest);

  //   expect(invalidDataSet2.body.errorMessages).toHaveLength(3);

  //   const invalidDataSet3 = await request(app)
  //     .put(`${POSTS_PATH}/${createdDriver.id}`)
  //     .set('Authorization', generateBasicAuthToken())
  //     .send({
  //       name: 'A', //too short
  //       phoneNumber: '987-654-3210',
  //       email: 'feodor@example.com',
  //       vehicleMake: 'Audi',
  //       vehicleModel: 'A6',
  //       vehicleYear: 2020,
  //       vehicleLicensePlate: 'XYZ-456',
  //       vehicleDescription: null,
  //       vehicleFeatures: [],
  //     })
  //     .expect(HttpStatus.BadRequest);

  //   expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

  //   const driverResponse = await getPostById(app, createdDriver.id);

  //   expect(driverResponse).toEqual({
  //     ...createdDriver,
  //   });
  // });

  // it('❌ should not update driver when incorrect features passed; PUT /api/drivers/:id', async () => {
  //   const createdDriver = await createPost(app, correctTestPostData);

  //   await request(app)
  //     .put(`${POSTS_PATH}/${createdDriver.id}`)
  //     .set('Authorization', generateBasicAuthToken())
  //     .send({
  //       name: 'Ted',
  //       phoneNumber: '987-654-3210',
  //       email: 'ted@example.com',
  //       vehicleMake: 'Audi',
  //       vehicleModel: 'A6',
  //       vehicleYear: 2020,
  //       vehicleLicensePlate: 'XYZ-456',
  //       vehicleDescription: null,
  //       vehicleFeatures: [
  //         VehicleFeature.ChildSeat,
  //         'invalid-feature' as VehicleFeature,
  //         VehicleFeature.WiFi,
  //       ],
  //     })
  //     .expect(HttpStatus.BadRequest);

  //   const driverResponse = await getPostById(app, createdDriver.id);

  //   expect(driverResponse).toEqual({
  //     ...createdDriver,
  //   });
  // });
});