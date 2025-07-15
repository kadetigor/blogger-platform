import { Request, Response, Router } from 'express';
import { BlogModel } from '../../blogs/domain/blog.schema';
import { HttpStatus } from '../../core/types/httpStatus';
import { PostModel } from '../../posts/domain/post.schema';
import { UserModel } from '../../users/domain/user.schema';
import { CommentModel } from '../../comments/domain/comment.schema';
import { CommentLikeModel } from '../../comments/domain/comment.like.schema';
import { RefreshTokenSessionModel } from '../../auth/domain/refresh.token.session.schema';
import { SecurityDeviceModel } from '../../auth/devices/security.device.schema';
import { PostLikeModel } from '../../posts/domain/post.like.schema';

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
  await Promise.all([
    PostModel.deleteMany({}),
    PostLikeModel.deleteMany({}),
    BlogModel.deleteMany({}),
    UserModel.deleteMany({}),
    CommentModel.deleteMany({}),
    CommentLikeModel.deleteMany({}),
    RefreshTokenSessionModel.deleteMany({}),
    SecurityDeviceModel.deleteMany({})
  ]);
  res.sendStatus(HttpStatus.NoContent);
});
