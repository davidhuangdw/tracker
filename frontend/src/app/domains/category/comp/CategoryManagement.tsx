import React, { FC, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { Category } from "@/app/domains/category/types.ts";
import {
  useCreateCategory,
  useDeleteCategory,
  useFetchCategories,
  useUpdateCategory
} from "@/app/domains/category/api.ts";
import EditModal from "@/lib/components/EditModal";
import EntityCard from "@/lib/components/EntityCard";

const defaultCategoryInput: Category = {
  name: '',
  color: '#3498db',
  description: ''
}

const CategoryManagement: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [inputCategory, setInputCategory] = useState(defaultCategoryInput);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [categories, loading, reLoad] = useFetchCategories();
  const [create, creating] = useCreateCategory();
  const [update, updating] = useUpdateCategory();
  const [deleteCategory] = useDeleteCategory();
  const saving = creating || updating;

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (inputCategory.id) {
        await update(inputCategory.id, inputCategory);
      } else {
        await create(inputCategory);
      }
      await reLoad();
      onCloseModal();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const onEdit = (category: Category) => {
    setInputCategory({ ...category });
    setShowModal(true);
  };

  const onDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        await reLoad();
        setDeleteError(null);
      } catch (error) {
        setDeleteError('Failed to delete category');
        console.error('Error deleting category:', error);
      }
    }
  };

  const onCloseModal = () => {
    setShowModal(false);
    setInputCategory(defaultCategoryInput);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onColorChange = (color: string) => {
    setInputCategory(prev => ({
      ...prev,
      color
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Category Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowModal(true)}
        >
          Add Category
        </Button>
      </Box>

      {deleteError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setDeleteError(null)}>
          {deleteError}
        </Alert>
      )}

      <Grid container spacing={3}>
        {categories.map(category => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <EntityCard
              entity={category}
              onEdit={onEdit}
              onDelete={onDelete}
              entityType="category"
            />
          </Grid>
        ))}
      </Grid>

      <EditModal
        open={showModal}
        onClose={onCloseModal}
        onSubmit={onSave}
        title={inputCategory?.id ? 'Edit Category' : 'Add Category'}
        entity={inputCategory}
        onInputChange={onInputChange}
        onColorChange={onColorChange}
        saving={saving}
        entityType="category"
      />
    </Box>
  );
};

export default CategoryManagement;