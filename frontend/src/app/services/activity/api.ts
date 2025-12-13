import {Activity} from "@/app/services/activity/types.ts";
import API from "@/app/constants/api.ts";
import {EMPTY_ARR} from "@/lib/constants.ts";
import {useAsyncRun, useFetchData} from "@/lib/utils/api.ts";

export const useFetchActivities =
  (from?: string, to?: string): [Activity[], boolean, () => void] => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);

    const {data, loading, refetch} = useFetchData<Activity[]>(`/activities?${params.toString()}`);
    return [data || EMPTY_ARR, loading, refetch]
  };

export const useCreateActivity = (): [(activity?: Activity) => Promise<Activity>, boolean] => {
  const [createActivity, running] = useAsyncRun(
    async (activity: Activity): Promise<Activity> =>
      (await API.post('/activities', activity)).data
  );
  return [createActivity, running]
};

export const useUpdateActivity = (): [(id: number, activity?: Activity) => Promise<Activity>, boolean] => {
  const [updateActivity, running] = useAsyncRun(
    async (id: number, activity: Activity): Promise<Activity> =>
      (await API.put(`/activities/${id}`, activity)).data
  );
  return [updateActivity, running]
};

export const useDeleteActivity = (): [(id: number) => Promise<void>, boolean] => {
  const [fetch, running] = useAsyncRun(
    async (id: number): Promise<void> =>
      await API.delete(`/activities/${id}`)
  );
  return [fetch, running]
};
