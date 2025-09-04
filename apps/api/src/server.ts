const Fastify = require("fastify");
const { ApolloServer } = require("@apollo/server")
const fastifyApollo = require("@as-integrations/fastify")
const { typeDefs, resolvers } = require("./schema")
// import Fastify from "fastify";
// import { ApolloServer } from "@apollo/server";
// import fastifyApollo from "@as-integrations/fastify";
// import { typeDefs, resolvers } from "./schema/index.js";

exports.buildServer = async () => {
	const fastify = Fastify();

	const apollo = new ApolloServer({
		typeDefs,
		resolvers,
	});
	await apollo.start();
	await fastify.register(fastifyApollo(apollo));
	return fastify;
}
