import express, { Express } from "express";
import cors from "cors";
import { blogsRouter } from "./blogs/routers/blogsRouter";
import { postsRouter } from "./posts/routers/postsRouter";
import { testingRouter } from "./testing/routers/testingRouter";
import { POSTS_PATH, BLOGS_PATH, TESTING_PATH } from './core/paths/paths'
import { superAdminGuardMiddleware } from './auth/middlewares/super-admin.guard-middleware'


export const setupApp = async (app: Express) => {
  // export const app = express();

  app.use(express.json());
  app.use(cors());

  // The following block allows us to write into consol requested endpoint address
  app.use((_req, res, next) => {
    console.log(_req.path);
    next()
  });

  app.get('/', (_req, res) => {
    res.status(200).send('Hello my blogger-platform');
  });
  
  app.use(POSTS_PATH, postsRouter);
  app.use(BLOGS_PATH, blogsRouter);
  app.use(TESTING_PATH, testingRouter);

  return app;
}
