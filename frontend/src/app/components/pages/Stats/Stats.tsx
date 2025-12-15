import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import {useFetchTags} from "@/app/domains/tag/api.ts";
import {useFetchCategories} from "@/app/domains/category/api.ts";
import {useFetchActivities} from "@/app/domains/activity/api.ts";

interface FilterOptions {
  period: 'day' | 'week' | 'month';
  categoryId?: number;
  tagIds?: number[];
}

const Stats: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    period: 'week',
    categoryId: undefined,
    tagIds: [],
  });
  const [statsData, setStatsData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [totalTime, setTotalTime] = useState(0);

  const [activities] = useFetchActivities();
  const [categories] = useFetchCategories();
  const [tags] = useFetchTags();

  const calculateStats = () => {
    const now = moment();
    let startDate: moment.Moment;
    
    switch (filters.period) {
      case 'day':
        startDate = now.clone().startOf('day');
        break;
      case 'week':
        startDate = now.clone().startOf('week');
        break;
      case 'month':
        startDate = now.clone().startOf('month');
        break;
      default:
        startDate = now.clone().startOf('week');
    }

    const endDate = now.clone().endOf(filters.period);

    // Filter activities by date range
    const filteredActivities = activities.filter(activity => {
      const activityStart = moment(activity.from);
      const activityEnd = moment(activity.to);
      return activityStart.isAfter(startDate) && activityEnd.isBefore(endDate);
    });

    // Filter by category if selected
    const categoryFiltered = filters.categoryId 
      ? filteredActivities.filter(a => a.category_id === filters.categoryId)
      : filteredActivities;

    // Filter by tags if selected
    const tagFiltered = filters.tagIds.length > 0
      ? categoryFiltered.filter(a =>
          filters.tagIds?.some(tagId => a.tags.some(t => t.id === tagId))
        )
      : categoryFiltered;

    // Calculate total time
    const totalSeconds = tagFiltered.reduce((sum, activity) => {
      const duration = moment(activity.to).diff(moment(activity.from), 'second');
      return sum + duration;
    }, 0);
    setTotalTime(totalSeconds);

    // Group by category and calculate time
    const categoryStats = categoryFiltered.reduce((acc, activity) => {
      const category = categories.find(c => c.id === activity.category_id);
      if (!category) return acc;

      const duration = moment(activity.to).diff(moment(activity.from), 'second');
      const existing = acc.find(item => item.name === category.name);
      
      if (existing) {
        existing.value += duration;
      } else {
        acc.push({
          name: category.name,
          value: duration,
          color: category.color,
        });
      }
      
      return acc;
    }, [] as typeof statsData);

    setStatsData(categoryStats);
  };

  useEffect(() => {
    if (activities.length > 0) {
      calculateStats();
    }
  }, [activities, filters]);

  const handleFilterChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const tagId = parseInt(value);
      setFilters(prev => {
        const currentTagIds = prev.tagIds || [];
        if (checked) {
          return {
            ...prev,
            tagIds: [...currentTagIds, tagId],
          };
        } else {
          return {
            ...prev,
            tagIds: currentTagIds.filter(id => id !== tagId),
          };
        }
      });
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: name === 'categoryId' ? (value === '' ? undefined : parseInt(value)) : value,
      }));
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <Box >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Time Usage Statistics
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Period</InputLabel>
                <Select
                  name="period"
                  value={filters.period}
                  onChange={handleFilterChange}
                  label="Period"
                >
                  <MenuItem value="day">Day</MenuItem>
                  <MenuItem value="week">Week</MenuItem>
                  <MenuItem value="month">Month</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="categoryId"
                  value={filters.categoryId || ''}
                  onChange={handleFilterChange}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Typography variant="body2" gutterBottom>
                  Tags
                </Typography>
                <Box sx={{ maxHeight: 120, overflow: 'auto' }}>
                  {tags.map(tag => (
                    <FormControlLabel
                      key={tag.id}
                      control={
                        <Checkbox
                          name="tagIds"
                          value={tag.id}
                          checked={filters.tagIds?.includes(tag.id!) || false}
                          onChange={handleFilterChange}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              backgroundColor: tag.color,
                              borderRadius: '50%',
                              mr: 1
                            }}
                          />
                          {tag.name}
                        </Box>
                      }
                    />
                  ))}
                </Box>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <Typography variant="h4" color="primary">
            Total Time: {formatTime(totalTime)}
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Time by Category
          </Typography>
          {statsData.length > 0 ? (
            <Box>
              {statsData.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      backgroundColor: item.color,
                      borderRadius: 2,
                      mr: 2
                    }}
                  />
                  <Typography variant="body1" sx={{ flex: 1 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatTime(item.value)}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Alert severity="info">
              No data available for the selected filters
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Stats;