import React, { useContext, useState, useMemo } from 'react';
import {
  FormControl,
  Box,
  Chip,
  Autocomplete,
  TextField
} from '@mui/material';
import CategoriesContext from '../CategoriesContext.tsx';
import {Category} from "@/app/domains/category/types.ts";
import {castArray, compact} from "lodash";

type SelectCategoryProps = {
  category_ids: number[];
  onChange: (categoryIds: number[]) => void;
  required?: boolean;
  showColorChip?: boolean;
  multiple?: boolean;
};

const SelectCategory: React.FC<SelectCategoryProps> = ({
  category_ids,
  onChange,
  required = true,
  showColorChip = false,
  multiple = false
}) => {
  const { categories } = useContext(CategoriesContext);
  const [search, setSearch] = useState('');

  const filteredCategories = useMemo(() => {
    if (!search) return categories;
    
    const searchTerm = search.toLowerCase();
    return categories.filter(category => 
      category?.name?.toLowerCase().includes(searchTerm)
    );
  }, [categories, search]);

  const handleChange = (newValue: Category | Category[] | null) => {
    onChange(compact(castArray(newValue).map(cat => cat?.id)));
  };

  const selectedCates = categories.filter(cat => category_ids.includes(cat.id!));

  return (
    <FormControl fullWidth margin="normal" required={required}>
      <Autocomplete
        multiple={multiple}
        options={filteredCategories}
        getOptionLabel={(option) => option.name! || ''}
        value={multiple ? selectedCates : (selectedCates[0] || null)}
        onChange={(_e, newValue) => handleChange(newValue)}
        inputValue={search}
        onInputChange={(_e, newInputValue, reason) => {
          if (!multiple && selectedCates.length > 0 && reason === 'input' && newInputValue === selectedCates[0].name) {
            return;
          }
          setSearch(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={multiple ? "Categories" : "Category"}
            placeholder={multiple ? "Select categories..." : "Type to search categories..."}
            required={required}
          />
        )}
        renderOption={(props, option) => (
          <li {...props}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {showColorChip && option.color && (
                <Chip
                  size="small"
                  sx={{
                    backgroundColor: option.color, 
                    width: 16,
                    height: 16,
                    minHeight: 16
                  }}
                />
              )}
              {option.name}
            </Box>
          </li>
        )}
        renderTags={(value, getTagProps) =>
          multiple ? value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option.id}
              label={option.name}
              size="small"
              sx={{
                backgroundColor: option.color,
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          )) : undefined
        }
        noOptionsText="No categories found"
        clearOnBlur={false}
        blurOnSelect
      />
    </FormControl>
  );
};

export default SelectCategory;