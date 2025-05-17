import { resourceType } from "../../../core/types/resourceType"
import { blogAttributes } from "../../application/dtos/blogAttributes";


export type blogUpdateInput = {
  name: string,
  description: string,
  websiteUrl: string,
};
