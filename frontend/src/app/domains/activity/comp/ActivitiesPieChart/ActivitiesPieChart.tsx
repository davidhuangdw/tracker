import {FC, useContext, useMemo} from "react";
import {Box, Chip, Typography} from '@mui/material';
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import CategoriesContext from "@/app/domains/category/CategoriesContext.tsx";
import {SimpleTooltip} from "@/app/domains/activity/comp/ActivitiesPieChart/SimpleTooltip.tsx";
import {formatDuration} from "@/app/domains/activity/comp/ActivitiesPieChart/utils.ts";
import ActivitiesContext from "@/app/domains/activity/ActivitiesContext.tsx";
import {minutesByCategory} from "@/app/domains/stats/utils.ts";

const ActivitiesPieChart: FC = () => {
  const {activities} = useContext(ActivitiesContext)
  const {categories} = useContext(CategoriesContext);

  const pieChartData = useMemo(() => {
    const categoryMap = new Map(categories.map(cat => [cat.id, cat]));

    return Object.entries(minutesByCategory(activities))
      .map(([categoryId, minutes]) => {
        const category = categoryMap.get(parseInt(categoryId));
        return {
          name: category?.name || `Category ${categoryId}`,
          value: minutes,
          color: category?.color || '#cccccc',
          formattedValue: formatDuration(minutes)
        };
      })
      .sort((a, b) => b.value - a.value); // Sort by duration descending
  }, [activities, categories]);

  const totalMinutes = Object.values(minutesByCategory).reduce((sum, minutes) => sum + minutes, 0);

  return (
    <Box sx={{p: 2, height: '100%', display: 'flex', flexDirection: 'column'}}>
      {/* Header Section */}
      <Box sx={{mb: 2}}>
        {pieChartData.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No activities found in the selected range.
          </Typography>
        )}
        {totalMinutes > 0 && (
          <Typography variant="h6" sx={{fontWeight: 'bold'}}>
            Total: {formatDuration(totalMinutes)}
          </Typography>
        )}
      </Box>

      {pieChartData.length > 0 && (
        <Box sx={{flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column'}}>
          <Box sx={{flex: 1, minHeight: 0}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent = 0}) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius="80%"
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color}/>
                  ))}
                </Pie>
                <Tooltip content={<SimpleTooltip/>}/>
                {/*<Legend/>*/}
              </PieChart>
            </ResponsiveContainer>
          </Box>

          <Box sx={{mt: 2, maxHeight: 120, overflow: 'auto'}}>
            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
              {pieChartData.map((item, index) => (
                <Chip
                  key={index}
                  label={`${item.name}: ${item.formattedValue}`}
                  variant="outlined"
                  sx={{
                    borderColor: item.color,
                    color: item.color,
                    backgroundColor: `${item.color}10`
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ActivitiesPieChart;