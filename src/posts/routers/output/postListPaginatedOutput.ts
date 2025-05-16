import { paginatedOutput } from "../../../core/types/paginatedOutput"
import { postDataOutput } from "./postDataOutput";

export type postListPaginatedOutput = {
  meta: paginatedOutput;
  data: postDataOutput[];
};
