import {Activity, CreateActivityDto, UpdateActivityDto} from "@/app/services/activity/domain/types.ts";
import API from "@/app/constants/api.ts";
import {EMPTY_ARR} from "@/shared/constants.ts";
import {useFetchData} from "@/shared/utils/api.ts";

export const activityApi = {
  getAll: async (from?: string, to?: string): Promise<Activity[]> => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    const resp = await API.get(`/activities?${params.toString()}`);
    return resp.data || EMPTY_ARR;
  },
  getById: async (id: number): Promise<Activity> => (await API.get(`/activities/${id}`)).data,
  create: async (activity: CreateActivityDto): Promise<Activity> => (await API.post('/activities', activity)).data,
  update: async (id: number, activity: UpdateActivityDto): Promise<Activity> => (await API.put(`/activities/${id}`, activity)).data,
  delete: async (id: number): Promise<void> => await API.delete(`/activities/${id}`),
};

export const useFetchActivities =
  (from?: string, to?: string): [Activity[], () => void] => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);

    const {data, refetch} = useFetchData<Activity[]>(`/activities?${params.toString()}`);
    return [data || EMPTY_ARR, refetch]
  }

export default activityApi;