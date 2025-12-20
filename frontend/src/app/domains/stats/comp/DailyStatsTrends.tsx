import {FC, useContext, useMemo, useState} from "react";
import {DailyStats} from "@/app/domains/stats/types.ts";
import {Box, Card, CardContent, Typography} from "@mui/material";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import moment from "moment/moment";
import {sum} from "lodash";
import AggrsContext from "@/app/domains/aggr/AggrsContext.tsx";

const TrendChart: FC<{
  dailyStats: DailyStats[];
}> = ({dailyStats}) => {

  const {aggrs} = useContext(AggrsContext);
  const [hiddenLines, setHiddenLines] = useState<Set<string>>(new Set());
  const trendData = useMemo(() => {
    return dailyStats.map(stat => {
      const dataPoint: any = {
        date: stat.date,
      };
      
      aggrs.forEach(conf => {
        const totalMinutes = sum(conf.category_ids?.map((catId: number) =>
          stat.by_category[catId] || 0
        ));
        dataPoint[conf.name!] = totalMinutes / 60; // Convert to hours
      });
      
      return dataPoint;
    });
  }, [dailyStats, aggrs]);

  const handleLegendClick = (data: any) => {
    const dataKey = data.dataKey;
    setHiddenLines(prev => {
      const newHidden = new Set(prev);
      if (newHidden.has(dataKey)) {
        newHidden.delete(dataKey);
      } else {
        newHidden.add(dataKey);
      }
      return newHidden;
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Activity Aggr Trends
        </Typography>
        <Box sx={{height: 400}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis
                dataKey="date"
                tickFormatter={(date) => moment(date).format('MM/DD')}
              />
              <YAxis
                label={{value: 'Hours', angle: -90, position: 'insideLeft'}}
              />
              <Tooltip
                formatter={(value, name) => [`${(value as number).toFixed(1)}h`, name]}
                labelFormatter={(date) => `Date: ${moment(date).format('MMM DD')}`}
              />
              <Legend onClick={handleLegendClick}/>
              {aggrs.map((conf) => (
                <Line
                  key={conf.name}
                  type="linear"
                  dataKey={conf.name}
                  stroke={conf.color}
                  name={conf.name}
                  strokeWidth={2}
                  dot={{r: 3}}
                  hide={hiddenLines.has(conf.name!)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export const DailyStatsTrends: FC<{
  dailyStats: DailyStats[];
}> = ({dailyStats}) => {

  if (dailyStats.length === 0) {
    return (
      <Box sx={{p: 2}}>
        <Typography variant="body1" color="text.secondary">
          No data available for trend analysis.
        </Typography>
      </Box>
    );
  }


  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
      <TrendChart dailyStats={dailyStats} />
    </Box>
  );
};

export default DailyStatsTrends;