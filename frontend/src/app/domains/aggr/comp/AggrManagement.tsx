import React, {useCallback, useContext, useState} from 'react';
import {Box, Button, Typography, Grid, CircularProgress} from '@mui/material';
import {Add} from '@mui/icons-material';
import {Aggr} from "@/app/domains/aggr/types.ts";
import {useCreateAggr, useDeleteAggr, useUpdateAggr} from "@/app/domains/aggr/api.ts";
import EditModal from "@/lib/components/EditModal";
import EntityCard from "@/lib/components/EntityCard";
import { useConfirm } from "@/lib/hooks/confirmDialog";
import AggrsContext from "@/app/domains/aggr/AggrsContext.tsx";

const defaultInputAggr: Aggr = {
  name: '',
  color: '#e74c3c',
  category_ids: [],
  description: ''
};

const AggrManagement: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [inputAggr, setInputAggr] = useState<Aggr>(defaultInputAggr);

  const {aggrs, loading, refetch: reLoad} = useContext(AggrsContext);
  const [createAggr, creating] = useCreateAggr();
  const [updateAggr, updating] = useUpdateAggr();
  const [deleteAggr] = useDeleteAggr();
  const saving = creating || updating;

  const { showConfirm } = useConfirm();

  const onChange = useCallback((changes: Aggr) => {
    setInputAggr(prev => ({...prev, ...changes}));
  }, [setInputAggr]);

  const onSave = async () => {
    if (inputAggr?.id) {
      await updateAggr(inputAggr.id, inputAggr);
    } else {
      await createAggr(inputAggr);
    }
    await reLoad();
    onCloseModal();
  };

  const onEdit = (aggr: Aggr) => {
    setInputAggr({...aggr});
    setShowModal(true);
  };

  const onDelete = (id: number) => {
    showConfirm('Are you sure you want to delete this aggregation?', async () => {
      await deleteAggr(id);
      reLoad();
    });
  };

  const onCloseModal = () => {
    setShowModal(false);
    setInputAggr(defaultInputAggr);
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
        <Typography variant="h5" component="h1">
          Aggregation Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add/>}
          onClick={() => setShowModal(true)}
        >
          Add Aggregation
        </Button>
      </Box>

      <Grid container spacing={3}>
        {aggrs.map(aggr => (
          <Grid size={{xs: 12, sm: 6, md: 4}} key={aggr.id}>
            <EntityCard
              entity={aggr}
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
        title={inputAggr?.id ? 'Edit Aggregation' : 'Add Aggregation'}
        entity={inputAggr}
        onChange={onChange}
        saving={saving}
        entityType="aggr"
      />
    </Box>
  );
};

export default AggrManagement;