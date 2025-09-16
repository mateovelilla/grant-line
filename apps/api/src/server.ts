const Fastify = require("fastify");
const { ApolloServer } = require("@apollo/server");
const fastifyApollo = require("@as-integrations/fastify").default;
const { typeDefs, resolvers } = require("./schema");
import { buildSubgraphSchema } from "@apollo/subgraph";

exports.buildServer = async () => {
	const fastify = Fastify();
	fastify.addHook('onRequest', async(req,reply) => {
		const header = req.headers['x-router-secret'];
    	if (!header || header !== process.env.SUBGRAPH_ROUTER_SECRET) {
      		reply.code(401).send({ error: 'Unauthorized' });
    	}
	})
	const apollo = new ApolloServer({
		// typeDefs,
		// resolvers,
		schema:buildSubgraphSchema({ typeDefs, resolvers }),
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
	console.log("Subgraph ready at http://localhost:4002/graphql");
	return fastify;
};
