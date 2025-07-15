export type PostLike = {
    postId: string;
    userId: string;
    status: "Like" | "Dislike";
    createdAt: Date;
}