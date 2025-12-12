import React, { useState, useEffect } from 'react';
import './CategoryManagement.css';
import {Category, CreateCategoryDto, UpdateCategoryDto} from "@/app/services/category/types.ts";
import {categoryApi} from "@/app/services/category/api.ts";

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3498db',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCategory) {
        const updateData: UpdateCategoryDto = {
          name: formData.name,
          color: formData.color,
          description: formData.description
        };
        await categoryApi.update(editingCategory.id, updateData);
      } else {
        const createData: CreateCategoryDto = {
          name: formData.name,
          color: formData.color,
          description: formData.description
        };
        await categoryApi.create(createData);
      }

      await fetchCategories();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
      description: category.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除这个分类吗？')) {
      try {
        await categoryApi.delete(id);
        await fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      color: '#3498db',
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
    <div className="category-management-page">
      <div className="page-header">
        <h2>分类管理</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          添加分类
        </button>
      </div>

      <div className="categories-grid">
        {categories.map(category => (
          <div key={category.id} className="category-card">
            <div 
              className="category-color" 
              style={{ backgroundColor: category.color }}
            ></div>
            <div className="category-info">
              <h3>{category.name}</h3>
              <p>{category.description || '暂无描述'}</p>
              <div className="category-actions">
                <button 
                  className="btn-edit"
                  onClick={() => handleEdit(category)}
                >
                  编辑
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(category.id)}
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
              <h3>{editingCategory ? '编辑分类' : '添加分类'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>分类名称</label>
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
                  {loading ? '保存中...' : (editingCategory ? '更新' : '创建')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;