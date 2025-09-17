const { buildServer } = require("./server");
const { connect } = require("@grant-line/database");
import "dotenv/config";
async function start() {
	await connect();
	console.log("🍀 Mongo database connected!");
	const app = await buildServer();
	app
		.listen({ port: 4000, host: "0.0.0.0" })
		.then(() => {
			console.log("🚀 Server ready at http://localhost:4000/graphql");
		})
		.catch((err: Error) => {
			console.error(err);
			process.exit(1);
		});
}

start();
