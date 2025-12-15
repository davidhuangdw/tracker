import React, { useContext, useState } from 'react';
import moment, { Moment } from 'moment';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Grid,
  Typography,
  IconButton
} from '@mui/material';
import { Close, Delete } from '@mui/icons-material';
import { Tag } from "@/app/domains/tag/types.ts";
import { Activity } from "@/app/domains/activity/types.ts";
import { EMPTY_ARR } from "@/lib/constants.ts";
import CategoriesContext from "@/app/domains/category/comp/CategoriesContext.tsx";
import TagsContext from "@/app/domains/tag/comp/TagsContext.tsx";

// Convert ISO string to local datetime format for input field
const TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
const isoToLocalDateTime = (isoString?: string | Moment): string => {
  return moment(isoString).format(TIME_FORMAT);
};

// Convert local datetime string to ISO format
const localDateTimeToISO = (localDateTime?: string): string => {
  return moment(localDateTime).toISOString();
};

const ActivityModal: React.FC<{
  show: boolean;
  onClose: () => void;
  onSave: (activityData: Activity) => void;
  onDelete: (id: number) => void;
  activity: Activity | null;
  selectedSlot: { start: Date; end: Date } | null;
}> = ({
  show,
  onClose,
  onSave,
  onDelete,
  activity,
  selectedSlot,
}) => {
  const { start, end } = selectedSlot || {};
  const { categories } = useContext(CategoriesContext);
  const { tags } = useContext(TagsContext);

  const [inputActivity, setInputActivity] = useState<Activity>({
    from: moment(start).toISOString(),
    to: moment(end).toISOString(),
    ...activity
  });
  const { tags: inputTags = EMPTY_ARR } = inputActivity;

  const toggleTag = (tag: Tag) => {
    const has = inputTags?.some(t => t.id === tag.id);
    const tags = has ? inputTags?.filter(t => t.id !== tag.id) : [...inputTags, tag];
    setInputActivity({ ...inputActivity, tags });
  };

  return (
    <Dialog open={show} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {activity ? 'Edit Activity' : 'Add Activity'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component="form" id="activity-form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            value={inputActivity.name || ''}
            onChange={(e) => setInputActivity(prev => ({ ...prev, name: e.target.value }))}
            margin="normal"
            required
          />

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="From"
                type="datetime-local"
                value={isoToLocalDateTime(inputActivity.from)}
                onChange={(e) => setInputActivity(prev => ({
                  ...prev,
                  from: localDateTimeToISO(e.target.value)
                }))}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="To"
                type="datetime-local"
                value={isoToLocalDateTime(inputActivity.to)}
                onChange={(e) => setInputActivity(prev => ({
                  ...prev,
                  to: localDateTimeToISO(e.target.value)
                }))}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
          </Grid>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Category</InputLabel>
            <Select
              value={inputActivity.category_id || ''}
              label="Category"
              onChange={(e) => setInputActivity(prev => ({ 
                ...prev, 
                category_id: parseInt(e.target.value as string) 
              }))}
            >
              <MenuItem value="">Select Category</MenuItem>
              {categories.map(category => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {tags.map(tag => {
                const selected = inputActivity?.tags?.some(t => t.id === tag.id);
                return (
                  <Chip
                    key={tag.id}
                    label={tag.name}
                    onClick={() => toggleTag(tag)}
                    variant={selected ? "filled" : "outlined"}
                    sx={{
                      backgroundColor: selected ? tag.color : 'transparent',
                      color: selected ? 'white' : tag.color,
                      borderColor: tag.color,
                      '&:hover': {
                        backgroundColor: selected ? tag.color : `${tag.color}20`,
                      }
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {activity && (
          <Button
            startIcon={<Delete />}
            onClick={() => activity.id && onDelete(activity.id)}
            color="error"
            variant="outlined"
          >
            Delete
          </Button>
        )}
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={() => onSave(inputActivity)} 
          variant="contained"
          disabled={!inputActivity.name || !inputActivity.category_id}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActivityModal;