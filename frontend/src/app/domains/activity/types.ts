import {Tag} from "@/app/domains/tag/types.ts";
import {Moment} from 'moment';

export interface Activity {
  id?: number;
  user_id?: number;
  from?: Moment;
  to?: Moment;
  name?: string;
  category_id?: number;
  tags?: Tag[];
  created_at?: string;
  updated_at?: string;
}

// export interface CreateActivityDto {
//   from: Moment;
//   to: Moment;
//   name: string;
//   category_id: number;
//   tags: Tag[];
// }
//
// export interface UpdateActivityDto {
//   from: Moment;
//   to: Moment;
//   name: string;
//   category_id: number;
//   tags: Tag[];
// }