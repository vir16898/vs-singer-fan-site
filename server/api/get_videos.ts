import { FastifyPluginAsync } from 'fastify';

const getVideosRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/get_videos', async (request, reply) => {
    const { singer } = request.query as { singer?: string };

    try {
      const collection = fastify.db.collection('videos');
      const query = singer ? { singer } : {};
      const videos = await collection.find(query).sort({ publishedAt: -1 }).limit(20).toArray();

      return videos.map(video => ({
        videoId: video.videoId,
        singer: video.singer,
        uploader: video.uploader,
        title: video.title,
        publishedAt: video.publishedAt.toISOString(),
      }));
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to retrieve videos' });
    }
  });
};

export default getVideosRoutes;