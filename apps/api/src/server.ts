const Fastify = require("fastify");
const { ApolloServer } = require("@apollo/server");
const fastifyApollo = require("@as-integrations/fastify").default;
const { typeDefs, resolvers } = require("./schema");

exports.buildServer = async () => {
	const fastify = Fastify();
	const apollo = new ApolloServer({
		typeDefs,
		resolvers,
		introspection: process.env.NODE_ENV !== 'production',
		formatError: (formattedError, error) => { // Obfuscating error details
			console.error('GraphQL Error:', {
				message: error.message,
				path: error.path,
				stack: error.stack,
			});
			return {
			message: 'Internal server error',
			extensions: { code: 'INTERNAL_SERVER_ERROR' },
			};
 	 	},
	});
	await apollo.start();
	await fastify.register(fastifyApollo(apollo));
	return fastify;
};
