import { CategoriesCtxProvider } from "@/app/domains/category/CategoriesContext.tsx";
import { TagsCtxProvider } from "@/app/domains/tag/TagsContext.tsx";
import { ActivitiesCtxProvider } from "@/app/domains/activity/ActivitiesContext.tsx";
import { ReactNode } from "react";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <CategoriesCtxProvider>
      <TagsCtxProvider>
        <ActivitiesCtxProvider>{children}</ActivitiesCtxProvider>
      </TagsCtxProvider>
    </CategoriesCtxProvider>
  );
};