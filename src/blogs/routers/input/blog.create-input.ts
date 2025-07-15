import { resourceType } from "../../../core/types/resourceType"
import { blogAttributes } from "../../application/dtos/blog.attributes";


export type blogCreateInput = {
  name: string,
  description: string,
  websiteUrl: string,
};
