import { FastifyPluginAsync } from 'fastify';
import fetch from 'node-fetch';

const fetchVideoRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/fetch_video', async (request, reply) => {
    const { singer } = request.body as { singer: string };
    if (!['Haruno Sora', 'Hiyama Kiyoteru', 'Frimomen'].includes(singer)) {
      return reply.status(400).send({ error: 'Invalid singer' });
    }

    const youtubeApiKey = process.env.YOUTUBE_API_KEY;
    if (!youtubeApiKey) {
      return reply.status(500).send({ error: 'YouTube API key not configured' });
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(singer)}&type=video&key=${youtubeApiKey}`
      );
      const data = await response.json() as any;

      if (!data.items || data.items.length === 0) {
        return reply.status(404).send({ error: 'No videos found' });
      }

      const videos = data.items.map((item: any) => ({
        videoId: item.id.videoId,
        singer,
        uploader: item.snippet.channelTitle,
        title: item.snippet.title,
        publishedAt: new Date(item.snippet.publishedAt),
      }));

      // Store videos in MongoDB
      const collection = fastify.db.collection('videos');
      for (const video of videos) {
        await collection.updateOne(
          { videoId: video.videoId },
          { $set: video },
          { upsert: true }
        );
      }

      return { message: `Successfully fetched and stored ${videos.length} videos for ${singer}` };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch videos' });
    }
  });
};

export default fetchVideoRoutes;