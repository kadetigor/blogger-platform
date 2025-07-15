import 'reflect-metadata';
import { Container, ContainerModule } from "inversify";
import { UsersRepository } from './users/repositories/usersRepository';
import { UsersService } from './users/application/usersService';
import { UsersQueryRepository } from './users/repositories/usersQueryRepository';
import { UsersController } from './users/routers/users.controller';
import { BcryptService } from './auth/adapters/bcrypt.adapter';
import { SecurityDeviceRepository } from './auth/devices/security-device.repository';
import { SecurityDevicesService } from './auth/devices/security-devices.service';
import { RefreshTokenSessionsRepository } from './auth/repositories/refresh.token.sessions.repository';
import { JwtService } from './auth/adapters/jwt.adapter';
import { AuthService } from './auth/application/auth.service';
import { AuthController } from './auth/routers/auth.controller';
import { ScurityDevicesController } from './auth/devices/routers/security-devices.controller';
import { CommentsRepository } from './comments/repositories/comments.repository';
import { commentsQueryRepository } from './comments/repositories/comments.query.repository';
import { CommentsService } from './comments/application/comments.service';
import { CommentsController } from './comments/routers/comments.controller';
import { CommentLikesRepository } from './comments/repositories/comment.likes.repository';
import { PostsRepository } from './posts/repositories/posts.repository';
import { PostsQueryRepository } from './posts/repositories/posts.query-repository';
import { PostsService } from './posts/application/posts.service';
import { PostsController } from './posts/routers/posts.controller';
import { BlogsRepository } from './blogs/repositories/blogs.repository';
import { BlogsQueryRepository } from './blogs/repositories/blogs.query-repository';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsController } from './blogs/routers/blogs.controller';
import { PostLikeRepository } from './posts/repositories/post.likes.repository';

export const container = new Container();

// Users
container.bind(UsersRepository).toSelf();
container.bind(UsersService).toSelf();
container.bind(UsersQueryRepository).toSelf();
container.bind(UsersController).toSelf();

// Blogs
container.bind(BlogsRepository).toSelf();
container.bind(BlogsQueryRepository).toSelf();
container.bind(BlogsService).toSelf();
container.bind(BlogsController).toSelf();

// Posts
container.bind(PostsRepository).toSelf();
container.bind(PostsQueryRepository).toSelf();
container.bind(PostsService).toSelf();
container.bind(PostsController).toSelf();
container.bind(PostLikeRepository).toSelf();

// Auth
container.bind(AuthController).toSelf();
container.bind(BcryptService).toSelf()
container.bind(SecurityDeviceRepository).toSelf()
container.bind(SecurityDevicesService).toSelf()
container.bind(RefreshTokenSessionsRepository).toSelf()
container.bind(JwtService).toSelf()
container.bind(AuthService).toSelf()
container.bind(ScurityDevicesController).toSelf()

// Comments
container.bind(CommentsRepository).toSelf();
container.bind(commentsQueryRepository).toSelf();
container.bind(CommentsService).toSelf();
container.bind(CommentsController).toSelf();
container.bind(CommentLikesRepository).toSelf();