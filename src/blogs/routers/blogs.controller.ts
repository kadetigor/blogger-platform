import { inject, injectable } from "inversify";
import { BlogsRepository } from "../repositories/blogs.repository";
import { BlogsService } from "../application/blogs.service";
import { BlogsQueryRepository } from "../repositories/blogs.query-repository";
import { Request, Response } from "express";
import { blogCreateInput } from "./input/blog.create-input";
import { errorsHandler } from "../../core/errors/errorsHandler";
import { HttpStatus } from "../../core/types/httpStatus";
import { mapToBlogOutput } from "./mappers/map.to.blog.output";
import { blogQueryInput } from "./input/blog.query-input";
import { paginationAndSortingDefault } from "../../core/middlewares/validation/queryPaginationSortingValidationMiddleware";
import { blogSortField } from "./input/blog.sort-field";
import { sortDirection } from "../../core/types/sortDirection";
import { mapToBlogListPaginatedOutput } from "./mappers/map.to.blog.list.paginated.output";
import { repositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";
import { postQueryInput } from "../../posts/routers/input/postQueryInput";
import { postSortField } from "../../posts/routers/input/postSortField";
import { PostsQueryRepository } from "../../posts/repositories/posts.query-repository";
import { mapToPostListPaginatedOutput } from "./mappers/map.to.post.list.paginated.output";
import { blogUpdateInput } from "./input/blog.update-input";

@injectable()
export class BlogsController {
    constructor(
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
        @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
        @inject(BlogsService) protected blogsService: BlogsService,
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
    ) {}

    async createBlogHandler(
        req: Request<{}, {}, blogCreateInput>,
        res: Response,
    ) {
        try {
            const createdBlogId = await this.blogsService.create(req.body);

            const createdBlog = await this.blogsRepository.findByIdOrFail(createdBlogId);

            const blogOutput = mapToBlogOutput(createdBlog);

            res.status(HttpStatus.Created).send(blogOutput);

        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }

    async deleteBlogHandler(
        req: Request<{ id: string }>,
        res: Response,
    ) {
        try {
            const id = req.params.id;

            await this.blogsService.delete(id);

            res.sendStatus(HttpStatus.NoContent);
        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }

    async getBlogHandler(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const blog = await this.blogsQueryRepository.findByIdOrFail(id);

            const blogOutput = mapToBlogOutput(blog);

            res.status(HttpStatus.Ok).send(blogOutput);

        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }

    async getBlogListHandler(
        req: Request,
        res: Response,
    ) {
        try {
            const queryInput: blogQueryInput = {
            pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : paginationAndSortingDefault.pageNumber,
            pageSize: req.query.pageSize ? Number(req.query.pageSize) : paginationAndSortingDefault.pageSize,
            sortBy: (req.query.sortBy as blogSortField) || paginationAndSortingDefault.sortBy,
            sortDirection: (req.query.sortDirection as sortDirection) || paginationAndSortingDefault.sortDirection,
            searchNameTerm: typeof req.query.searchNameTerm === "string" ? req.query.searchNameTerm.trim() : ""
            };

            const { items, totalCount } = await this.blogsQueryRepository.findMany(queryInput);

            const blogsListOutput = mapToBlogListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
            });

            res.send(blogsListOutput);
        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }

    async getBlogPostsListHandler(
        req: Request,
        res: Response,
    ) {
        try {
            const blogId = req.params.id;

            const blog = await this.blogsQueryRepository.findByIdOrFail(blogId);

            if (!blog) {
            throw new repositoryNotFoundError('Blog does not exist');
            }
            
            const queryInput: postQueryInput = {
            pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : paginationAndSortingDefault.pageNumber,
            pageSize: req.query.pageSize ? Number(req.query.pageSize) : paginationAndSortingDefault.pageSize,
            sortBy: (req.query.sortBy as postSortField) || paginationAndSortingDefault.sortBy,
            sortDirection: (req.query.sortDirection as sortDirection) || paginationAndSortingDefault.sortDirection
            };

            const { items, totalCount } = await this.postsQueryRepository.findPostsbyBlog(
            queryInput,
            blogId,
            );

            const postListOutput = mapToPostListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
            });
            res.send(postListOutput);
        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }

    async updateBlogHandler(
        req: Request<{ id: string }, {}, blogUpdateInput>,
        res: Response,
    ) {
        try {
            const id = req.params.id;
            await this.blogsService.update(id, req.body);
            res.sendStatus(HttpStatus.NoContent);
        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }
}