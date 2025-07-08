
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
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: myStatus
    } 
}