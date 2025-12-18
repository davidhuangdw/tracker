import {Moment} from "moment";
import {Activity} from "@/app/domains/activity/types.ts";

export interface DailyStats {
  date: string; // YYYY-MM-DD
  sleep_at: Moment;
  sleep_len: number; // minutes
  total: number;
  by_category: {
    [id: number]: number;
  };
  activities?: Activity[];
}

export interface AggrConfig {
  name: string;
  color: string;
  category_ids: number[];
  // tag_ids: number[];
}
