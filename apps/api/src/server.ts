import Fastify, { type FastifyRequest, type FastifyReply} from "fastify";
import rateLimit from "@fastify/rate-limit";
import jwt,{ type JwtPayload } from "jsonwebtoken";
import { ApolloServer } from "@apollo/server";
import fastifyApollo from "@as-integrations/fastify";
import type { ApolloFastifyContextFunction } from "@as-integrations/fastify";
import { typeDefs, resolvers } from "./schema/index.js";
interface MyContext {
  authorization: JwtPayload | string;
}

const isAuthorized = (authHeader: string | undefined) => {
	const token = authHeader ? authHeader.slice(7) : null;
	let response: string | JwtPayload = ''
	if (!token) {
		throw new Error("No token provided");
	}
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET || '');
		response = payload;
	} catch (_err) {
		throw new Error("Invalid or expired token");
	}
	return response
};

const myContextFunction: ApolloFastifyContextFunction<MyContext> = async (request: FastifyRequest, reply: FastifyReply) => ({
  authorization: await isAuthorized(request.headers.authorization),
});

const buildServer = async () => {
	const fastify = Fastify();
	fastify.register(rateLimit, {
		max: 100,
		timeWindow: "1 minute",
		// allowList: ["127.0.0.1"], // TODO:
	});
	console.log(typeDefs,resolvers)
	const apollo = new ApolloServer<MyContext>({
		typeDefs,
		resolvers,
		introspection: process.env.NODE_ENV !== "production",
		formatError: (_formattedError: any, error: any) => {
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
	});
	await apollo.start();
	await fastify.register(
		fastifyApollo(apollo), { context: myContextFunction });
	return fastify;
};

export {
	buildServer
};
