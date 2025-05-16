import { resourceType } from "../../../core/types/resourceType"
import { blogAttributes } from "../../application/dtos/blogAttributes";


export type blogCreateInput = {
  data: {
    type: resourceType.Blogs;
    attributes: blogAttributes;
  };
};
