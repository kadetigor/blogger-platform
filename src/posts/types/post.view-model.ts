export type LikeDetails = {
    addedAt: Date;
    userId: string;
    login: string;
}

export type ExtendedLikesInfo = {
    likesCount: number;
    dislikesCount: number;
    myStatus: "None" | "Like" | "Dislike";
    newestLikes: LikeDetails[];
}

export type postViewModel = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
    extendedLikesInfo: ExtendedLikesInfo;
}