export interface Category {
  id: number;
  user_id: number;
  name: string;
  color: string;
  description: string;
  created_at: string;
  updated_at: string;
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