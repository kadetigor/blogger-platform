import { resourceType } from "../../../core/types/resourceType"
import { postAttributes } from "../../application/dtos/post.attributes";


export type postUpdateInput = {
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
};
