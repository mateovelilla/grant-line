import { serve } from "@hono/node-server";
import { Hono } from "hono";
import BaseScraper from "./baseScraper.js"
const app = new Hono();

app.post("/migration", async (c) => {
	const baseScraper = new BaseScraper();
	const response = await baseScraper.init()
	return c.text(response);
});

serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);

process.on('SIGINT', () => {
  serve.close()
  process.exit(0)
})
process.on('SIGTERM', () => {
  serve.close((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    process.exit(0)
  })
})
