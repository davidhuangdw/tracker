import {CategoriesCtxProvider} from "@/app/domains/category/comp/CategoriesContext.tsx";
import {TagsCtxProvider} from "@/app/domains/tag/comp/TagsContext.tsx";
import ActivityCalendar from "@/app/domains/activity/comp/ActivityCalendar";

const CalendarPage = () => {
  return (
    <CategoriesCtxProvider>
      <TagsCtxProvider>
        <ActivityCalendar/>
      </TagsCtxProvider>
    </CategoriesCtxProvider>
  );
};

export default CalendarPage;