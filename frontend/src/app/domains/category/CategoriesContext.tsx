import {createContext, FC, ReactNode, useMemo} from "react";
import {Category} from "@/app/domains/category/types.ts";
import {EMPTY_ARR} from "@/lib/constants.ts";
import {useFetchCategories} from "@/app/domains/category/api.ts";

interface CategoriesCxtType  {
  categories: Category[];
  loading: boolean;
  refetch: () => void;
}

const CategoriesContext = createContext<CategoriesCxtType>({
  categories: EMPTY_ARR,
  loading: false,
  refetch: () => void 0
});

export const CategoriesCtxProvider: FC<{ children: ReactNode }> = ({children}) => {
  const [categories, loading, refetch] = useFetchCategories();
  const ctx: CategoriesCxtType = useMemo(()=> ({
    categories, loading, refetch
  }), [categories, loading, refetch]);
  return (<CategoriesContext.Provider value={ctx}>
    {children}
  </CategoriesContext.Provider>);
};

export default CategoriesContext;