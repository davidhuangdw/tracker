import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Box
} from '@mui/material';
import { Close } from '@mui/icons-material';
import ColorPicker from './ColorPicker';

export interface EditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  entity: {
    id?: number;
    name: string;
    color: string;
    description: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onColorChange: (color: string) => void;
  saving: boolean;
  entityType: 'category' | 'tag';
}

const EditModal: React.FC<EditModalProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  entity,
  onInputChange,
  onColorChange,
  saving,
  entityType
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={onSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            label={`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} Name`}
            name="name"
            value={entity.name}
            onChange={onInputChange}
            margin="normal"
            required
          />
          
          <ColorPicker
            value={entity.color}
            onChange={onColorChange}
            label={`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} Color`}
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={entity.description}
            onChange={onInputChange}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={saving || !entity.name}
            startIcon={saving ? <CircularProgress size={16} /> : null}
          >
            {saving ? 'Saving...' : (entity.id ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditModal;