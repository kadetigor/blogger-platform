type commentatorInfo = {
    userId: string;
    userLogin: string;
}

export type commentViewModel = {
    id: string;
    content: string;
    commentatorInfo: commentatorInfo[];
    createdAt: Date;
}