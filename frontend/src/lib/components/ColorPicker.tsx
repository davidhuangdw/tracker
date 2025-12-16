import React from 'react';
import { Box, Typography, Chip, Grid, IconButton } from '@mui/material';
import { ColorLens } from '@mui/icons-material';

const PRESET_COLORS = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
  '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
  '#795548', '#607d8b', '#000000', '#ffffff'
];

const ColorPicker: React.FC< {
  value: string | undefined;
  onChange: (color: string) => void;
  label?: string;
}> = ({ value='#2196f3', onChange, label = 'Color' }) => {
  return (
    <Box>
      <Typography variant="body2" gutterBottom>
        {label}
      </Typography>
      
      <Grid container spacing={1} sx={{ mb: 2 }}>
        {PRESET_COLORS.map((color) => (
          <Grid key={color}  >
            <IconButton
              size="small"
              onClick={() => onChange(color)}
              sx={{
                width: 32,
                height: 32,
                backgroundColor: color,
                border: value === color ? '2px solid #1976d2' : '1px solid #ddd',
                '&:hover': {
                  backgroundColor: color,
                  opacity: 0.8
                }
              }}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <ColorLens sx={{ color: value }} />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ 
            width: 50, 
            height: 30, 
            border: '1px solid #ddd', 
            borderRadius: 4,
            cursor: 'pointer'
          }}
        />
        <Chip
          label="Current"
          size="small"
          sx={{ 
            backgroundColor: value, 
            color: '#ffffff',
            fontWeight: 'bold',
            minWidth: 80
          }}
        />
      </Box>
    </Box>
  );
};

export default ColorPicker;