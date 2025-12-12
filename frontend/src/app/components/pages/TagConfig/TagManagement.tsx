import React, { useState, useEffect } from 'react';
import './TagManagement.css';
import {CreateTagDto, Tag, UpdateTagDto} from "@/app/services/tag/domain/types.ts";
import {tagApi} from "@/app/services/tag/domain/api.ts";

const TagManagement: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#e74c3c',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const data = await tagApi.getAll();
      setTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingTag) {
        const updateData: UpdateTagDto = {
          name: formData.name,
          color: formData.color,
          description: formData.description
        };
        await tagApi.update(editingTag.id, updateData);
      } else {
        const createData: CreateTagDto = {
          name: formData.name,
          color: formData.color,
          description: formData.description
        };
        await tagApi.create(createData);
      }

      await fetchTags();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving tag:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      color: tag.color,
      description: tag.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      try {
        await tagApi.delete(id);
        await fetchTags();
      } catch (error) {
        console.error('Error deleting tag:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTag(null);
    setFormData({
      name: '',
      color: '#e74c3c',
      description: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="tag-management-page">
      <div className="page-header">
        <h2>Tag Management</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          Add Tag
        </button>
      </div>

      <div className="tags-grid">
        {tags.map(tag => (
          <div key={tag.id} className="tag-card">
            <div 
              className="tag-color" 
              style={{ backgroundColor: tag.color }}
            ></div>
            <div className="tag-info">
              <h3>{tag.name}</h3>
              <p>{tag.description || 'No description'}</p>
              <div className="tag-actions">
                <button 
                  className="btn-edit"
                  onClick={() => handleEdit(tag)}
                >
                  Edit
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(tag.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingTag ? 'Edit Tag' : 'Add Tag'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tag Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Color</label>
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (editingTag ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagManagement;