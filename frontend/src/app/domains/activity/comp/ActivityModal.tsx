import React, {useCallback, useState} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton
} from '@mui/material';
import {Close, Delete} from '@mui/icons-material';
import {Tag} from "@/app/domains/tag/types.ts";
import {Activity} from "@/app/domains/activity/types.ts";
import {EMPTY_ARR} from "@/lib/constants.ts";
import SelectCategory from "@/app/domains/category/comp/SelectCategory.tsx";
import SelectTags from "@/app/domains/tag/comp/SelectTags.tsx";
import EditActivityDate from "./EditActivityDate.tsx";
import { useConfirm } from "@/lib/hooks/confirmDialog";

const validActivity = (a: Activity) => {
  return !!(a.category_id && a.from && a.to);
}

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
  const {start, end} = selectedSlot || {};
  const { showConfirm } = useConfirm();

  const [inputActivity, setInputActivity] = useState<Activity>({
    from: start ? new Date(start).toISOString() : '',
    to: end ? new Date(end).toISOString() : '',
    ...activity
  });
  const {tags: inputTags = EMPTY_ARR} = inputActivity;

  const onChange = useCallback((changes: Activity) => {
    setInputActivity(prev => ({...prev, ...changes}));
  }, [setInputActivity]);

  const toggleTag = (tag: Tag) => {
    const has = inputTags?.some(t => t.id === tag.id);
    const tags = has ? inputTags?.filter(t => t.id !== tag.id) : [...(inputTags || EMPTY_ARR), tag];
    onChange({tags});
  };

  const handleDelete = () => {
    if (activity?.id) {
      showConfirm('Are you sure you want to delete this activity?', () => {
        onDelete(activity.id!);
      });
    }
  };

  return (
    <Dialog open={show} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        {activity ? 'Edit Activity' : 'Add Activity'}
        <IconButton onClick={onClose} size="small">
          <Close/>
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component="form" id="activity-form" sx={{mt: 2}}>
          <TextField
            multiline
            fullWidth
            label="Name"
            value={inputActivity.name || ''}
            onChange={(e) => setInputActivity(prev => ({...prev, name: e.target.value}))}
            margin="normal"
            // required
          />

          <EditActivityDate
            from={inputActivity.from}
            to={inputActivity.to}
            onFromChange={(from) => onChange({from})}
            onToChange={(to) => onChange({to})}
          />

          <SelectCategory
            value={inputActivity.category_id || ''}
            onChange={(category_id) => onChange({category_id})}
            required
            showColorChip
          />

          <SelectTags
            selectedTags={inputTags}
            onTagToggle={toggleTag}
            label="Tags"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{px: 3, pb: 3}}>
        {activity && (
          <Button
            startIcon={<Delete/>}
            onClick={handleDelete}
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
          disabled={!validActivity(inputActivity)}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActivityModal;