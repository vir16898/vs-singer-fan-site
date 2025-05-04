import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';

interface AdminRequest extends FastifyRequest {
  user: {
    id: string;
    username: string;
    type: string;
  } | null;
}

const adminRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/admin', { preHandler: [fastify.authenticate] }, async (request: AdminRequest, reply: FastifyReply) => {
    const user = request.user;
    if (!user || user.type !== 'administrator') {
      return reply.status(403).send({ error: 'Access denied' });
    }
    return { message: 'Welcome to the admin portal', user };
  });
};

export default adminRoutes;