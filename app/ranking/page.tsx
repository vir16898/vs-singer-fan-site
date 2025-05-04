import * as React from 'react';
import { Typography, Box } from '@mui/material';

export default function Ranking() {
  return (
    <Box className="mt-8">
      <Typography variant="h4" className="mb-4 text-blue-600">
        Ranking
      </Typography>
      <Typography variant="body1">
        View the top rankings here.
      </Typography>
    </Box>
  );
}