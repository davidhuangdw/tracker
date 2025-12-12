import API from "@/app/constants/api.ts";
import {EMPTY_ARR} from "@/shared/constants.ts";
import {Category, CreateCategoryDto, UpdateCategoryDto} from "./types.ts";
import {useFetchData} from "@/shared/utils/api.ts";

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await API.get('/categories');
    return response.data || EMPTY_ARR;
  },
  getById: async (id: number): Promise<Category> => {
    const response = await API.get(`/categories/${id}`);
    return response.data;
  },
  create: async (category: CreateCategoryDto): Promise<Category> => {
    const response = await API.post('/categories', category);
    return response.data;
  },
  update: async (id: number, category: UpdateCategoryDto): Promise<Category> => {
    const response = await API.put(`/categories/${id}`, category);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await API.delete(`/categories/${id}`);
  },
};

export const useFetchCategories = (): [Category[], () => void] => {
  const {data, refetch} = useFetchData<Category[]>('/categories');
  return [data || EMPTY_ARR, refetch];
};

export default categoryApi;