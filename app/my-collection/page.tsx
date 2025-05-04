import * as React from 'react';
import { Typography, Box } from '@mui/material';

export default function MyCollection() {
  return (
    <Box className="mt-8">
      <Typography variant="h4" className="mb-4 text-blue-600">
        My Collection
      </Typography>
      <Typography variant="body1">
        View your collection here.
      </Typography>
    </Box>
  );
}