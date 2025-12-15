import {createContext, FC, ReactNode, useMemo} from "react";
import {EMPTY_ARR} from "@/lib/constants.ts";
import {Tag} from "@/app/domains/tag/types.ts";
import {useFetchTags} from "@/app/domains/tag/api.ts";

interface TagsCxtType  {
  tags: Tag[];
  refetch: () => void;
}

const TagsContext = createContext<TagsCxtType>({
  tags: EMPTY_ARR,
  refetch: () => void 0
});

export const TagsCtxProvider: FC<{ children: ReactNode }> = ({children}) => {
  const [tags, refetch] = useFetchTags()
  const ctx: TagsCxtType = useMemo(()=> ({
    tags, refetch
  }), [tags, refetch]);
  return (<TagsContext.Provider value={ctx}>
    {children}
  </TagsContext.Provider>);

};

export default TagsContext;