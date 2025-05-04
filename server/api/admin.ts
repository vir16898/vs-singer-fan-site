import { FastifyPluginAsync } from 'fastify';

const adminRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/admin', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const user = request.user;
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