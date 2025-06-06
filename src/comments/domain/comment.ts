export type Comment = {
    content: string;
    commentatorInfo: {
        userId: string,
        userLogin: string,
    },
    createdAt: Date;
}