import { SETTINGS } from '../core/settings/settings';
import mongoose from 'mongoose';


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
export async function runDB(url: string): Promise<void> {
  try {
    await mongoose.connect(url, {
      dbName: SETTINGS.DB_NAME
    });
    console.log("✅ Connected to the database with Mongoose");
  } catch (e) {
    throw new Error(`❌ Database not connected: ${e}`);
  }
}

// for tests
export async function stopDb() {
  await mongoose.connection.close();
}
