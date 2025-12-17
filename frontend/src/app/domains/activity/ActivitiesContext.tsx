import {createContext, FC, ReactNode, useMemo, useState} from "react";
import {Activity} from "@/app/domains/activity/types.ts";
import {EMPTY_ARR, EMPTY_FUNC} from "@/lib/constants.ts";
import {useFetchActivities} from "@/app/domains/activity/api.ts";
import moment, {Moment} from "moment";

interface ActivitiesCxtType  {
  setRange: (range: [Moment, Moment]) => void;
  range: [Moment, Moment];
  activities: Activity[];
  loading: boolean;
  refetch: () => void;
}

const ActivitiesContext = createContext<ActivitiesCxtType>({
  activities: EMPTY_ARR,
  range: [moment(), moment()],
  setRange: EMPTY_FUNC,
  loading: false,
  refetch: EMPTY_FUNC
});

export const ActivitiesCtxProvider: FC<{ children: ReactNode }> = ({children}) => {
  const [range, setRange] = useState<[Moment, Moment]>([
    moment().startOf('month'),
    moment().endOf('month')
  ]);
  const [activities, loading, refetch] = useFetchActivities(...range);
  const ctx: ActivitiesCxtType = useMemo(()=> ({
    setRange, activities, loading, refetch, range
  }), [activities, loading, refetch, range]);
  return (<ActivitiesContext.Provider value={ctx}>
    {children}
  </ActivitiesContext.Provider>);
};

export default ActivitiesContext;