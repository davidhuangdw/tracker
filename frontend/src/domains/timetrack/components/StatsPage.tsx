import React, { useState, useEffect } from 'react';
import { Activity, Category, Tag } from '../types';
import { activityApi, categoryApi, tagApi } from '../services/api';
import dayjs from 'dayjs';
import './StatsPage.css';

interface FilterOptions {
  period: 'day' | 'week' | 'month';
  categoryId?: number;
  tagIds?: number[];
}

const StatsPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    period: 'week',
    categoryId: undefined,
    tagIds: [],
  });
  const [statsData, setStatsData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activities.length > 0) {
      calculateStats();
    }
  }, [activities, filters]);

  const fetchData = async () => {
    try {
      const [activitiesData, categoriesData, tagsData] = await Promise.all([
        activityApi.getAll(),
        categoryApi.getAll(),
        tagApi.getAll(),
      ]);
      setActivities(activitiesData);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const calculateStats = () => {
    const now = dayjs();
    let startDate: dayjs.Dayjs;
    
    switch (filters.period) {
      case 'day':
        startDate = now.startOf('day');
        break;
      case 'week':
        startDate = now.startOf('week');
        break;
      case 'month':
        startDate = now.startOf('month');
        break;
      default:
        startDate = now.startOf('week');
    }

    const endDate = now.endOf(filters.period);

    // Filter activities by date range
    const filteredActivities = activities.filter(activity => {
      const activityStart = dayjs(activity.from);
      const activityEnd = dayjs(activity.to);
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
      const duration = dayjs(activity.to).diff(dayjs(activity.from), 'second');
      return sum + duration;
    }, 0);
    setTotalTime(totalSeconds);

    // Group by category and calculate time
    const categoryStats = categoryFiltered.reduce((acc, activity) => {
      const category = categories.find(c => c.id === activity.category_id);
      if (!category) return acc;

      const duration = dayjs(activity.to).diff(dayjs(activity.from), 'second');
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

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
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
    <div className="stats-page">
      <div className="stats-header">
        <h2>Time Usage Statistics</h2>
      </div>
      
      <div className="filters-container">
        <div className="filter-group">
          <label className="filter-label">Period:</label>
          <select
            name="period"
            value={filters.period}
            onChange={handleFilterChange}
            className="form-select"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Category:</label>
          <select
            name="categoryId"
            value={filters.categoryId || ''}
            onChange={handleFilterChange}
            className="form-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group tags-filter">
          <label className="filter-label">Tags:</label>
          <div className="tags-container">
            {tags.map(tag => (
              <label key={tag.id} className="tag-checkbox">
                <input
                  type="checkbox"
                  name="tagIds"
                  value={tag.id}
                  checked={filters.tagIds?.includes(tag.id) || false}
                  onChange={handleFilterChange}
                />
                <span className="tag-name" style={{ color: tag.color }}>{tag.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      <div className="stats-summary">
        <div className="total-time">
          <h3>Total Time: {formatTime(totalTime)}</h3>
        </div>
      </div>
      
      <div className="stats-charts">
        <div className="chart-container">
          <h3>Time by Category</h3>
          <div className="chart-content">
            {statsData.length > 0 ? (
              <div className="pie-chart">
                {/* Simple pie chart visualization */}
                <div className="chart-legend">
                  {statsData.map((item, index) => (
                    <div key={index} className="legend-item">
                      <div 
                        className="legend-color" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="legend-name">{item.name}</span>
                      <span className="legend-value">{formatTime(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-data">
                <p>No data available for the selected filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
