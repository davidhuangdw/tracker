export interface Tag {
  id: number;
  user_id: number;
  name: string;
  color: string;
  description: string;
  created_at: string;
  updated_at: string;
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