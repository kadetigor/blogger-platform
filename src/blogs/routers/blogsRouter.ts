import {Router, Request, Response} from 'express';
import {db} from "../../db/db";
import {getBlogHandler} from "./handlers/getBlogHandler";
import {createBlogHandler} from "./handlers/createBlogHandler";
import {deleteBlogHandler} from "./handlers/deleteBlogHandler";
import {getBlogsListHandler} from "./handlers/getBlogListHandler";
import {updateBlogHandler} from "./handlers/updateBlogHandler";
import {idValidationMiddleware} from "../../core/middlewares/validation/params-id.validation-middleware";
import {blogInputDtoValidation} from "../validation/blogInputDtoValidationMiddleware";
import {superAdminGuardMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";

export const blogsRouter = Router()

blogsRouter
    .get('/', getBlogsListHandler) // blogsController.getBlogs
    .get('/:id', idValidationMiddleware, inputValidationResultMiddleware, getBlogHandler)
    .post('/', superAdminGuardMiddleware, blogInputDtoValidation, inputValidationResultMiddleware, createBlogHandler)
    .put('/:id', superAdminGuardMiddleware, idValidationMiddleware, blogInputDtoValidation, inputValidationResultMiddleware, updateBlogHandler)
    .delete('/:id', superAdminGuardMiddleware, idValidationMiddleware, inputValidationResultMiddleware, deleteBlogHandler)
