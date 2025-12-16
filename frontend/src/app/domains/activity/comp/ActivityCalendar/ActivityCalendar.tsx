import React, {useState, useMemo, useContext} from 'react';
import {Calendar as BigCalendar, momentLocalizer, Views, View} from 'react-big-calendar';
import moment from 'moment';
import {Box, Typography} from '@mui/material';
import {Activity} from "@/app/domains/activity/types.ts";
import {
  useCreateActivity,
  useDeleteActivity,
  useFetchActivities,
  useUpdateActivity
} from "@/app/domains/activity/api.ts";
import CategoriesContext from "@/app/domains/category/CategoriesContext.tsx";
import ActivityModal from "@/app/domains/activity/comp/ActivityModal.tsx";
import {
  ActivityEvent,
  convertToEvents,
  getEventStyle
} from './utils.tsx';
import {ActivityEventView} from './ActivityEventView.tsx'
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const ActivityCalendar: React.FC = () => {
  const [activities, , reLoad] = useFetchActivities();
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [view, setView] = useState<View>(Views.WEEK);

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
    if (editingActivity) {
      await updateActivity(editingActivity.id!, activityData);
    } else {
      await createActivity(activityData);
    }
    reLoad();
    setShowModal(false);
  };

  const onDeleteActivity = async (id: number) => {
    await deleteActivity(id);
    reLoad();
    setShowModal(false);
  };

  const events = useMemo(() => convertToEvents(activities), [activities]);
  const eventPropGetter = useMemo(() => (event: ActivityEvent) =>
    getEventStyle(event, categories), [categories]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',
        minWidth: 1200,
        minHeight: 2000,
      }}
    >
      <Box sx={{mb: 2, borderBottom: 1, borderColor: 'divider', pb: 2}}>
        <Typography variant="h4" component="h1" gutterBottom>
          Time Tracker Calendar
        </Typography>
      </Box>

      <Box sx={{flex: 1, minHeight: 0}}>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectSlot={onSelectSlot}
          onSelectEvent={onSelectEvent}
          selectable
          view={view}
          onView={(v) => setView(v)}
          views={[Views.DAY, Views.WEEK, Views.MONTH, Views.AGENDA]}
          step={60}
          showMultiDayTimes
          eventPropGetter={eventPropGetter}
          dayLayoutAlgorithm="overlap"
          components={{event: ActivityEventView}}
          // length={1}
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