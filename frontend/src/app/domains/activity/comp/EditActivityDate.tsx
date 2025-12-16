import React from 'react';
import moment, {Moment} from 'moment';
import {Grid, TextField} from '@mui/material';

// Convert ISO string to local datetime format for input field
const TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
const isoToLocalDateTime = (isoString?: string | Moment): string => {
  return moment(isoString).format(TIME_FORMAT);
};

// Convert local datetime string to ISO format
const localDateTimeToISO = (localDateTime?: string): string => {
  return moment(localDateTime).toISOString();
};

const EditActivityDate: React.FC<{
  from?: string;
  to?: string;
  onFromChange: (isoString: string) => void;
  onToChange: (isoString: string) => void;
}> = ({from, to, onFromChange, onToChange}) => {
  return (
    <Grid container spacing={2} sx={{mt: 1}}>
      <Grid size={{xs: 6}}>
        <TextField
          fullWidth
          label="From"
          type="datetime-local"
          value={isoToLocalDateTime(from)}
          onChange={(e) => onFromChange(localDateTimeToISO(e.target.value))}
          required
        />
      </Grid>
      <Grid size={{xs: 6}}>
        <TextField
          fullWidth
          label="To"
          type="datetime-local"
          value={isoToLocalDateTime(to)}
          onChange={(e) => onToChange(localDateTimeToISO(e.target.value))}
          required
        />
      </Grid>
    </Grid>
  );
};

export default EditActivityDate;