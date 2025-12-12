import API from "@/app/constants/api.ts";
import {CreateTagDto, Tag, UpdateTagDto} from "./types.ts";
import {EMPTY_ARR} from "@/shared/constants.ts";
import {useFetchData} from "@/shared/utils/api.ts";

export const tagApi = {
  getAll: async (): Promise<Tag[]> => {
    const response = await API.get('/tags');
    return response.data || EMPTY_ARR;
  },
  getById: async (id: number): Promise<Tag> => {
    const response = await API.get(`/tags/${id}`);
    return response.data;
  },
  create: async (tag: CreateTagDto): Promise<Tag> => {
    const response = await API.post('/tags', tag);
    return response.data;
  },
  update: async (id: number, tag: UpdateTagDto): Promise<Tag> => {
    const response = await API.put(`/tags/${id}`, tag);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await API.delete(`/tags/${id}`);
  },
};

export const useFetchTags = (): [Tag[], () => void] => {
  const {data, refetch} = useFetchData<Tag[]>('/tags');
  return [data || EMPTY_ARR, refetch];
};

export default tagApi;