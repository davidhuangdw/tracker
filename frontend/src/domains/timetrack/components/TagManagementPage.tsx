import React, { useState, useEffect } from 'react';
import { Tag, CreateTagDto, UpdateTagDto } from '../types';
import { tagApi } from '../services/api';
import './TagManagementPage.css';

const TagManagementPage: React.FC = () => {
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
    if (window.confirm('确定要删除这个标签吗？')) {
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
        <h2>标签管理</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          添加标签
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
              <p>{tag.description || '暂无描述'}</p>
              <div className="tag-actions">
                <button 
                  className="btn-edit"
                  onClick={() => handleEdit(tag)}
                >
                  编辑
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(tag.id)}
                >
                  删除
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
              <h3>{editingTag ? '编辑标签' : '添加标签'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>标签名称</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>颜色</label>
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>描述</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal}>取消</button>
                <button type="submit" disabled={loading}>
                  {loading ? '保存中...' : (editingTag ? '更新' : '创建')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagManagementPage;