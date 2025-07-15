import express, { Express } from "express";
import cors from "cors";
import { blogsRouter } from "./blogs/routers/blogs.router";
import { postsRouter } from "./posts/routers/posts.router";
import { testingRouter } from "./testing/routers/testingRouter";
import { POSTS_PATH, BLOGS_PATH, TESTING_PATH, USERS_PATH, AUTH_PATH, COMMENTS_PATH, SECURITY_DEVICES_PATH } from './core/paths/paths'
import { usersRouter } from "./users/routers/usersRouter";
import { authRouter } from "./auth/routers/auth.router";
import { commentsRouter } from "./comments/routers/comments.router";
import cookieParser from "cookie-parser";
import { devicesRouter } from "./auth/devices/routers/security-devices.router";


export const setupApp = async (app: Express) => {
  // export const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser())
  app.set('trust proxy', true)

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
  app.use(USERS_PATH, usersRouter);
  app.use(TESTING_PATH, testingRouter);
  app.use(AUTH_PATH, authRouter);
  app.use(COMMENTS_PATH, commentsRouter);
  app.use(SECURITY_DEVICES_PATH, devicesRouter)

  return app;
}
