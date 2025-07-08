"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDB = runDB;
exports.stopDb = stopDb;
const settings_1 = require("../core/settings/settings");
const mongoose_1 = __importDefault(require("mongoose"));
/* const POSTS_COLLECTION_NAME = 'posts';
const BLOGS_COLLECTION_NAME = 'blogs';
const USER_COLLECTION_NAME = 'users';
const COMMENT_COLLECTION_NAME = 'comments';
const REFRESH_TOKEN_SESSIONS_COLLECTION_NAME = 'refreshTokenSessions';
const SECURITY_DEVICES_COLLECTION_NAME = 'securityDevices';

export let client: MongoClient;
export let postCollection: Collection<Post>
export let blogCollection: Collection<Blog>
export let userCollection: Collection<User>
export let commentCollection: Collection<Comment>
export let refreshTokenSessionCollection: Collection<RefreshTokenSession>;
export let securityDevicesCollection: Collection<SecurityDevice>; */
//Connecting to the Database
function runDB(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(url, {
                dbName: settings_1.SETTINGS.DB_NAME
            });
            console.log("✅ Connected to the database with Mongoose");
        }
        catch (e) {
            throw new Error(`❌ Database not connected: ${e}`);
        }
    });
}
// for tests
function stopDb() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    });
}
