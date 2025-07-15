// src/comments/domain/comment.ts
export enum myStatus {
    None = "None",
    Like = "Like",
    Dislike = "Dislike",
}

export type Comment = {
    content: string;
    commentatorInfo: {
        userId: string,
        userLogin: string,
    },
    postId: string;
    createdAt: Date;
}