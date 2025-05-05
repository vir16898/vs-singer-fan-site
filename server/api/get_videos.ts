import { FastifyPluginAsync } from 'fastify';

const getVideosRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/get_videos', async (request, reply) => {
    const { singer } = request.query as { singer?: string };

    // Validate singer parameter
    const validSingers = ['Haruno Sora', 'Hiyama Kiyoteru', 'Frimomen'];
    if (!singer || !validSingers.includes(singer)) {
      return reply.status(400).send({ error: 'Invalid or missing singer parameter. Must be one of: ' + validSingers.join(', ') });
    }

    try {
      // Calculate date range: past 7 days
      const now = new Date();
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);

      const collection = fastify.db.collection('videos');
      const query = {
        singer,
        publishedAt: {
          $gte: sevenDaysAgo,
          $lte: now,
        },
      };
      const videos = await collection.find(query).sort({ publishedAt: -1 }).limit(20).toArray();

      fastify.log.info(`Fetched ${videos.length} videos for singer: ${singer}`);

      return videos.map(video => ({
        videoId: video.videoId,
        singer: video.singer,
        uploader: video.uploader,
        title: video.title,
        publishedAt: video.publishedAt.toISOString(),
      }));
    } catch (error) {
      fastify.log.error(`Error fetching videos for singer ${singer}:`, error);
      return reply.status(500).send({ error: 'Failed to retrieve videos' });
    }
  });
};

export default getVideosRoutes;