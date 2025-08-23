import path, { dirname } from "node:path";
import { fileURLToPath } from "url";
import { IResolvers } from "@graphql-tools/utils";
import BaseScraper, { ExpectedColumn } from "@grant-line/scraper";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const resolvers: IResolvers = {
	Mutation: {
		runScraper: async (_parent, args: {}) => {
			const base_url = "https://onepiece.fandom.com";
			const list_url = base_url + "/wiki/List_of_Canon_Characters";
			const path_characters = path.resolve(__dirname, "characters.json");
			const expected_columns: ExpectedColumn = [
				{ label: "Name", index: 0, type: "link" },
				{ label: "Year", index: 0, type: null },
				{ label: "Note", index: 0, type: null },
			];
			const baseScraper = new BaseScraper({
				characters_limit: 10,
				expected_columns,
				base_url,
				list_url,
				path_characters,
			});
			const response = await baseScraper.init();
			return response;
		},
	},
};
