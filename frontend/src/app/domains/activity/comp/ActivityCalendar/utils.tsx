import moment, {Moment} from 'moment';
import {Event} from 'react-big-calendar';
import {Activity} from "@/app/domains/activity/types.ts";
import {Category} from "@/app/domains/category/types.ts";

export interface ActivityEvent extends Event {
  id?: number;
  activity: Activity;
  resource: {
    isMultiDay: boolean;
  };
}

export const convertToEvents = (activities: Activity[]): ActivityEvent[] => {
  return activities.map(activity => {
    const start = activity.from || moment();
    const end = activity.to || moment();
    const isMultiDay = end.diff(start, 'days') > 0;
    
    return {
      id: activity.id,
      title: activity.name,
      start: start.toDate(),
      end: end.toDate(),
      allDay: false,
      activity,
      resource: {
        isMultiDay: isMultiDay
      }
    };
  });
};

export const getEventStyle = (event: ActivityEvent, categories: Category[]): {style:  React.CSSProperties} => {
  const activity = event.activity as Activity;
  const category = categories.find(c => c.id === activity.category_id);
  const isMultiDay = moment(event.end).diff(moment(event.start), 'days') > 0;

  return {
    style: {
      backgroundColor: category?.color || '#3498db',
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: 'none',
      ...(isMultiDay && {
        borderLeft: `4px solid ${category?.color || '#3498db'}`,
        fontWeight: 'bold'
      })
    },
  };
};

export const parseCalendarRange = (range: Date[] | {start: Date; end: Date}, view?: string): [Moment, Moment] => {
  const [start, end] = (Array.isArray(range) ? [range[0], range[-1]] : [range.start, range.end]).map(v => moment(v));
  if (view === 'month') {
    const mid = start.clone().add(15, 'day');
    return [mid.clone().startOf('month'), mid.clone().endOf('month')]
  }
  return [start, end.endOf('day')];
};