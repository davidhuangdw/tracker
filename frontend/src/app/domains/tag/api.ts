import API from "@/app/constants/api.ts";
import {Tag} from "./types.ts";
import {EMPTY_ARR} from "@/lib/constants.ts";
import {useAsyncRun, useFetchData} from "@/lib/utils/api.ts";

export const useFetchTags = (): [Tag[], boolean, () => void] => {
  const {data, loading, refetch} = useFetchData<Tag[]>('/tags');
  return [data || EMPTY_ARR, loading, refetch];
};

export const useCreateTag = (): [(tag: Tag) => Promise<Tag>, boolean] => {
  const [createTag, running] = useAsyncRun(
    async (tag: Tag): Promise<Tag> =>
      (await API.post('/tags', tag)).data
  );
  return [createTag, running];
};

export const useUpdateTag = (): [(id: number, tag: Tag) => Promise<Tag>, boolean] => {
  const [updateTag, running] = useAsyncRun(
    async (id: number, tag: Tag): Promise<Tag> =>
      (await API.put(`/tags/${id}`, tag)).data
  );
  return [updateTag, running];
};

export const useDeleteTag = (): [(id: number) => Promise<void>, boolean] => {
  const [fetch, running] = useAsyncRun(
    async (id: number): Promise<void> =>
      await API.delete(`/tags/${id}`)
  );
  return [fetch, running];
};
