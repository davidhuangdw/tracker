import API from "@/app/constants/api.ts";
import {EMPTY_ARR} from "@/lib/constants.ts";
import {Category} from "./types.ts";
import {useAsyncRun, useFetchData} from "@/lib/utils/api.ts";

export const useFetchCategories = (): [Category[], boolean, () => void] => {
  const {data, loading, refetch} = useFetchData<Category[]>('/categories');
  return [data || EMPTY_ARR, loading, refetch];
};

export const useCreateCategory = (): [(category: Category) => Promise<Category>, boolean] => {
  const [createCategory, running] = useAsyncRun(
    async (category: Category): Promise<Category> =>
      (await API.post('/categories', category)).data
  );
  return [createCategory, running];
};

export const useUpdateCategory = (): [(id: number, category: Category) => Promise<Category>, boolean] => {
  const [updateCategory, running] = useAsyncRun(
    async (id: number, category: Category): Promise<Category> =>
      (await API.put(`/categories/${id}`, category)).data
  );
  return [updateCategory, running];
};

export const useDeleteCategory = (): [(id: number) => Promise<void>, boolean] => {
  const [fetch, running] = useAsyncRun(
    async (id: number): Promise<void> =>
      await API.delete(`/categories/${id}`)
  );
  return [fetch, running];
};
