import * as React from 'react';
import { Typography, Box } from '@mui/material';
import VideoTabs from '@/components/VideoTabs';

// Function to fetch videos from MongoDB and view counts from YouTube API
async function fetchVideos(singer: string, keywords: string[]) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YouTube API key is not set');
  }

  // Calculate the date range: from 7 days ago to now
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  try {
    // Fetch videos from MongoDB via /api/get_videos
    const response = await fetch(`/api/get_videos?singer=${encodeURIComponent(singer)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch videos for ${singer}`);
    }
    const videos = await response.json();

    // Filter videos to those published between 7 days ago and now
    const filteredVideos = videos.filter((video: any) => {
      const publishedAt = new Date(video.publishedAt);
      return publishedAt >= sevenDaysAgo && publishedAt <= now;
    });

    if (filteredVideos.length === 0) {
      return [];
    }

    // Fetch view counts from YouTube API
    const videoIds = filteredVideos.map((video: any) => video.videoId).join(',');
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${apiKey}`
    );
    const detailsData = await detailsResponse.json();

    if (!detailsData.items || detailsData.items.length === 0) {
      return [];
    }

    // Merge MongoDB data with view counts
    return filteredVideos.map((video: any) => {
      const youtubeVideo = detailsData.items.find((item: any) => item.id === video.videoId);
      return {
        title: video.title,
        videoId: video.videoId,
        views: youtubeVideo ? youtubeVideo.statistics.viewCount : '0',
        publishedAt: video.publishedAt,
      };
    });
  } catch (error) {
    console.error(`Error fetching videos for ${singer}:`, error);
    return [];
  }
}

export default async function NewRelease() {
  // Fetch videos for each tab server-side
  const harunoSoraVideos = await fetchVideos('Haruno Sora', ['Haruno Sora', '桜乃そら']);
  const hiyamaKiyoteruVideos = await fetchVideos('Hiyama Kiyoteru', ['Hiyama Kiyoteru', '氷山キヨテル']);
  const frimomenVideos = await fetchVideos('Frimomen', ['Frimomen', 'フリモメン']);

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