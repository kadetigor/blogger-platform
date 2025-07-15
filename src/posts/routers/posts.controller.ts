import { inject, injectable } from "inversify";
import { PostsRepository } from "../repositories/posts.repository";
import { PostsService } from "../application/posts.service";
import { PostLikeRepository } from "../repositories/post.likes.repository";
import { PostsQueryRepository } from "../repositories/posts.query-repository";
import { mapToPostViewModel } from "./mappers/map.to.post.view-model";
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
        @inject(PostLikeRepository) protected postLikesRepository: PostLikeRepository,
    ) {}

    async createPostHandler(
        req: Request,
        res: Response,
    ): Promise<void> {

        const blogId = req.body.blogId

        try {
            
            const createdPostId = await this.postsService.create({...req.body, blogId});
            const createdPost = await this.postsRepository.findByIdOrFail(createdPostId);

            const extendedLikesInfo = {
              likesCount: 0,
              dislikesCount: 0,
              myStatus: 'None' as const,
              newestLikes: []
            };

            const postViewModel = mapToPostViewModel(createdPost, extendedLikesInfo);

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
        const userId = req.user?.id;

        const extendedLikesInfo = await this.postLikesRepository.getExtendedLikesInfo(id, userId);

        const postViewModel = mapToPostViewModel(post, extendedLikesInfo);
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

    async updateLikeHandler(
      req: Request,
      res: Response,
    ) {
      try {
        const commentId = req.params.commentId;
        const status = req.body.likeStatus;
        const user = req.user;

        if (!user) {
            res.sendStatus(HttpStatus.Unauthorized);
            return;
        }
        
        await this.postsService.updateLikeInfo(commentId, user.id, status);
        res.sendStatus(HttpStatus.NoContent);
      } catch (e: unknown) {
        errorsHandler(e, res);
      }
    }
}