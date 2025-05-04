'use client';

import * as React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function AdminPortal() {
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    async function verifyAdmin() {
      try {
        const response = await fetch('http://localhost:4000/api/admin', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
        } else {
          setError(data.error || 'Access denied');
          localStorage.removeItem('token');
          router.push('/login');
        }
      } catch (err) {
        setError('An error occurred');
        localStorage.removeItem('token');
        router.push('/login');
      }
    }
    verifyAdmin();
  }, [router]);

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box className="mt-8 text-center">
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Box className="mt-8 text-center">
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box className="mt-8 text-центер">
        <Typography variant="h4" className="mb-4 text-blue-600">
          Admin Portal
        </Typography>
        <Typography>Welcome, {user.username}!</Typography>
        <Typography>Type: {user.type}</Typography>
      </Box>
    </Container>
  );
}