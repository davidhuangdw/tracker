import {createContext, FC, ReactNode, useMemo} from "react";
import {Category} from "@/app/domains/category/types.ts";
import {EMPTY_ARR} from "@/lib/constants.ts";
import {useFetchCategories} from "@/app/domains/category/api.ts";

interface CategoriesCxtType  {
  categories: Category[];
  refetch: () => void;
}

const CategoriesContext = createContext<CategoriesCxtType>({
  categories: EMPTY_ARR,
  refetch: () => void 0
});

export const CategoriesCtxProvider: FC<{ children: ReactNode }> = ({children}) => {
  const [categories, refetch] = useFetchCategories()
  const ctx: CategoriesCxtType = useMemo(()=> ({
    categories, refetch
  }), [categories, refetch]);
  return (<CategoriesContext.Provider value={ctx}>
    {children}
  </CategoriesContext.Provider>);

};

export default CategoriesContext;