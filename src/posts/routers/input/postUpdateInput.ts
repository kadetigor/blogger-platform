import { resourceType } from "../../../core/types/resourceType"
import { postAttributes } from "../../application/dtos/postAttributes";


export type postUpdateInput = {
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
};
