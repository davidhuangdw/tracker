import React, {FC, useState} from 'react';
import './CategoryManagement.css';
import {Category} from "@/app/services/category/types.ts";
import {
  useCreateCategory,
  useDeleteCategory,
  useFetchCategories,
  useUpdateCategory
} from "@/app/services/category/api.ts";

const defaultCateInput: Category = {
  name: '',
  color: '#3498db',
  description: ''
}

const CategoryManagement: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [inputCategory, setInputCategory] = useState(defaultCateInput);

  const [categories, , reLoad] = useFetchCategories();
  const [create, creating] = useCreateCategory();
  const [update, updating] = useUpdateCategory();
  const [deleteCategory] = useDeleteCategory();
  const loading = creating || updating;

  const onSave = async () => {
    try {
      if (inputCategory.id) {
        await update(inputCategory.id, inputCategory);
      } else {
        await create(inputCategory);
      }

      await reLoad();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving category:', error);
  }
  };

  const handleEdit = (category: Category) => {
    setInputCategory({...category});
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        await reLoad();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  function handleCloseModal () {
    setShowModal(false);
    setInputCategory(defaultCateInput);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="category-management-page">
      <div className="page-header">
        <h2>Category Management</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          Add Category
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
              <p>{category.description || 'No description'}</p>
              <div className="category-actions">
                <button 
                  className="btn-edit"
                  onClick={() => handleEdit(category)}
                >
                  Edit
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(category.id!)}
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
              <h3>{inputCategory?.id ? 'Edit' : 'Add'} Category</h3>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={onSave}>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  name="name"
                  value={inputCategory.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Color</label>
                <input
                  type="color"
                  name="color"
                  value={inputCategory.color}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={inputCategory.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (inputCategory?.id ? 'Update' : 'Create')}
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
