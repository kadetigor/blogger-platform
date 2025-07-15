export type CommentLike = {
    commentId: string;
    userId: string;
    status: "Like" | "Dislike";
    createdAt: Date;
}