import { Collection, Db, MongoClient } from 'mongodb';
import { Blog } from '../blogs/domain/blog';
import { Post } from '../posts/domain/post';
import { SETTINGS } from '../core/settings/settings';
import { User } from '../users/domain/user';
import { Comment } from '../comments/domain/comment';
import { RefreshTokenSession } from '../auth/domain/refresh.token.session';


const POSTS_COLLECTION_NAME = 'posts';
const BLOGS_COLLECTION_NAME = 'blogs';
const USER_COLLECTION_NAME = 'users';
const COMMENT_COLLECTION_NAME = 'comments';
const REFRESH_TOKEN_SESSIONS_COLLECTION_NAME = 'refreshTokenSessions';

export let client: MongoClient;
export let postCollection: Collection<Post>
export let blogCollection: Collection<Blog>
export let userCollection: Collection<User>
export let commentCollection: Collection<Comment>
export let refreshTokenSessionCollection: Collection<RefreshTokenSession>;

// Connectiong to the DataBase
export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  postCollection = db.collection<Post>(POSTS_COLLECTION_NAME);
  blogCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME);
  userCollection = db.collection<User>(USER_COLLECTION_NAME);
  commentCollection = db.collection<Comment>(COMMENT_COLLECTION_NAME);
  refreshTokenSessionCollection = db.collection<RefreshTokenSession>(REFRESH_TOKEN_SESSIONS_COLLECTION_NAME);

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log("✅ Connected to the database")
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`)
  }
}

// for tests
export async function stopDb() {
  if (!client) {
    throw new Error(`❌ No active client`)
  }
  await client.close()
}
