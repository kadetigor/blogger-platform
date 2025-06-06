import { resourceType } from "../../../core/types/resourceType"


export type commentDataOutput = {
    type: resourceType.Comments;
    id: string;
    attributes: {
        content: string,
        commentatorInfo: {
            userId: string,
            userLogin: string,
        },
        createdAt: Date
    }
}