import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';
import { connectToMongo } from './db';
import loginRoutes from './api/login';
import adminRoutes from './api/admin';
import fetchVideoRoutes from './api/fetch_video';
import getVideosRoutes from './api/get_videos';
import triggerFetchVideosRoutes from './api/trigger_fetch_videos';

const fastify = Fastify({ logger: true });

// Environment variables
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

// Connect to MongoDB and decorate fastify instance
async function initializeServer() {
  const db = await connectToMongo();
  fastify.decorate('db', db);
}

// Register plugins
fastify.register(cors, { origin: 'http://localhost:3000' });
fastify.register(jwt, { secret: jwtSecret });

// JWT authentication middleware
fastify.decorate('authenticate', async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' });
  }
});

// Register API routes
fastify.register(loginRoutes, { prefix: '/api' });
fastify.register(adminRoutes, { prefix: '/api' });
fastify.register(fetchVideoRoutes, { prefix: '/api' });
fastify.register(getVideosRoutes, { prefix: '/api' });
fastify.register(triggerFetchVideosRoutes, { prefix: '/api' });

// Start server
const start = async () => {
  try {
    await initializeServer(); // Ensure MongoDB is connected before starting
    await fastify.listen({ port: 4000 });
    console.log('Backend server running on http://localhost:4000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();