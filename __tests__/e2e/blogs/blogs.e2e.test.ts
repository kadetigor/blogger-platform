import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/app';
import { HttpStatus } from '../../../src/core/types/httpStatus';
import { blogInputDto } from '../../../src/blogs/dto/blogsDto';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { getBlogDto } from '../../utils/blogs/getBlogDto';
import { generateBasicAuthToken } from '../../utils/generateAdminAuthToken';
import { createBlog } from '../../utils/blogs/createBlog';
import { clearDb } from '../../utils/clearDb';
import { getBlogById } from '../../utils/blogs/getBlogById';
import { updateBlog } from '../../utils/blogs/updateBlog';
import { runDB } from '../../../src/db/mongoDb';

describe('Blog API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB('mongodb://localhost:27017/ed-back-lessons-uber-test');
    await clearDb(app);
  });

  it('✅ should create driver; POST /api/blogs', async () => {
    const newBlog: blogInputDto = {
      ...getBlogDto(),
      name: 'Vlad blog',
      description: 'This blog belongs to vlad',
    };

    await createBlog(app, newBlog);
  });

  it('✅ should return blogs list; GET /api/blogs', async () => {
    await createBlog(app);

    const response = await request(app)
      .get(BLOGS_PATH)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });

  it('✅ should return blog by id; GET /api/blogs/:id', async () => {
    const createdBlog = await createBlog(app);

    const blog = await getBlogById(app, createdBlog.id);

    expect(blog).toEqual({
      ...createdBlog,
      id: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  //   it('✅ should update driver; PUT /api/drivers/:id', async () => {
  //     const createdDriver = await createBlog(app);

  //     const driverUpdateData: blogInputDto = {
  //       name: 'Updated Name',
  //       phoneNumber: '999-888-7777',
  //       email: 'updated@example.com',

  //       vehicleMake: 'Tesla',
  //       vehicleModel: 'Model S',
  //       vehicleYear: 2022,
  //       vehicleLicensePlate: 'NEW-789',
  //       vehicleDescription: 'Updated vehicle description',
  //       vehicleFeatures: [VehicleFeature.ChildSeat],
  //     };

  //     await updateDriver(app, createdDriver.id, driverUpdateData);

  //     const driverResponse = await getBlogById(app, createdDriver.id);

  //     expect(driverResponse).toEqual({
  //       id: createdDriver.id,
  //       name: driverUpdateData.name,
  //       phoneNumber: driverUpdateData.phoneNumber,
  //       email: driverUpdateData.email,
  //       vehicle: {
  //         description: driverUpdateData.vehicleDescription,
  //         features: driverUpdateData.vehicleFeatures,
  //         licensePlate: driverUpdateData.vehicleLicensePlate,
  //         make: driverUpdateData.vehicleMake,
  //         model: driverUpdateData.vehicleModel,
  //         year: driverUpdateData.vehicleYear,
  //       },
  //       createdAt: expect.any(String),
  //     });
  //   });

  //   it('✅ should delete driver and check after "NOT FOUND"; DELETE /api/drivers/:id', async () => {
  //     const createdDriver = await createBlog(app);

  //     await request(app)
  //       .delete(`${BLOGS_PATH}/${createdDriver.id}`)
  //       .set('Authorization', adminToken)
  //       .expect(HttpStatus.NoContent);

  //     await request(app)
  //       .get(`${BLOGS_PATH}/${createdDriver.id}`)
  //       .set('Authorization', adminToken)
  //       .expect(HttpStatus.NotFound);
  //   });
});
