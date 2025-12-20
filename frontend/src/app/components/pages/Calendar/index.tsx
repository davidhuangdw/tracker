import {CategoriesCtxProvider} from "@/app/domains/category/CategoriesContext.tsx";
import {TagsCtxProvider} from "@/app/domains/tag/TagsContext.tsx";
import ActivityCalendar from "@/app/domains/activity/comp/ActivityCalendar";
import {ActivitiesCtxProvider} from "@/app/domains/activity/ActivitiesContext.tsx";
import ActivitiesPieChart from "@/app/domains/activity/comp/ActivitiesPieChart";
import {Box, Fab} from "@mui/material";
import {useState} from "react";
import {PieChart as PieChartIcon} from "@mui/icons-material";


const ActivityChartDisplay = () => {
  const [showChart, setShowChart] = useState(false);

  const toggleChart = () => {
    setShowChart(!showChart);
  };
  return <>
    <Fab
      color="primary"
      aria-label="toggle chart"
      onClick={toggleChart}
      sx={{
        position: 'fixed',
        right: 16,
        bottom: showChart ? 440 : 16,
        zIndex: 1100,
      }}
    >
      <PieChartIcon/>
    </Fab>

    {showChart && (
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
        <ActivitiesPieChart/>
      </Box>
    )}
  </>
}

const CalendarPage = () => {
  return (
    <CategoriesCtxProvider>
      <TagsCtxProvider>
        <ActivitiesCtxProvider>

          <ActivityCalendar/>
          <ActivityChartDisplay/>

        </ActivitiesCtxProvider>
      </TagsCtxProvider>
    </CategoriesCtxProvider>
  );
};

export default CalendarPage;