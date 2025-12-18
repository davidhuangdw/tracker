import {FC} from "react";
import {CategoriesCtxProvider} from "@/app/domains/category/CategoriesContext.tsx";
import StatsInfo from "./StatsInfo";

const StatsPage: FC = () => {
  return (
    <CategoriesCtxProvider>
      <StatsInfo/>
    </CategoriesCtxProvider>
  )
};

export default StatsPage;