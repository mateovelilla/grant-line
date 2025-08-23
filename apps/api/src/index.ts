import { buildServer } from "./server";

async function start() {
  const app = await buildServer();

  app.listen({ port: 4000,host: "0.0.0.0" }).then(() => {
    console.log("🚀 Server ready at http://localhost:4000/graphql");
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

start();
