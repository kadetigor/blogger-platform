import { Router, Request, Response } from 'express';
import { db } from '../../db/db';
import { HttpStatus } from '../../core/types/httpStatus';
import {superAdminGuardMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";

export const testingRouter = Router({});

testingRouter
    .delete('/all-data', superAdminGuardMiddleware, (req: Request, res: Response) => {
    db.posts = [];
    db.blogs = [];
    res.sendStatus(HttpStatus.NoContent);
});