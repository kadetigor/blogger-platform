"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.superAdminGuardMiddleware = exports.ADMIN_PASSWORD = exports.ADMIN_USERNAME = void 0;
const httpStatus_1 = require("../../core/types/httpStatus");
// process - это глобальный объект в Node.js, который предоставляет информацию о текущем процессе Node.js
// env — это объект, который хранит все переменные окружения текущего процесса. Переменные окружения — это значения,
// которые могут быть установлены на уровне операционной системы или приложения и которые могут использоваться для
// настройки поведения программного обеспечения (например, пароли, ключи API, пути к файлам и т. д.)
exports.ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
exports.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qwerty';
const superAdminGuardMiddleware = (req, res, next) => {
    const auth = req.headers['authorization']; // 'Basic xxxx'
    if (!auth) {
        res.sendStatus(httpStatus_1.HttpStatus.Unauthorized);
        return;
    }
    const [authType, token] = auth.split(' '); //admin:qwerty
    if (authType !== 'Basic') {
        res.sendStatus(httpStatus_1.HttpStatus.Unauthorized);
        return;
    }
    const credentials = Buffer.from(token, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    if (username !== exports.ADMIN_USERNAME || password !== exports.ADMIN_PASSWORD) {
        res.sendStatus(httpStatus_1.HttpStatus.Unauthorized);
        return;
    }
    next(); // Успешная авторизация, продолжаем
};
exports.superAdminGuardMiddleware = superAdminGuardMiddleware;
