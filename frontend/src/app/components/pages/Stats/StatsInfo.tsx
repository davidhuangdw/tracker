import {FC, useContext, useMemo} from "react";
import moment from "moment/moment";
import {useFetchActivities} from "@/app/domains/activity/api.ts";
import CategoriesContext from "@/app/domains/category/CategoriesContext.tsx";
import {DailyStats} from "@/app/domains/stats/types.ts";
import {computeDailyStats} from "@/app/domains/stats/utils.ts";
import {Box, Grid, Typography} from "@mui/material";
import DailyStatsTrends from "@/app/domains/stats/comp/DailyStatsTrends.tsx";
import DailyPieChart from "@/app/domains/stats/comp/DailyPieChart.tsx";
import {reverse} from "lodash";

export const StatsInfo: FC = () => {
  const today = useMemo(() => moment(), []);
  const [from, to] = useMemo(() => [
    today.clone().startOf('week'),
    today.clone().endOf('day')
  ], [today]);
  const [activities] = useFetchActivities(from, to);
  const {categories} = useContext(CategoriesContext);

  const dailyStats: DailyStats[] = useMemo(() => computeDailyStats(activities, categories), [activities, categories]);

  if (dailyStats.length === 0) {
    return (
      <Box sx={{p: 3}}>
        <Typography variant="h4" gutterBottom>
          Statistics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No data available for the selected period.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{p: 3}}>
      <Typography variant="h4" gutterBottom>
        Statistics - {from.format('MM-DD')} Week
      </Typography>

      <Grid container spacing={3} sx={{width: '100%', marginBottom: 5}}>
        {reverse(dailyStats).map((dailyStat) => (
          <Grid
            key={dailyStat.date}
            size={{xs:12, sm:6, md:4, lg:3}}
            sx={{
              display: 'flex',
              minWidth: 320,
              maxWidth: 400
            }}
          >
            <Box sx={{width: '100%', height: '100%'}}>
              <DailyPieChart dailyStat={dailyStat} categories={categories} showPills/>
            </Box>
          </Grid>
        ))}
      </Grid>

      <DailyStatsTrends dailyStats={dailyStats}/>
    </Box>
  );
};
export default StatsInfo;
