import React, {useState} from 'react';
import './TagManagement.css';
import {Tag} from "@/app/services/tag/types.ts";
import {useCreateTag, useDeleteTag, useFetchTags, useUpdateTag} from "@/app/services/tag/api.ts";

const defaultInputTag: Tag = {
  name: '',
  color: '#e74c3c',
  description: ''
};

const TagManagement: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [inputTag, setInputTag] = useState<Tag>(defaultInputTag);
  const [tags, , reLoad] = useFetchTags();
  const [createTag, creating] = useCreateTag();
  const [updateTag, updating] = useUpdateTag();
  const [deleteTag] = useDeleteTag();
  const loading = creating || updating;

  const onSave = async () => {
    try {
      if (inputTag?.id) {
        await updateTag(inputTag.id, inputTag);
      } else {
        await createTag(inputTag!);
      }
      await reLoad();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving tag:', error);
    }
  };

  const handleEdit = (tag: Tag) => {
    setInputTag({...tag});
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      try {
        await deleteTag(id);
        await reLoad();
      } catch (error) {
        console.error('Error deleting tag:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setInputTag(defaultInputTag);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setInputTag({
      ...inputTag,
      [name]: value
    });
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
              style={{backgroundColor: tag.color}}
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
                  onClick={() => tag.id && handleDelete(tag.id)}
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
              <h3>{inputTag ? 'Edit Tag' : 'Add Tag'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <form>
              <div className="form-group">
                <label>Tag Name</label>
                <input
                  type="text"
                  name="name"
                  value={inputTag.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Color</label>
                <input
                  type="color"
                  name="color"
                  value={inputTag.color}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={inputTag.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal}>Cancel</button>
                <button type="button" onClick={onSave} disabled={loading}>
                  {loading ? 'Saving...' : (inputTag.id ? 'Update' : 'Create')}
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