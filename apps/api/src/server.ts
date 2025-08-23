import Fastify from "fastify";
import { ApolloServer } from "@apollo/server";
import fastifyApollo from "@as-integrations/fastify";
import { typeDefs, resolvers } from "./schema";

export async function buildServer() {
  const fastify = Fastify();

  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apollo.start();
  await fastify.register(fastifyApollo(apollo));

  return fastify;
}