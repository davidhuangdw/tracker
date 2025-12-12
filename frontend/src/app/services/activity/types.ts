import {Tag} from "@/app/services/tag/types.ts";

export interface Activity {
  id: number;
  user_id: number;
  from: string;
  to: string;
  name: string;
  category_id: number;
  tags: Tag[];
  created_at: string;
  updated_at: string;
}

export interface CreateActivityDto {
  from: string;
  to: string;
  name: string;
  category_id: number;
  tags: Tag[];
}

export interface UpdateActivityDto {
  from: string;
  to: string;
  name: string;
  category_id: number;
  tags: Tag[];
}