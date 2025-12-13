import React, {useContext, useState} from 'react';
import moment, {Moment} from 'moment';
import {Tag} from "@/app/services/tag/types.ts";
import {Activity} from "@/app/services/activity/types.ts";
import {EMPTY_ARR} from "@/lib/constants.ts";
import CategoriesContext from "@/app/services/category/comp/CategoriesContext.tsx";
import TagsContext from "@/app/services/tag/comp/TagsContext.tsx";

// Convert ISO string to local datetime format for input field
const TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
const isoToLocalDateTime = (isoString?: string | Moment): string => {
  return moment(isoString).format(TIME_FORMAT);
};

// Convert local datetime string to ISO format
const localDateTimeToISO = (localDateTime?: string): string => {
  return moment(localDateTime).toISOString();
};

const ActivityModal: React.FC<{
  show: boolean;
  onClose: () => void;
  onSave: (activityData: Activity) => void;
  onDelete: (id: number) => void;
  activity: Activity | null;
  selectedSlot: { start: Date; end: Date } | null;
}> = ({
        show,
        onClose,
        onSave,
        onDelete,
        activity,
        selectedSlot,
      }) => {
  const {start, end} = selectedSlot || {};
  const {categories} = useContext(CategoriesContext);
  const {tags} = useContext(TagsContext);

  const [inputActivity, setInputActivity] = useState<Activity>({
    from: moment(start).toISOString(),
    to: moment(end).toISOString(),
    ...activity
  });
  const {tags: inputTags = EMPTY_ARR} = inputActivity;

  if (!show) return null;

  const toggleTag = (tag: Tag) => {
    const has = inputTags?.some(t => t.id === tag.id);
    const tags = has ? inputTags?.filter(t => t.id !== tag.id) : [...inputTags, tag];
    setInputActivity({...inputActivity, tags})
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{activity ? 'Edit Activity' : 'Add Activity'}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form className="modal-body" id="activity-form">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              value={inputActivity.name}
              onChange={(e) => setInputActivity(prev => ({...prev, name: e.target.value}))}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group" style={{flex: 1, marginRight: '0.5rem'}}>
              <label className="form-label">From</label>
              <input
                type="datetime-local"
                className="form-input"
                value={isoToLocalDateTime(inputActivity.from)}
                onChange={(e) => setInputActivity(prev => ({
                  ...prev,
                  from: localDateTimeToISO(e.target.value)
                }))}
                required
              />
            </div>
            <div className="form-group" style={{flex: 1, marginLeft: '0.5rem'}}>
              <label className="form-label">To</label>
              <input
                type="datetime-local"
                className="form-input"
                value={isoToLocalDateTime(inputActivity.to)}
                onChange={(e) => setInputActivity(prev => ({
                  ...prev,
                  to: localDateTimeToISO(e.target.value)
                }))}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={inputActivity.category_id}
              onChange={(e) => setInputActivity(prev => ({...prev, category_id: parseInt(e.target.value)}))}
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Tags</label>
            <div className="tags-container">
              {tags.map(tag => {
                const selected = inputActivity?.tags?.some(t => t.id === tag.id)
                return (
                  <button
                    key={tag.id}
                    type="button"
                    className={`tag-button ${selected ? 'selected' : ''}`}
                    style={{
                      backgroundColor: selected ? tag.color : 'transparent',
                      color: selected ? 'white' : tag.color,
                      border: `1px solid ${tag.color}`,
                    }}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>
        </form>
        <div className="modal-footer">
          {activity && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => activity.id && onDelete(activity.id)}
            >
              Delete
            </button>
          )}
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button onClick={() => onSave(inputActivity)} className="btn btn-primary">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;