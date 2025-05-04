import { FastifyPluginAsync, FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

const adminRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/admin', { preHandler: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    // Fallback type assertion if global type declaration fails
    const user = request.user as {
      id: string;
      username: string;
      type: string;
    };
    if (user.type !== 'administrator') {
      return reply.status(403).send({ error: 'Access denied' });
    }
    return { message: 'Welcome to the admin portal', user };
  });
};

export default adminRoutes;