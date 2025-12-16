import React, {useContext} from 'react';
import {
  Box,
  Typography,
  Chip
} from '@mui/material';
import {Tag} from "../types.ts";
import TagsContext from '../TagsContext.tsx';

const SelectTags: React.FC<{
  selectedTags: Tag[];
  onTagToggle: (tag: Tag) => void;
  label?: string;
}> = ({selectedTags, onTagToggle, label = 'Tags'}) => {
  const {tags} = useContext(TagsContext);

  return (
    <Box sx={{mt: 2}}>
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>
      <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
        {tags.map(tag => {
          const selected = selectedTags?.some(t => t.id === tag.id);
          return (
            <Chip
              key={tag.id}
              label={tag.name}
              onClick={() => onTagToggle(tag)}
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
  );
};

export default SelectTags;