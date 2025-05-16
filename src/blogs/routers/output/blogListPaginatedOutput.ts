import { paginatedOutput } from "../../../core/types/paginatedOutput"
import { blogDataOutput } from "./blogDataOutput";


export type blogListPaginatedOutput = {
  meta: paginatedOutput;
  data: blogDataOutput[];
};
