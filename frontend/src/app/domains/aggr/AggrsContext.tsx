import {createContext, FC, ReactNode, useMemo} from "react";
import {Aggr} from "@/app/domains/aggr/types.ts";
import {EMPTY_ARR} from "@/lib/constants.ts";
import {useFetchAggrs} from "@/app/domains/aggr/api.ts";

interface AggrsCxtType  {
  aggrs: Aggr[];
  loading: boolean;
  refetch: () => void;
}

const AggrsContext = createContext<AggrsCxtType>({
  aggrs: EMPTY_ARR,
  loading: false,
  refetch: () => void 0
});

export const AggrsCtxProvider: FC<{ children: ReactNode }> = ({children}) => {
  const [aggrs, loading, refetch] = useFetchAggrs();
  const ctx: AggrsCxtType = useMemo(()=> ({
    aggrs, loading, refetch
  }), [aggrs, loading, refetch]);
  return (<AggrsContext.Provider value={ctx}>
    {children}
  </AggrsContext.Provider>);
};

export default AggrsContext;