import {FC, useMemo} from "react";
import {Box, Card, CardContent, Chip, Typography} from "@mui/material";
import {DailyStats} from "@/app/domains/stats/types.ts";
import {Category} from "@/app/domains/category/types.ts";
import moment from "moment/moment";
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";

const PILLS_LIMIT = 5;

const PieChartTooltip: FC<any> = ({active, payload}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const formatDuration = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    return (
      <Box sx={{
        backgroundColor: 'background.paper',
        p: 1,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        boxShadow: 1
      }}>
        <Typography variant="body2" fontWeight="bold" color={data.color}>
          {data.name}
        </Typography>
        <Typography variant="body2">
          Duration: {formatDuration(data.value)}
        </Typography>
      </Box>
    );
  }
  return null;
};

export const DailyPieChart: FC<{
  dailyStat: DailyStats;
  categories: Category[];
  showPills?: boolean;
  showTotal?: boolean;
}> = ({dailyStat, categories, showPills, showTotal}) => {
  const pieChartData = useMemo(() => {
    const categoryMap = new Map(categories.map(cat => [cat.id, cat]));

    return Object.entries(dailyStat.by_category)
      .map(([categoryId, minutes]) => {
        const category = categoryMap.get(parseInt(categoryId));
        return {
          name: category?.name || `Category ${categoryId}`,
          value: minutes,
          color: category?.color || '#cccccc',
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [dailyStat.by_category, categories]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <Card sx={{
      height: '100%',
      minHeight: 350,
      minWidth: 300,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <CardContent sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        gap: 1,
        height: '100%'
      }}>
        <Box sx={{
          flex: '0 0 auto',
          minHeight: 40
        }}>
          <Typography variant="h6" gutterBottom>
            {moment(dailyStat.date).format('MM-DD')}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            SleepAt: {dailyStat.sleep_at.format('HH:mm')}
          </Typography>
          {showTotal && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total: {formatDuration(dailyStat.total)}
            </Typography>
          )}
        </Box>

        <Box sx={{
          flex: '0 0 280px',
          width: '100%',
          minWidth: 280,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80} // Restored original radius
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, value}) => `${name}: ${formatDuration(value)}`}
                  labelLine={true} // Restored label lines
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color}/>
                  ))}
                </Pie>
                <Tooltip content={<PieChartTooltip/>}/>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No activities
            </Typography>
          )}
        </Box>

        {showPills && (
          <Box sx={{
            flex: '1 1 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.5,
            alignContent: 'flex-start',
            minHeight: 40,
            overflow: 'hidden'
          }}>
            {pieChartData.slice(0, PILLS_LIMIT).map((item, index) => (
              <Chip
                key={index}
                label={`${item.name}: ${formatDuration(item.value)}`}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: item.color,
                  color: item.color,
                  backgroundColor: `${item.color}10`
                }}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyPieChart;