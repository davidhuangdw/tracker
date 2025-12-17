import {CategoriesCtxProvider} from "@/app/domains/category/CategoriesContext.tsx";
import {TagsCtxProvider} from "@/app/domains/tag/TagsContext.tsx";
import ActivityCalendar from "@/app/domains/activity/comp/ActivityCalendar";
import {ActivitiesCtxProvider} from "@/app/domains/activity/ActivitiesContext.tsx";
import ActivitiesPieChart from "@/app/domains/activity/comp/ActivitiesPieChart";
import { Box } from "@mui/material";

const CalendarPage = () => {
  return (
    <CategoriesCtxProvider>
      <TagsCtxProvider>
        <ActivitiesCtxProvider>

          <ActivityCalendar/>

          <Box sx={{
            position: 'fixed',
            right: 16,
            bottom: 16,
            width: 400,
            height: 400,
            overflow: 'auto',
            backgroundColor: 'background.paper',
            boxShadow: 2,
            borderRadius: 1,
            zIndex: 1000,
          }}>
            <ActivitiesPieChart />
          </Box>

        </ActivitiesCtxProvider>
      </TagsCtxProvider>
    </CategoriesCtxProvider>
  );
};

export default CalendarPage;