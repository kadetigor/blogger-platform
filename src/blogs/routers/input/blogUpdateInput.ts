import { resourceType } from "../../../core/types/resourceType"
import { blogAttributes } from "../../application/dtos/blogAttributes";


export type blogUpdateInput = {
  data: {
    type: resourceType.Blogs;
    id: string;
    attributes: blogAttributes;
  };
};
