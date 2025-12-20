import API from "@/app/constants/api.ts";
import {EMPTY_ARR} from "@/lib/constants.ts";
import {Aggr} from "./types.ts";
import {useAsyncRun, useFetchData} from "@/lib/hooks/api.ts";

export const useFetchAggrs = (): [Aggr[], boolean, () => void] => {
  const {data, loading, refetch} = useFetchData<Aggr[]>('/aggr');
  return [data || EMPTY_ARR, loading, refetch];
};

export const useCreateAggr = (): [(aggr: Aggr) => Promise<Aggr>, boolean] => {
  const [createAggr, running] = useAsyncRun(
    async (aggr: Aggr): Promise<Aggr> =>
      (await API.post('/aggr', aggr)).data
  );
  return [createAggr, running];
};

export const useUpdateAggr = (): [(id: number, aggr: Aggr) => Promise<Aggr>, boolean] => {
  const [updateAggr, running] = useAsyncRun(
    async (id: number, aggr: Aggr): Promise<Aggr> =>
      (await API.put(`/aggr/${id}`, aggr)).data
  );
  return [updateAggr, running];
};

export const useDeleteAggr = (): [(id: number) => Promise<void>, boolean] => {
  const [fetch, running] = useAsyncRun(
    async (id: number): Promise<void> =>
      await API.delete(`/aggr/${id}`)
  );
  return [fetch, running];
};