import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { Tag } from "@/app/domains/tag/types.ts";
import { useCreateTag, useDeleteTag, useFetchTags, useUpdateTag } from "@/app/domains/tag/api.ts";
import EditModal from "@/lib/components/EditModal";
import EntityCard from "@/lib/components/EntityCard";

const defaultInputTag: Tag = {
  name: '',
  color: '#e74c3c',
  description: ''
};

const TagManagement: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [inputTag, setInputTag] = useState<Tag>(defaultInputTag);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [tags, loading, reLoad] = useFetchTags();
  const [createTag, creating] = useCreateTag();
  const [updateTag, updating] = useUpdateTag();
  const [deleteTag] = useDeleteTag();
  const saving = creating || updating;

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (inputTag?.id) {
        await updateTag(inputTag.id, inputTag);
      } else {
        await createTag(inputTag);
      }
      await reLoad();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving tag:', error);
    }
  };

  const handleEdit = (tag: Tag) => {
    setInputTag({ ...tag });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      try {
        await deleteTag(id);
        await reLoad();
        setDeleteError(null);
      } catch (error) {
        setDeleteError('Failed to delete tag');
        console.error('Error deleting tag:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setInputTag(defaultInputTag);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputTag(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorChange = (color: string) => {
    setInputTag(prev => ({
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
          Tag Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowModal(true)}
        >
          Add Tag
        </Button>
      </Box>

      {deleteError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setDeleteError(null)}>
          {deleteError}
        </Alert>
      )}

      <Grid container spacing={3}>
        {tags.map(tag => (
          <Grid item xs={12} sm={6} md={4} key={tag.id}>
            <EntityCard
              entity={tag}
              onEdit={handleEdit}
              onDelete={handleDelete}
              entityType="tag"
            />
          </Grid>
        ))}
      </Grid>

      <EditModal
        open={showModal}
        onClose={handleCloseModal}
        onSubmit={onSave}
        title={inputTag?.id ? 'Edit Tag' : 'Add Tag'}
        entity={inputTag}
        onInputChange={handleInputChange}
        onColorChange={handleColorChange}
        saving={saving}
        entityType="tag"
      />
    </Box>
  );
};

export default TagManagement;