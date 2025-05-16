import { resourceType } from "../../../core/types/resourceType"
import { postAttributes } from "../../application/dtos/postAttributes";


export type postUpdateInput = {
  data: {
    type: resourceType.Posts;
    id: string;
    attributes: postAttributes;
  };
};
