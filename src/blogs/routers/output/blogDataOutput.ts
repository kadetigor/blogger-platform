import { resourceType } from "../../../core/types/resourceType"


export type blogDataOutput = {
  type: resourceType.Blogs;
  id: string;
  attributes: {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: Date,
    isMembership: boolean,
  };
}
