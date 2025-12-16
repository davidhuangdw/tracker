import React from 'react';
import moment, {Moment} from 'moment';
import {Grid, TextField} from '@mui/material';

const TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
function toLocalDateTime(time?: Moment): string {
  return moment(time).format(TIME_FORMAT);
}

const EditActivityDate: React.FC<{
  from?: Moment;
  to?: Moment;
  onFromChange: (momentObj: Moment) => void;
  onToChange: (momentObj: Moment) => void;
}> = ({from, to, onFromChange, onToChange}) => {
  return (
    <Grid container spacing={2} sx={{mt: 1}}>
      <Grid size={{xs: 6}}>
        <TextField
          fullWidth
          label="From"
          type="datetime-local"
          value={toLocalDateTime(from)}
          onChange={(e) => onFromChange(moment(e.target.value))}
          required
        />
      </Grid>
      <Grid size={{xs: 6}}>
        <TextField
          fullWidth
          label="To"
          type="datetime-local"
          value={toLocalDateTime(to)}
          onChange={(e) => onToChange(moment(e.target.value))}
          required
        />
      </Grid>
    </Grid>
  );
};

export default EditActivityDate;