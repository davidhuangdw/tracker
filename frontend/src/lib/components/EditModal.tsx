import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  CircularProgress
} from '@mui/material';
import {Close} from '@mui/icons-material';
import ColorPicker from './ColorPicker';
import {Category} from "@/app/domains/category/types.ts";
import {Tag} from "@/app/domains/tag/types.ts";

const EditModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  entity: Category | Tag;
  onChange: (changes: Category | Tag) => void;
  saving: boolean;
  entityType: 'category' | 'tag';
}> = ({
        open,
        onClose,
        onSave,
        title,
        entity,
        onChange,
        saving,
        entityType
      }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        {title}
        <IconButton onClick={onClose} size="small">
          <Close/>
        </IconButton>
      </DialogTitle>

      <form>
        <DialogContent>
          <TextField
            fullWidth
            label={`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} Name`}
            name="name"
            value={entity.name}
            onChange={(e) => onChange({...entity, name: e.target.value})}
            margin="normal"
            required
          />

          <ColorPicker
            value={entity.color}
            onChange={(color) => onChange({...entity, color})}
            label={`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} Color`}
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={entity.description}
            onChange={(e) => onChange({...entity, description: e.target.value})}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>

        <DialogActions sx={{px: 3, pb: 3}}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={onSave}
            disabled={saving || !entity.name}
            startIcon={saving ? <CircularProgress size={16}/> : null}
          >
            {saving ? 'Saving...' : (entity.id ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditModal;