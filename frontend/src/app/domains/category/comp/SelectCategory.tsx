import React, { useContext } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip
} from '@mui/material';
import CategoriesContext from '../CategoriesContext.tsx';

const SelectCategory: React.FC< {
  value: number | string;
  onChange: (categoryId: number) => void;
  required?: boolean;
  showColorChip?: boolean;
}> = ({
  value,
  onChange,
  required = true,
  showColorChip = false
}) => {
  const { categories } = useContext(CategoriesContext);

  return (
    <FormControl fullWidth margin="normal" required={required}>
      <InputLabel>Category</InputLabel>
      <Select
        value={value}
        label="Category"
        onChange={(e) => onChange(parseInt(e.target.value as string))}
      >
        <MenuItem value="">Select Category</MenuItem>
        {categories.map(category => (
          <MenuItem key={category.id} value={category.id}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {showColorChip && category.color && (
                <Chip
                  size="small"
                  sx={{
                    backgroundColor: category.color, 
                    width: 16,
                    height: 16,
                    minHeight: 16
                  }}
                />
              )}
              {category.name}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectCategory;