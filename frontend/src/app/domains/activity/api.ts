import {Activity} from "@/app/domains/activity/types.ts";
import API from "@/app/constants/api.ts";
import {EMPTY_ARR} from "@/lib/constants.ts";
import {useAsyncRun, useFetchData} from "@/lib/hooks/api.ts";
import moment from 'moment';

export const useFetchActivities =
  (from?: moment.Moment, to?: moment.Moment): [Activity[], boolean, () => void] => {
    const params = new URLSearchParams();
    if (from) params.append('from', from.toISOString());
    if (to) params.append('to', to.toISOString());

    const {data, loading, refetch} = useFetchData<Activity[]>(`/activities?${params.toString()}`);
    
    // Convert string dates to Moment objects
    const activitiesWithDates = data?.map(activity => ({
      ...activity,
      from: activity.from ? moment(activity.from) : undefined,
      to: activity.to ? moment(activity.to) : undefined
    })) || EMPTY_ARR;
    
    return [activitiesWithDates, loading, refetch]
  };

export const useCreateActivity = (): [(activity?: Activity) => Promise<Activity>, boolean] => {
  const [createActivity, running] = useAsyncRun(
    async (activity: Activity): Promise<Activity> => {
      // Convert Moment objects to ISO strings for API
      const apiActivity = {
        ...activity,
        from: activity.from?.toISOString(),
        to: activity.to?.toISOString()
      };
      return (await API.post('/activities', apiActivity)).data
    }
  );
  return [createActivity, running]
};

export const useUpdateActivity = (): [(id: number, activity?: Activity) => Promise<Activity>, boolean] => {
  const [updateActivity, running] = useAsyncRun(
    async (id: number, activity: Activity): Promise<Activity> => {
      // Convert Moment objects to ISO strings for API
      const apiActivity = {
        ...activity,
        from: activity.from?.toISOString(),
        to: activity.to?.toISOString()
      };
      return (await API.put(`/activities/${id}`, apiActivity)).data
    }
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