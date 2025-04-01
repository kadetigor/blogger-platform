import express from "express";
import cors from "cors";
import {blogsRouter} from "./blogs/routers/blogsRouter";
import {postsRouter} from "./posts/routers/postsRouter";
import {testingRouter} from "./testing/routers/testingRouter";
import {POSTS_PATH, BLOGS_PATH, TESTING_PATH} from './core/paths/paths'

export const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send('Hello my blogger-platform');
});

app.use(POSTS_PATH, postsRouter);
app.use(BLOGS_PATH, blogsRouter);
app.use(TESTING_PATH, testingRouter);
