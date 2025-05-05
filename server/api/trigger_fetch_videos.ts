import { FastifyPluginAsync } from 'fastify';
import fetch from 'node-fetch';

const triggerFetchVideosRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/trigger_fetch_videos', async (request, reply) => {
    const singers = ['Haruno Sora', 'Hiyama Kiyoteru', 'Frimomen'];
    const apiUrl = process.env.API_URL || 'http://localhost:4000/api/fetch_video';

    try {
      for (const singer of singers) {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ singer }),
        });
        const data = await response.json();
        if (!response.ok) {
          fastify.log.error(`Failed to fetch videos for ${singer}:`, data);
        } else {
          fastify.log.info(`Fetched videos for ${singer}:`, data);
        }
      }
      return { message: `Triggered video fetch for ${singers.join(', ')}` };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to trigger video fetch' });
    }
  });
};

export default triggerFetchVideosRoutes;