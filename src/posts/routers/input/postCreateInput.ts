import { resourceType } from "../../../core/types/resourceType";
import { blogAttributes } from "../../../blogs/application/dtos/blog.attributes";
import { postAttributes } from "../../application/dtos/post.attributes";

export type postCreateInput = {
  data: {
    type: resourceType.Posts;
    attributes: postAttributes;
  };
};
