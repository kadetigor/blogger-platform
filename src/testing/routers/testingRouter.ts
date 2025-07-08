import { Request, Response, Router } from 'express';
import { BlogModel } from '../../blogs/domain/blog.schema';
import { HttpStatus } from '../../core/types/httpStatus';
import { PostModel } from '../../posts/domain/post.schema';
import { UserModel } from '../../users/domain/user.schema';

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
  await Promise.all([
    PostModel.deleteMany({}),
    BlogModel.deleteMany({}),
    UserModel.deleteMany({})
  ]);
  res.sendStatus(HttpStatus.NoContent);
});
