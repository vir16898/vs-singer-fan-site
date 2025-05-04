'use client';

import * as React from 'react';
import { Box, Typography, TextField, Button, Container } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        router.push('/admin');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box className="mt-8 text-center">
        <Typography variant="h4" className="mb-4 text-blue-600">
          Administrator Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            className="mb-4"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            className="mb-4"
          />
          {error && (
            <Typography color="error" className="mb-4">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            className="bg-blue-500 hover:bg-blue-600"
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
}