"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const blogsRouter_1 = require("./blogs/routers/blogsRouter");
const postsRouter_1 = require("./posts/routers/postsRouter");
const testingRouter_1 = require("./testing/routers/testingRouter");
const paths_1 = require("./core/paths/paths");
const setupApp = (app) => __awaiter(void 0, void 0, void 0, function* () {
    // export const app = express();
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.get('/', (_req, res) => {
        res.status(200).send('Hello my blogger-platform');
    });
    app.use(paths_1.POSTS_PATH, postsRouter_1.postsRouter);
    app.use(paths_1.BLOGS_PATH, blogsRouter_1.blogsRouter);
    app.use(paths_1.TESTING_PATH, testingRouter_1.testingRouter);
    return app;
});
exports.setupApp = setupApp;
