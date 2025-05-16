import { resourceType } from "../../../core/types/resourceType"

export type postDataOutput = {
  type: resourceType.Posts;
  id: string;
  attributes: {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: Date,
  };
};
