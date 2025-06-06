export type Comment = {
    content: string;
    commentatorInfo: {
        userId: string,
        userLogin: string,
    },
    postId: string;
    createdAt: Date;
}