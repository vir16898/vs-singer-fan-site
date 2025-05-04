import * as React from 'react';
import { Typography, Box } from '@mui/material';
import VideoTabs from '@/components/VideoTabs';

// Function to fetch all videos for given keywords
async function fetchVideos(keywords: string[]) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YouTube API key is not set');
  }

  // Calculate the start of the current week (Monday)
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - daysToMonday);
  weekStart.setHours(0, 0, 0, 0);

  const publishedAfter = weekStart.toISOString();

  try {
    // Join keywords with '|' for YouTube API query
    const query = keywords.map(encodeURIComponent).join('|');
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&order=date&publishedAfter=${publishedAfter}&maxResults=50&key=${apiKey}`
    );
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      // Fetch details for all videos
      const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
      const detailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${apiKey}`
      );
      const detailsData = await detailsResponse.json();

      return detailsData.items.map((video: any) => ({
        title: video.snippet.title,
        videoId: video.id,
        views: video.statistics.viewCount,
        publishedAt: video.snippet.publishedAt,
      }));
    }
    return [];
  } catch (error) {
    console.error(`Error fetching videos for ${keywords.join(', ')}:`, error);
    return [];
  }
}

export default async function NewRelease() {
  // Fetch videos for each tab server-side with multiple keywords
  const harunoSoraVideos = await fetchVideos(['Haruno Sora', '桜乃そら']);
  const hiyamaKiyoteruVideos = await fetchVideos(['Hiyama Kiyoteru', '氷山キヨテル']);
  const frimomenVideos = await fetchVideos(['Frimomen', 'フリモメン']);

  return (
    <Box className="mt-8">
      <Typography variant="h4" className="mb-4 text-blue-600">
        New Release
      </Typography>
      <VideoTabs
        harunoSoraVideos={harunoSoraVideos}
        hiyamaKiyoteruVideos={hiyamaKiyoteruVideos}
        frimomenVideos={frimomenVideos}
      />
    </Box>
  );
}