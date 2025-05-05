import fetch from 'node-fetch';

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

async function runCronJob() {
  console.log('Running cron job to fetch videos...');
  for (const singer of singers) {
    await fetchVideosForSinger(singer);
  }
}

// Run immediately for testing
runCronJob();

export {};





import cron from 'node-cron';

// Schedule cron job to run every hour
cron.schedule('0 * * * *', async () => {
  console.log('Running cron job to fetch videos...');
  for (const singer of singers) {
    await fetchVideosForSinger(singer);
  }
});

console.log('Cron job scheduled to run every hour.');
