import {CategoriesCtxProvider} from "@/app/services/category/comp/CategoriesContext.tsx";
import {TagsCtxProvider} from "@/app/services/tag/comp/TagsContext.tsx";
import ActivityCalendar from "@/app/services/activity/comp/ActivityCalendar";

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