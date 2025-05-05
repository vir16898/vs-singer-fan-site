import fetch from 'node-fetch';
import cron from 'node-cron';

const singers = ['Haruno Sora', 'Hiyama Kiyoteru', 'Frimomen'];
const apiUrl = process.env.API_URL || 'https://vs-singer-fan-site.vercel.app/api/fetch_video';

async function fetchVideosForSinger(singer: string) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ singer }),
    });
    const data = await response.json();
    console.log(`Cron job result for ${singer}:`, data);
  } catch (error) {
    console.error(`Error fetching videos for ${singer}:`, error);
  }
}

async function fetchAllVideos() {
  console.log('Running cron job to fetch videos for all singers...');
  for (const singer of singers) {
    await fetchVideosForSinger(singer);
  }
}

// Schedule cron job to run daily at 00:00 (midnight) UTC
cron.schedule('0 0 * * *', fetchAllVideos);

// Run immediately for testing
fetchAllVideos();

console.log('Cron job scheduled to run daily at 00:00 UTC.');

export {};