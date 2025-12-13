import React, {useState, useMemo, useContext} from 'react';
import moment from 'moment';
import {Calendar as BigCalendar, momentLocalizer, Event, Views, View} from 'react-big-calendar';
import {Activity} from "@/app/services/activity/types.ts";
import {
  useCreateActivity,
  useDeleteActivity,
  useFetchActivities,
  useUpdateActivity
} from "@/app/services/activity/api.ts";
import CategoriesContext from "@/app/services/category/comp/CategoriesContext.tsx";
import ActivityModal from "@/app/services/activity/comp/ActivityModal.tsx";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './ActivityCalendar.css';

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

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot(slotInfo);
    setEditingActivity(null);
    setShowModal(true);
  };

  const handleSelectEvent = (event: ActivityEvent) => {
    const activity = activities.find(a => a.id === event.id) || null;
    setEditingActivity(activity);
    setSelectedSlot(null);
    setShowModal(true);
  };

  const handleSaveActivity = async (activityData: Activity) => {
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

  const handleDeleteActivity = async (id: number) => {
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
    <div className="calendar-page">
      <div className="calendar-header">
        <h2>Time Tracker Calendar</h2>
      </div>
      <div className="calendar-container">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          view={currentView}
          onView={(v) => setCurrentView(v)}
          views={[Views.DAY, Views.WEEK, Views.MONTH, Views.AGENDA]}
          step={60}
          showMultiDayTimes
          eventPropGetter={getEventStyle}
          dayLayoutAlgorithm="no-overlap"
        />
      </div>

      <ActivityModal
        key={`${showModal}`}
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveActivity}
        onDelete={handleDeleteActivity}
        activity={editingActivity}
        selectedSlot={selectedSlot}
      />
    </div>
  );
};

export default ActivityCalendar;