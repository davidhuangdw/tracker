import React, {useMemo} from 'react';
import moment, {Moment} from 'moment';
import {floor} from "lodash";
import {Grid, Box, Typography, TextField} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const EditActivityDate: React.FC<{
  from?: Moment;
  to?: Moment;
  onFromChange: (momentObj: Moment) => void;
  onToChange: (momentObj: Moment) => void;
}> = ({from, to, onFromChange, onToChange}) => {
  const [hours, quarters] = useMemo(()=>{
    const min = moment(to).clone().diff(from, 'minutes');
    return [floor(min/60), floor(min%60/15)];
    }, [from, to]);

  const onChangeHours = (value: number) => {
    const diff = value - hours;
    onToChange(moment(to).clone().add(diff, 'hours'));
  }

  const onChangeQuarters = (value: number) => {
    const diff = (value - quarters)*15;
    onToChange(moment(to).clone().add(diff, 'minutes'));
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Box sx={{mt: 1}}>
        <Typography variant="subtitle2" gutterBottom color="text.secondary">
          Activity Time Range
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{xs: 6}}>
            <DateTimePicker
              label="Start Time"
              value={from || null}
              onChange={(newValue) => newValue && onFromChange(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                },
              }}
              maxDateTime={to}
            />
          </Grid>
          <Grid size={{xs: 6}}>
            <DateTimePicker
              label="End Time"
              value={to || null}
              onChange={(newValue) => newValue && onToChange(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                },
              }}
              minDateTime={from}
            />
          </Grid>
          
          <Grid size={{xs: 6}}>
            <TextField
              label="Hours"
              type="number"
              value={hours}
              onChange={(e) => onChangeHours(Number(e.target.value))}
              fullWidth
            />
          </Grid>
          <Grid size={{xs: 6}}>
            <TextField
              label="Quarters (15 min)"
              type="number"
              value={quarters}
              onChange={(e) => onChangeQuarters(Number(e.target.value))}
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default EditActivityDate;