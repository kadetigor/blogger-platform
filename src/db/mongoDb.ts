import { Collection, Db, MongoClient } from 'mongodb';
import { Blog } from '../blogs/domain/blog';
import { Post } from '../posts/domain/post';
import { SETTINGS } from '../core/settings/settings';
import { User } from '../users/domain/user';


const POSTS_COLLECTION_NAME = 'posts';
const BLOGS_COLLECTION_NAME = 'blogs';
const USER_COLLECTION_NAME = 'users';

export let client: MongoClient;
export let postCollection: Collection<Post>
export let blogCollection: Collection<Blog>
export let userCollection: Collection<User>

// Connectiong to the DataBase
export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  postCollection = db.collection<Post>(POSTS_COLLECTION_NAME);
  blogCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME);
  userCollection = db.collection<User>(USER_COLLECTION_NAME)

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
