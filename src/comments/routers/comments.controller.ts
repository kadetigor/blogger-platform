// src/comments/routers/comments.controller.ts
import { inject, injectable } from "inversify";
import { Request, Response } from 'express';
import { CommentsService } from '../application/comments.service';
import { CommentsRepository } from '../repositories/comments.repository';
import { mapToCommentViewModel } from './mappers/map.to.comment.view.model';
import { HttpStatus } from '../../core/types/httpStatus';
import { errorsHandler } from '../../core/errors/errorsHandler';
import { commentsQueryRepository } from "../repositories/comments.query.repository";
import { setDefaultSortAndPaginationIfNotExist } from "../../core/helpers/setDefaultSortAndPagination";
import { commentQueryInput } from "./input/comment.query.input";
import { commentSortField } from "./input/comment.sort.field";
import { sortDirection } from "../../core/types/sortDirection";
import { mapToCommentListPaginatedOutput } from "./mappers/map.to.comment.list.paginated.output";
import { CommentLikesRepository } from "../repositories/comment.likes.repository";


@injectable()
export class CommentsController {

    constructor(
        @inject(CommentsService) protected commentsService: CommentsService,
        @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
        @inject(commentsQueryRepository) protected commentsQueryRepository: commentsQueryRepository,
        @inject(CommentLikesRepository) protected commentLikesRepository: CommentLikesRepository
    ) {}

    async createCommentHandler(
        req: Request,
        res: Response,
    ): Promise<void> {
        try {
            const postId = req.params.id; // Get postId from URL params
            const { content } = req.body;
            const user = req.user; // This should be populated by accessTokenGuard

            if (!user) {
                res.sendStatus(HttpStatus.Unauthorized);
                return;
            }

            const createdCommentId = await this.commentsService.create({
                content,
                userId: user.id,
                userLogin: user.login,
                postId
            });

            const createdComment = await this.commentsRepository.findByIdOrFail(createdCommentId);
            
            // Get likes info for the new comment (will be 0 likes, 0 dislikes, None status)
            const likesInfo = await this.commentLikesRepository.getLikesInfo(createdCommentId, user.id);
            
            const commentViewModel = mapToCommentViewModel(createdComment, likesInfo);

            res.status(HttpStatus.Created).send(commentViewModel);
        } catch (e: unknown) {
            return errorsHandler(e, res);
        }
    }

    async deleteCommentHandler(
      req: Request<{ commentId: string }>, 
      res: Response
    ) {
      try {
        const commentId = req.params.commentId;
        const user = req.user;
    
        if (!user) {
          res.sendStatus(HttpStatus.Unauthorized);
          return;
        }
    
        // Check if comment exists and user is the owner
        const comment = await this.commentsQueryRepository.findByIdOrFail(commentId);
        
        if (comment.commentatorInfo.userId !== user.id) {
          res.sendStatus(HttpStatus.Forbidden);
          return;
        }
    
        await this.commentsService.delete(commentId);
        res.sendStatus(HttpStatus.NoContent);
      } catch (e: unknown) {
        errorsHandler(e, res);
      }
    }

    async getCommentHandler(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const comment = await this.commentsQueryRepository.findByIdOrFail(id);
            
            // Get user id from auth token if available
            const userId = req.user?.id;
            
            // Get likes info
            const likesInfo = await this.commentLikesRepository.getLikesInfo(id, userId);
            
            const commentViewModel = mapToCommentViewModel(comment, likesInfo);
            res.status(HttpStatus.Ok).send(commentViewModel);

        } catch (e: unknown) {
            errorsHandler(e, res);
        }
    }

    async getCommentListHandler(
      req: Request, 
      res: Response,
    ) {
      try {
        const postId = req.params.id; // Get postId from URL params
        const baseQueryInput = setDefaultSortAndPaginationIfNotExist(req.query as any)
        
        const queryInput: commentQueryInput = {
          pageNumber: baseQueryInput.pageNumber,
          pageSize: baseQueryInput.pageSize,
          sortBy: baseQueryInput.sortBy as commentSortField,
          sortDirection: baseQueryInput.sortDirection as sortDirection
        };
    
        const { items, totalCount } = await this.commentsQueryRepository.findCommentsByPost(queryInput, postId)
        
        // Get user id from auth token if available
        const userId = req.user?.id;
        
        // Get likes info for all comments
        const likesInfoMap = new Map<string, { likesCount: number; dislikesCount: number; myStatus: "None" | "Like" | "Dislike" }>();
        await Promise.all(
          items.map(async (comment) => {
            const likesInfo = await this.commentLikesRepository.getLikesInfo(comment._id.toString(), userId);
            likesInfoMap.set(comment._id.toString(), likesInfo);
          })
        );
        
        const commentsListOutput = mapToCommentListPaginatedOutput(items, likesInfoMap, {
          pageNumber: queryInput.pageNumber,
          pageSize: queryInput.pageSize,
          totalCount,
        });
        res.send(commentsListOutput);
    
      } catch (e: unknown) {
        errorsHandler(e, res);
      }
    }

    async updateCommentHandler(
        req: Request<{ commentId: string }>,
        res: Response,
    ) {
        try {
            const commentId = req.params.commentId;
            const { content } = req.body;
            const user = req.user;

            if (!user) {
            res.sendStatus(HttpStatus.Unauthorized);
            return;
            }

            // Check if comment exists and user is the owner
            const comment = await this.commentsQueryRepository.findByIdOrFail(commentId);
            
            if (comment.commentatorInfo.userId !== user.id) {
            res.sendStatus(HttpStatus.Forbidden);
            return;
            }

            await this.commentsService.update(commentId, { content });
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
        
        await this.commentsService.updateLikeInfo(commentId, user.id, status);
        res.sendStatus(HttpStatus.NoContent);
      } catch (e: unknown) {
        errorsHandler(e, res);
      }
    }
}