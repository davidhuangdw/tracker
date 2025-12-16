import React, {useCallback, useState} from 'react';
import {Box, Button, Typography, Grid, CircularProgress} from '@mui/material';
import {Add} from '@mui/icons-material';
import {Category} from "@/app/domains/category/types.ts";
import {useCreateCategory, useDeleteCategory, useFetchCategories, useUpdateCategory} from "@/app/domains/category/api.ts";
import EditModal from "@/lib/components/EditModal";
import EntityCard from "@/lib/components/EntityCard";
import { useConfirm } from "@/lib/hooks/confirmDialog";

const defaultInputCategory: Category = {
  name: '',
  color: '#e74c3c',
  description: ''
};

const CategoryManagement: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [inputCategory, setInputCategory] = useState<Category>(defaultInputCategory);

  const [categories, loading, reLoad] = useFetchCategories();
  const [createCategory, creating] = useCreateCategory();
  const [updateCategory, updating] = useUpdateCategory();
  const [deleteCategory] = useDeleteCategory();
  const saving = creating || updating;

  const { showConfirm } = useConfirm();

  const onChange = useCallback((changes: Category) => {
    setInputCategory(prev => ({...prev, ...changes}));
  }, [setInputCategory]);

  const onSave = async () => {
    if (inputCategory?.id) {
      await updateCategory(inputCategory.id, inputCategory);
    } else {
      await createCategory(inputCategory);
    }
    await reLoad();
    onCloseModal();
  };

  const onEdit = (category: Category) => {
    setInputCategory({...category});
    setShowModal(true);
  };

  const onDelete = (id: number) => {
    showConfirm('Are you sure you want to delete this category?', async () => {
      await deleteCategory(id);
      reLoad();
    });
  };

  const onCloseModal = () => {
    setShowModal(false);
    setInputCategory(defaultInputCategory);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress/>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
        <Typography variant="h4" component="h1">
          Category Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add/>}
          onClick={() => setShowModal(true)}
        >
          Add Category
        </Button>
      </Box>

      <Grid container spacing={3}>
        {categories.map(category => (
          <Grid size={{xs: 12, sm: 6, md: 4}} key={category.id}>
            <EntityCard
              entity={category}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </Grid>
        ))}
      </Grid>

      <EditModal
        open={showModal}
        onClose={onCloseModal}
        onSave={onSave}
        title={inputCategory?.id ? 'Edit Category' : 'Add Category'}
        entity={inputCategory}
        onChange={onChange}
        saving={saving}
        entityType="category"
      />
    </Box>
  );
};

export default CategoryManagement;