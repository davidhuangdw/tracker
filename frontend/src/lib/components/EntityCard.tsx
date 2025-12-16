import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Chip,
  Typography,
  Button,
  Box
} from '@mui/material';
import {Edit, Delete} from '@mui/icons-material';
import {Category} from "@/app/domains/category/types.ts";
import {Tag} from "@/app/domains/tag/types.ts";

export type Entity = Category | Tag;

const EntityCard: React.FC<{
  entity: Entity;
  onEdit: (entity: Entity) => void;
  onDelete: (id: number) => void;
}> = ({entity, onEdit, onDelete}) => {
  return (
    <Card sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
      <Box sx={{display: 'flex', alignItems: 'center', p: 2, pb: 1}}>
        <Chip
          label={entity.name}
          size="small"
          sx={{
            backgroundColor: entity.color,
            color: 'white',
            fontWeight: 'bold'
          }}
        />
      </Box>

      <CardContent sx={{flexGrow: 1, pt: 1}}>
        <Typography variant="body2" color="text.secondary">
          {entity.description || 'No description'}
        </Typography>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          startIcon={<Edit/>}
          onClick={() => onEdit(entity)}
        >
          Edit
        </Button>
        <Button
          size="small"
          startIcon={<Delete/>}
          onClick={() => entity?.id && onDelete(entity.id)}
          color="error"
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default EntityCard;