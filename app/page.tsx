import * as React from 'react';
import { Typography, Box } from '@mui/material';

export default function Home() {
  return (
    <Box className="text-center mt-8">
      <Typography variant="h4" className="mb-4 text-blue-600">
        Welcome to My App
      </Typography>
      <Typography variant="body1">
        Use the menu above to navigate to New Release, Ranking, Search, or My Collection.
      </Typography>
    </Box>
  );
}