import {FC} from "react";
import {CategoriesCtxProvider} from "@/app/domains/category/CategoriesContext.tsx";
import {AggrsCtxProvider} from "@/app/domains/aggr/AggrsContext.tsx";
import StatsInfo from "./StatsInfo";

const StatsPage: FC = () => {
  return (
    <CategoriesCtxProvider>
      <AggrsCtxProvider>
        <StatsInfo/>
      </AggrsCtxProvider>
    </CategoriesCtxProvider>
  )
};

export default StatsPage;