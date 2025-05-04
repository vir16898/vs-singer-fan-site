import { FastifyRequest, FastifyReply } from 'fastify';
import { Db } from 'mongodb';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    db: Db;
  }
}