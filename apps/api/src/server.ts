const Fastify = require("fastify");
const { ApolloServer } = require("@apollo/server");
const fastifyApollo = require("@as-integrations/fastify").default;
const { typeDefs, resolvers } = require("./schema");

exports.buildServer = async () => {
	const fastify = Fastify();
	console.log(typeDefs, resolvers);
	const apollo = new ApolloServer({
		typeDefs,
		resolvers,
	});
	await apollo.start();
	await fastify.register(fastifyApollo(apollo));
	return fastify;
};
