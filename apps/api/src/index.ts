const { buildServer } = require("./server");
const { connect } = require("@grant-line/database");
async function start() {
	process.env.MONGO_CONNECTION =
		"mongodb://admin:secret@0.0.0.0:27017/grant-line?authSource=admin";
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
