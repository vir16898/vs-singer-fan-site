import * as React from 'react';
import { Typography, Box } from '@mui/material';

export default function Search() {
  return (
    <Box className="mt-8">
      <Typography variant="h4" className="mb-4 text-blue-600">
        Search
      </Typography>
      <Typography variant="body1">
        Search for content here.
      </Typography>
    </Box>
  );
}