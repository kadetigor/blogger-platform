"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const usersRepository_1 = require("./users/repositories/usersRepository");
const usersService_1 = require("./users/application/usersService");
const usersQueryRepository_1 = require("./users/repositories/usersQueryRepository");
const users_controller_1 = require("./users/routers/users.controller");
const bcrypt_adapter_1 = require("./auth/adapters/bcrypt.adapter");
const security_device_repository_1 = require("./auth/devices/security-device.repository");
const security_devices_service_1 = require("./auth/devices/security-devices.service");
const refresh_token_sessions_repository_1 = require("./auth/repositories/refresh.token.sessions.repository");
const jwt_adapter_1 = require("./auth/adapters/jwt.adapter");
const auth_service_1 = require("./auth/application/auth.service");
const auth_controller_1 = require("./auth/routers/auth.controller");
const security_devices_controller_1 = require("./auth/devices/routers/security-devices.controller");
const comments_repository_1 = require("./comments/repositories/comments.repository");
const comments_query_repository_1 = require("./comments/repositories/comments.query.repository");
const comments_service_1 = require("./comments/application/comments.service");
const comments_controller_1 = require("./comments/routers/comments.controller");
exports.container = new inversify_1.Container();
// Users
exports.container.bind(usersRepository_1.UsersRepository).toSelf();
exports.container.bind(usersService_1.UsersService).toSelf();
exports.container.bind(usersQueryRepository_1.UsersQueryRepository).toSelf();
exports.container.bind(users_controller_1.UsersController).toSelf();
// Blogs
/* container.bind(BlogsRepository).toSelf();
container.bind(BlogsQueryRepository).toSelf();
container.bind(BlogsService).toSelf();
container.bind(BlogsController).toSelf(); */
// Posts
/* container.bind(PostsRepository).toSelf();
container.bind(PostsQueryRepository).toSelf();
container.bind(PostsService).toSelf();
container.bind(PostsController).toSelf(); */
// Auth
exports.container.bind(auth_controller_1.AuthController).toSelf();
exports.container.bind(bcrypt_adapter_1.BcryptService).toSelf();
exports.container.bind(security_device_repository_1.SecurityDeviceRepository).toSelf();
exports.container.bind(security_devices_service_1.SecurityDevicesService).toSelf();
exports.container.bind(refresh_token_sessions_repository_1.RefreshTokenSessionsRepository).toSelf();
exports.container.bind(jwt_adapter_1.JwtService).toSelf();
exports.container.bind(auth_service_1.AuthService).toSelf();
exports.container.bind(security_devices_controller_1.ScurityDevicesController).toSelf();
// Comments
exports.container.bind(comments_repository_1.CommentsRepository).toSelf();
exports.container.bind(comments_query_repository_1.commentsQueryRepository).toSelf();
exports.container.bind(comments_service_1.CommentsService).toSelf();
exports.container.bind(comments_controller_1.CommentsController).toSelf();
