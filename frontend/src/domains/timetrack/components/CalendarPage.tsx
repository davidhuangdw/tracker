import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Event, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Activity, Category, Tag, CreateActivityDto, UpdateActivityDto } from '../types';
import { activityApi, categoryApi, tagApi } from '../services/api';
import ActivityModal from './ActivityModal';
import './CalendarPage.css';

const localizer = momentLocalizer(moment);

const CalendarPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);


  const fetchData = async () => {
    try {
      const [activitiesData, categoriesData, tagsData] = await Promise.all([
        activityApi.getAll(),
        categoryApi.getAll(),
        tagApi.getAll(),
      ]);
      console.log('--------fetchData', activitiesData, categoriesData, tagsData)
      setActivities(activitiesData);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      await fetchData();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  };

  const handleDeleteActivity = async (id: number) => {
    try {
      await activityApi.delete(id);
      await fetchData();
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
    }));
  };

  const events = convertToEvents(activities);
  console.log('--------events', activities, events)

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h2>Time Tracker Calendar</h2>
      </div>
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          view={Views.WEEK}
          views={[Views.DAY, Views.WEEK, Views.MONTH]}
          eventPropGetter={(event) => {
            const activity = event.activity as Activity;
            const category = categories.find(c => c.id === activity.category_id);
            return {
              style: {
                backgroundColor: category?.color || '#3498db',
                borderRadius: '4px',
                opacity: 0.8,
                color: 'white',
                border: 'none',
              },
            };
          }}
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

export default CalendarPage;
