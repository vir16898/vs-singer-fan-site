import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcrypt';

const loginRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body as { username: string; password: string };
    const user = await fastify.db.collection('users').findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const token = fastify.jwt.sign({ id: user._id, username: user.username, type: user.type });
    return { token };
  });
};

export default loginRoutes;