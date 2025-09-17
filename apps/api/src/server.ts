const Fastify = require("fastify");
import rateLimit from "@fastify/rate-limit";
import jwt from "jsonwebtoken";
const { ApolloServer } = require("@apollo/server");
import fastifyApollo, { fastifyApolloDrainPlugin, ApolloFastifyContextFunction } from "@as-integrations/fastify";

const { typeDefs, resolvers } = require("./schema");
const isAuthorized = (authHeader) => {
	const token = authHeader
	? authHeader.slice(7)
	: null;
	if (!token) {
		throw new Error("No token provided");
	}
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		return { user: payload };
	} catch (err) {
		throw new Error("Invalid or expired token");
	}
}
const myContextFunction: ApolloFastifyContextFunction = async (request, reply) => ({
  authorization: await isAuthorized(request.headers.authorization),
});

exports.buildServer = async () => {
	const fastify = Fastify();
	fastify.register(rateLimit, {
    	max: 100,
    	timeWindow: "1 minute",
    	// allowList: ["127.0.0.1"], // TODO:
  	});
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
		plugins: [fastifyApolloDrainPlugin(fastify)],
	});
	await apollo.start();
	await fastify.register(fastifyApollo(apollo), {
		context: myContextFunction,
	});
	return fastify;
};
