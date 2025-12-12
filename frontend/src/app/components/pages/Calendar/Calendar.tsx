import React, {useState, useMemo} from 'react';
import {Calendar as BigCalendar, momentLocalizer, Event, Views} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {useFetchTags} from "@/app/services/tag/api.ts";
import {Activity, CreateActivityDto, UpdateActivityDto} from "@/app/services/activity/types.ts";
import {useFetchCategories} from "@/app/services/category/api.ts";
import activityApi, {useFetchActivities} from "@/app/services/activity/api.ts";
import ActivityModal from './ActivityModal.tsx';
import './Calendar.css';

const localizer = momentLocalizer(moment);

const Calendar: React.FC = () => {
  const [activities, refetchActivities] = useFetchActivities();
  const [categories] = useFetchCategories();
  const [tags] = useFetchTags();
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [currentView, setCurrentView] = useState(Views.WEEK);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot(slotInfo);
    setEditingActivity(null);
    setShowModal(true);
  };

  const handleSelectEvent = (event: Event) => {
    const activity = activities.find(a => a.id === event.id) || null;
    setEditingActivity(activity);
    setSelectedSlot(null);
    setShowModal(true);
  };

  const handleSaveActivity = async (activityData: CreateActivityDto | UpdateActivityDto) => {
    try {
      if (editingActivity) {
        await activityApi.update(editingActivity.id, activityData as UpdateActivityDto);
      } else {
        await activityApi.create(activityData as CreateActivityDto);
      }
      refetchActivities();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  };

  const handleDeleteActivity = async (id: number) => {
    try {
      await activityApi.delete(id);
      refetchActivities();
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const convertToEvents = (activities: Activity[]): Event[] => {
    return activities.map(activity => ({
      id: activity.id,
      title: activity.name,
      start: new Date(activity.from),
      end: new Date(activity.to),
      allDay: false,
      activity,
      resource: {
        isMultiDay: moment(activity.to).diff(moment(activity.from), 'days') > 0
      }
    }));
  };

  const events = useMemo(() => convertToEvents(activities), [activities]);

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const getEventStyle = (event: Event) => {
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
          onView={handleViewChange}
          views={[Views.DAY, Views.WEEK, Views.MONTH, Views.AGENDA]}
          step={60}
          showMultiDayTimes
          eventPropGetter={getEventStyle}
          dayLayoutAlgorithm="no-overlap"
        />
      </div>

      <ActivityModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveActivity}
        onDelete={handleDeleteActivity}
        activity={editingActivity}
        selectedSlot={selectedSlot}
        categories={categories}
        tags={tags}
      />
    </div>
  );
};

export default Calendar;