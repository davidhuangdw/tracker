import React, {useCallback, useState} from 'react';
import {Box, Button, Typography, Grid, CircularProgress} from '@mui/material';
import {Add} from '@mui/icons-material';
import {Tag} from "@/app/domains/tag/types.ts";
import {useCreateTag, useDeleteTag, useFetchTags, useUpdateTag} from "@/app/domains/tag/api.ts";
import EditModal from "@/lib/components/EditModal";
import EntityCard from "@/lib/components/EntityCard";
import { useConfirm } from "@/lib/hooks/confirmDialog";


const defaultInputTag: Tag = {
  name: '',
  color: '#e74c3c',
  description: ''
};

const TagManagement: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [inputTag, setInputTag] = useState<Tag>(defaultInputTag);

  const [tags, loading, reLoad] = useFetchTags();
  const [createTag, creating] = useCreateTag();
  const [updateTag, updating] = useUpdateTag();
  const [deleteTag] = useDeleteTag();
  const saving = creating || updating;
  const { showConfirm } = useConfirm();

  const onChange = useCallback((changes: Tag) => {
    setInputTag(prev => ({...prev, ...changes}));
  }, [setInputTag]);

  const onSave = async () => {
    if (inputTag?.id) {
      await updateTag(inputTag.id, inputTag);
    } else {
      await createTag(inputTag);
    }
    await reLoad();
    onCloseModal();
  };

  const onEdit = (tag: Tag) => {
    setInputTag({...tag});
    setShowModal(true);
  };

  const onDelete = (id: number) => {
    showConfirm('Are you sure you want to delete this tag?', async () => {
      await deleteTag(id);
      reLoad();
    });
  };

  const onCloseModal = () => {
    setShowModal(false);
    setInputTag(defaultInputTag);
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
          Tag Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add/>}
          onClick={() => setShowModal(true)}
        >
          Add Tag
        </Button>
      </Box>

      <Grid container spacing={3}>
        {tags.map(tag => (
          <Grid size={{xs: 12, sm: 6, md: 4}} key={tag.id}>
            <EntityCard
              entity={tag}
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
        title={inputTag?.id ? 'Edit Tag' : 'Add Tag'}
        entity={inputTag}
        onChange={onChange}
        saving={saving}
        entityType="tag"
      />
    </Box>
  );
};

export default TagManagement;