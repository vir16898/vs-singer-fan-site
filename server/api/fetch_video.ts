import { FastifyPluginAsync } from 'fastify';
import fetch from 'node-fetch';

const fetchVideoRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/fetch_video', async (request, reply) => {
    const { singer, singers } = request.body as { singer?: string; singers?: string[] };
    const targetSingers = singers || (singer ? [singer] : []);

    if (!targetSingers.every(s => ['Haruno Sora', 'Hiyama Kiyoteru', 'Frimomen'].includes(s))) {
      return reply.status(400).send({ error: 'Invalid singer' });
    }

    const youtubeApiKey = process.env.YOUTUBE_API_KEY;
    if (!youtubeApiKey) {
      return reply.status(500).send({ error: 'YouTube API key not configured' });
    }

    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const publishedAfter = oneWeekAgo.toISOString();
      const publishedBefore = new Date().toISOString();

      const videos: any[] = [];
      for (const currentSinger of targetSingers) {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(currentSinger)}&type=video&publishedAfter=${publishedAfter}&publishedBefore=${publishedBefore}&key=${youtubeApiKey}`
        );
        const data = await response.json() as any;

        if (data.items && data.items.length > 0) {
          videos.push(...data.items.map((item: any) => ({
            videoId: item.id.videoId,
            singer: currentSinger,
            uploader: item.snippet.channelTitle,
            title: item.snippet.title,
            publishedAt: new Date(item.snippet.publishedAt),
          })));
        }
      }

      if (videos.length === 0) {
        return reply.status(404).send({ error: 'No videos found for the past week' });
      }

      // Store videos in MongoDB
      const collection = fastify.db.collection('videos');
      for (const video of videos) {
        await collection.updateOne(
          { videoId: video.videoId },
          { $set: video },
          { upsert: true }
        );
      }

      return { message: `Successfully fetched and stored ${videos.length} videos for ${targetSingers.join(', ')}` };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch videos' });
    }
  });
};

export default fetchVideoRoutes;