import { FastifyPluginAsync, FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

const adminRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/admin', { preHandler: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as FastifyRequest).user as {
      id: string;
      username: string;
      type: string;
    };
    if (!user) {
      return { message: 'No user info : ', user };
    }
    if (user.type !== 'administrator') {
      return reply.status(403).send({ error: 'Access denied' });
    }
    return { message: 'Welcome to the admin portal', user };
  });
};

export default adminRoutes;