const Fastify = require("fastify");
const rateLimit = require("@fastify/rate-limit");
const jwt = require("jsonwebtoken");
const { ApolloServer } = require("@apollo/server");
const fastifyApollo = require("@as-integrations/fastify").default
import {
// 	fastifyApolloDrainPlugin,
	type ApolloFastifyContextFunction,
} from "@as-integrations/fastify";

const { typeDefs, resolvers } = require("./schema");


interface Context {
  authorization: { user: any; };
}
const isAuthorized = (authHeader: string | null) => {
	const token = authHeader ? authHeader.slice(7) : null;
	if (!token) {
		throw new Error("No token provided");
	}
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		return { user: payload };
	} catch (_err) {
		throw new Error("Invalid or expired token");
	}
};
const context: ApolloFastifyContextFunction<Context> = async (request: any, _reply: any) => ({
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
		introspection: process.env.NODE_ENV !== "production",
		formatError: (_formattedError: any, error: { message: any; path: any; stack: any; }) => {
			// Obfuscating error details
			console.error("GraphQL Error:", {
				message: error.message,
				path: error.path,
				stack: error.stack,
			});
			return {
				message: "Internal server error",
				extensions: { code: "INTERNAL_SERVER_ERROR" },
			};
		},
		plugins: [fastifyApollo.fastifyApolloDrainPlugin(fastify)],
	});
	await apollo.start();
	await fastify.register(fastifyApollo(apollo), {
		context,
	});
	return fastify;
};
