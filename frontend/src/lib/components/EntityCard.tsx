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
import { Edit, Delete } from '@mui/icons-material';

export interface EntityCardProps {
  entity: {
    id: number;
    name: string;
    color: string;
    description: string;
  };
  onEdit: (entity: any) => void;
  onDelete: (id: number) => void;
  entityType: 'category' | 'tag';
}

const EntityCard: React.FC<EntityCardProps> = ({
  entity,
  onEdit,
  onDelete,
  entityType
}) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pb: 1 }}>
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
      
      <CardContent sx={{ flexGrow: 1, pt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {entity.description || 'No description'}
        </Typography>
      </CardContent>
      
      <CardActions>
        <Button
          size="small"
          startIcon={<Edit />}
          onClick={() => onEdit(entity)}
        >
          Edit
        </Button>
        <Button
          size="small"
          startIcon={<Delete />}
          onClick={() => onDelete(entity.id)}
          color="error"
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default EntityCard;