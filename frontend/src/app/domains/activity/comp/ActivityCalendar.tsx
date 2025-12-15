import React, {useState, useMemo, useContext} from 'react';
import moment from 'moment';
import {Calendar as BigCalendar, momentLocalizer, Event, Views, View} from 'react-big-calendar';
import {Activity} from "@/app/domains/activity/types.ts";
import {
  useCreateActivity,
  useDeleteActivity,
  useFetchActivities,
  useUpdateActivity
} from "@/app/domains/activity/api.ts";
import CategoriesContext from "@/app/domains/category/comp/CategoriesContext.tsx";
import ActivityModal from "@/app/domains/activity/comp/ActivityModal.tsx";
import { Box, Typography } from '@mui/material';
import 'react-big-calendar/lib/css/react-big-calendar.css';

interface ActivityEvent extends Event {
  id?: number;
  activity: Activity;
}

const localizer = momentLocalizer(moment);

const ActivityCalendar: React.FC = () => {
  const [activities, , reLoad] = useFetchActivities();
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [currentView, setCurrentView] = useState<View>(Views.WEEK);

  const {categories} = useContext(CategoriesContext);
  const [createActivity] = useCreateActivity();
  const [updateActivity] = useUpdateActivity();
  const [deleteActivity] = useDeleteActivity();

  const onSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot(slotInfo);
    setEditingActivity(null);
    setShowModal(true);
  };

  const onSelectEvent = (event: ActivityEvent) => {
    const activity = activities.find(a => a.id === event.id) || null;
    setEditingActivity(activity);
    setSelectedSlot(null);
    setShowModal(true);
  };

  const onSaveActivity = async (activityData: Activity) => {
    try {
      if (editingActivity) {
        await updateActivity(editingActivity.id!, activityData);
      } else {
        await createActivity(activityData);
      }
      reLoad();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  };

  const onDeleteActivity = async (id: number) => {
    try {
      await deleteActivity(id);
      reLoad();
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const convertToEvents = (activities: Activity[]): ActivityEvent[] => {
    return activities.map(activity => ({
      id: activity.id,
      title: activity.name,
      start: moment(activity.from).toDate(),
      end: moment(activity.to).toDate(),
      allDay: false,
      activity,
      resource: {
        isMultiDay: moment(activity.to).diff(moment(activity.from), 'days') > 0
      }
    }));
  };

  const events = useMemo(() => convertToEvents(activities), [activities]);

  const getEventStyle = (event: ActivityEvent) => {
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

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: 'calc(100vh - 64px)',
        minWidth: 1200,
        minHeight: 0,
      }}
    >
      <Box sx={{ mb: 2, borderBottom: 1, borderColor: 'divider', pb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Time Tracker Calendar
        </Typography>
      </Box>
      
      <Box 
        sx={{ 
          flex: 1, 
          minHeight: 0,
          '& .rbc-calendar': {
            height: '100%',
            minHeight: 0
          },
          '& .rbc-time-view': {
            height: '100%',
            minHeight: 0
          },
          '& .rbc-month-view': {
            height: '100%',
            minHeight: 0
          }
        }}
      >
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectSlot={onSelectSlot}
          onSelectEvent={onSelectEvent}
          selectable
          view={currentView}
          onView={(v) => setCurrentView(v)}
          views={[Views.DAY, Views.WEEK, Views.MONTH, Views.AGENDA]}
          step={60}
          showMultiDayTimes
          eventPropGetter={getEventStyle}
          dayLayoutAlgorithm="no-overlap"
        />
      </Box>

      <ActivityModal
        key={`${showModal}`}
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={onSaveActivity}
        onDelete={onDeleteActivity}
        activity={editingActivity}
        selectedSlot={selectedSlot}
      />
    </Box>
  );
};

export default ActivityCalendar;