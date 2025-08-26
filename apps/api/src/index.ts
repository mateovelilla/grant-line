import { buildServer } from "./server";
import mongo from "@grant-line/database";
async function start() {
	process.env.MONGO_CONNECTION = ""
	await mongo.connect();
	const app = await buildServer();
	app
		.listen({ port: 4000, host: "0.0.0.0" })
		.then(() => {
			console.log("🚀 Server ready at http://localhost:4000/graphql");
		})
		.catch((err) => {
			console.error(err);
			process.exit(1);
		});
}

start();
