import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {CreateTagDto, Tag} from "@/app/services/tag/types.ts";
import {tagApi} from "@/app/services/tag/api.ts";
import {Category, CreateCategoryDto} from "@/app/services/category/types.ts";
import {Activity, CreateActivityDto, UpdateActivityDto} from "@/app/services/activity/types.ts";
import {categoryApi} from "@/app/services/category/api.ts";

// Convert ISO string to local datetime format for input field
const isoToLocalDateTime = (isoString: string): string => {
  return moment(isoString).format('YYYY-MM-DDTHH:mm');
};

// Convert local datetime string to ISO format
const localDateTimeToISO = (localDateTime: string): string => {
  return moment(localDateTime).toISOString();
};

interface ActivityModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (activityData: CreateActivityDto | UpdateActivityDto) => void;
  onDelete: (id: number) => void;
  activity: Activity | null;
  selectedSlot: { start: Date; end: Date } | null;
  categories: Category[];
  tags: Tag[];
}

const ActivityModal: React.FC<ActivityModalProps> = ({
  show,
  onClose,
  onSave,
  onDelete,
  activity,
  selectedSlot,
  categories,
  tags,
}) => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    name: '',
    category_id: 0,
    selectedTags: [] as Tag[],
  });

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);
  const [newCategory, setNewCategory] = useState<CreateCategoryDto>({
    name: '',
    color: '#3498db',
    description: '',
  });
  const [newTag, setNewTag] = useState<CreateTagDto>({
    name: '',
    color: '#e74c3c',
    description: '',
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        from: activity.from,
        to: activity.to,
        name: activity.name,
        category_id: activity.category_id,
        selectedTags: activity.tags,
      });
    } else if (selectedSlot) {
      setFormData({
        from: moment(selectedSlot.start).toISOString(),
        to: moment(selectedSlot.end).toISOString(),
        name: '',
        category_id: categories.length > 0 ? categories[0].id : 0,
        selectedTags: [],
      });
    } else {
      const now = moment();
      setFormData({
        from: now.toISOString(),
        to: now.add(1, 'hour').toISOString(),
        name: '',
        category_id: categories.length > 0 ? categories[0].id : 0,
        selectedTags: [],
      });
    }
  }, [activity, selectedSlot, categories]);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      from: formData.from,
      to: formData.to,
      name: formData.name,
      category_id: formData.category_id,
      tags: formData.selectedTags,
    });
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await categoryApi.create(newCategory);
      window.location.reload();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleTagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await tagApi.create(newTag);
      window.location.reload();
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  const toggleTag = (tag: Tag) => {
    setFormData(prev => {
      const isSelected = prev.selectedTags.some(t => t.id === tag.id);
      if (isSelected) {
        return {
          ...prev,
          selectedTags: prev.selectedTags.filter(t => t.id !== tag.id),
        };
      } else {
        return {
          ...prev,
          selectedTags: [...prev.selectedTags, tag],
        };
      }
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{activity ? 'Edit Activity' : 'Add Activity'}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body" id="activity-form">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 1, marginRight: '0.5rem' }}>
              <label className="form-label">From</label>
              <input
                type="datetime-local"
                className="form-input"
                value={isoToLocalDateTime(formData.from)}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  from: localDateTimeToISO(e.target.value) 
                }))}
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1, marginLeft: '0.5rem' }}>
              <label className="form-label">To</label>
              <input
                type="datetime-local"
                className="form-input"
                value={isoToLocalDateTime(formData.to)}
                onChange={(e) => setFormData(prev => ({ 
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
              value={formData.category_id}
              onChange={(e) => setFormData(prev => ({ ...prev, category_id: parseInt(e.target.value) }))}
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-secondary" style={{ marginTop: '0.5rem' }}
              onClick={() => setShowCategoryForm(!showCategoryForm)}
            >
              {showCategoryForm ? 'Cancel' : 'Add New Category'}
            </button>
            {showCategoryForm && (
              <form onSubmit={handleCategorySubmit} className="category-form">
                <div className="form-row">
                  <div className="form-group" style={{ flex: 2, marginRight: '0.5rem' }}>
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1, marginLeft: '0.5rem', marginRight: '0.5rem' }}>
                    <label className="form-label">Color</label>
                    <input
                      type="color"
                      className="form-input"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                  Create Category
                </button>
              </form>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Tags</label>
            <div className="tags-container">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  className={`tag-button ${formData.selectedTags.some(t => t.id === tag.id) ? 'selected' : ''}`}
                  style={{
                    backgroundColor: formData.selectedTags.some(t => t.id === tag.id) ? tag.color : 'transparent',
                    color: formData.selectedTags.some(t => t.id === tag.id) ? 'white' : tag.color,
                    border: `1px solid ${tag.color}`,
                  }}
                  onClick={() => toggleTag(tag)}
                >
                  {tag.name}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-secondary" style={{ marginTop: '0.5rem' }}
              onClick={() => setShowTagForm(!showTagForm)}
            >
              {showTagForm ? 'Cancel' : 'Add New Tag'}
            </button>
            {showTagForm && (
              <form onSubmit={handleTagSubmit} className="tag-form">
                <div className="form-row">
                  <div className="form-group" style={{ flex: 2, marginRight: '0.5rem' }}>
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newTag.name}
                      onChange={(e) => setNewTag(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1, marginLeft: '0.5rem', marginRight: '0.5rem' }}>
                    <label className="form-label">Color</label>
                    <input
                      type="color"
                      className="form-input"
                      value={newTag.color}
                      onChange={(e) => setNewTag(prev => ({ ...prev, color: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newTag.description}
                    onChange={(e) => setNewTag(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                  Create Tag
                </button>
              </form>
            )}
          </div>
        </form>
        <div className="modal-footer">
          {activity && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => onDelete(activity.id)}
            >
              Delete
            </button>
          )}
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="activity-form" className="btn btn-primary">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;