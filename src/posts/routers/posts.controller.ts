import { inject, injectable } from "inversify";
import { PostsRepository } from "../repositories/posts.repository";
import { PostsService } from "../application/posts.service";
import { PostLikeRepository } from "../repositories/post.likes.repository";
import { PostsQueryRepository } from "../repositories/posts.query-repository";
import { mapToPostViewModel } from "./mappers/mapToPostViewModel";
import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/httpStatus";
import { errorsHandler } from "../../core/errors/errorsHandler";
import { setDefaultSortAndPaginationIfNotExist } from "../../core/helpers/setDefaultSortAndPagination";
import { postQueryInput } from "./input/postQueryInput";
import { postSortField } from "./input/postSortField";
import { sortDirection } from "../../core/types/sortDirection";
import { mapToPostListPaginatedOutput } from "../../blogs/routers/mappers/map.to.post.list.paginated.output";
import { postUpdateInput } from "./input/postUpdateInput";


@injectable()
export class PostsController {

    constructor(
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
        @inject(PostsService) protected postsService: PostsService,
        @inject(PostLikeRepository) protected postsLikeRepository: PostLikeRepository,
    ) {}

    async createPostHandler(
        req: Request,
        res: Response,
    ): Promise<void> {

        const blogId = req.body.blogId

        try {
            
            const createdPostId = await this.postsService.create({...req.body, blogId});
            const createdPost = await this.postsRepository.findByIdOrFail(createdPostId);
            const postViewModel = mapToPostViewModel(createdPost);

            res.status(HttpStatus.Created).send(postViewModel);
        } catch (e: unknown) {
            return errorsHandler(e, res);
        }
    }

    async deletePostHandler(req: Request<{ id: string }>, res: Response) {
        try {
            const id = req.params.id;
            await this.postsRepository.delete(id);
            res.sendStatus(HttpStatus.NoContent);
        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }

    async getPostHandler(req: Request, res: Response) {
      try {
        const id = req.params.id;
        const post = await this.postsQueryRepository.findByIdOrFail(id);
        const postViewModel = mapToPostViewModel(post);
        res.status(HttpStatus.Ok).send(postViewModel);
    
      } catch (e: unknown) {
        errorsHandler(e, res);
      }
    }

    async getPostListHandler(
      req: Request, 
      res: Response,
    ) {
      try {
        const baseQueryInput = setDefaultSortAndPaginationIfNotExist(req.query as any)
        
        const queryInput: postQueryInput = {
          pageNumber: baseQueryInput.pageNumber,
          pageSize: baseQueryInput.pageSize,
          sortBy: baseQueryInput.sortBy as postSortField,
          sortDirection: baseQueryInput.sortDirection as sortDirection
        };
    
        const { items, totalCount } = await this.postsQueryRepository.findMany(queryInput)
        
        const postsListOutput = mapToPostListPaginatedOutput(items, {
          pageNumber: queryInput.pageNumber,
          pageSize: queryInput.pageSize,
          totalCount,
        });
        res.send(postsListOutput);
    
      } catch (e: unknown) {
        errorsHandler(e, res);
      }
    }

    async updatePostHandler(
        req: Request<{ id: string }, {}, postUpdateInput>,
        res: Response,
    ) {
        console.log('got to updatePostHandler')
        try {
            const id = req.params.id;
            await this.postsService.update(id, req.body);
            res.sendStatus(HttpStatus.NoContent);
        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }
}