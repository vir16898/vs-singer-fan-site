'use client';
import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, List, ListItem, ListItemText } from '@mui/material';
import YouTube from 'react-youtube';

interface Video {
  videoId: string;
  singer: string;
  uploader: string;
  title: string;
  publishedAt: string;
}

export default function NewRelease() {
  const [singer, setSinger] = useState<string>('Haruno Sora');
  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async (singerName: string) => {
    try {
      const response = await fetch(`/api/get_videos${singerName ? `?singer=${encodeURIComponent(singerName)}` : ''}`);
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      const data = await response.json();
      setVideos(data);
      setError(null);
    } catch (err) {
      setError('Error fetching videos');
      setVideos([]);
    }
  };

  useEffect(() => {
    fetchVideos(singer);
  }, [singer]);

  const handleSearch = () => {
    fetchVideos(singer);
  };

  return (
    <Container maxWidth="md" className="mt-8">
      <Typography variant="h4" component="h1" gutterBottom>
        New Releases
      </Typography>
      <Box className="flex gap-4 mb-4">
        <TextField
          label="Singer"
          variant="outlined"
          value={singer}
          onChange={(e) => setSinger(e.target.value)}
          className="flex-grow"
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      <List>
        {videos.map((video) => (
          <ListItem key={video.videoId} className="flex flex-col items-start">
            <YouTube videoId={video.videoId} className="w-full max-w-md" />
            <ListItemText
              primary={video.title}
              secondary={`Singer: ${video.singer} | Uploader: ${video.uploader} | Published: ${new Date(video.publishedAt).toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}