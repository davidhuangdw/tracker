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

export interface Category {
  id: number;
  user_id: number;
  name: string;
  color: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  user_id: number;
  name: string;
  color: string;
  description: string;
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

export interface CreateCategoryDto {
  name: string;
  color: string;
  description: string;
}

export interface UpdateCategoryDto {
  name: string;
  color: string;
  description: string;
}

export interface CreateTagDto {
  name: string;
  color: string;
  description: string;
}

export interface UpdateTagDto {
  name: string;
  color: string;
  description: string;
}


export const EMPTY_ARR = []
