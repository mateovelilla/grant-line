import { readFile } from "node:fs/promises";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { IResolvers } from "@graphql-tools/utils";
import BaseScraper, { type ExpectedColumn } from "@grant-line/scraper";
import {
	type FilterCharacters,
	insertCharacters,
	findCharacterById,
	findCharacters
} from "@grant-line/database";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const resolvers: IResolvers = {
	Mutation: {
		runScraper: async (_parent) => {
			const base_url = "https://onepiece.fandom.com";
			const list_url = `${base_url}/wiki/List_of_Canon_Characters`;
			const path_characters = path.resolve(__dirname, "characters.json");
			const expected_columns: ExpectedColumn[] = [
				{ label: "Name", index: 0, type: "link" },
				{ label: "Year", index: 0, type: null },
				{ label: "Note", index: 0, type: null },
			];
			const baseScraper = new BaseScraper({
				characters_limit: 20,
				expected_columns,
				base_url,
				list_url,
				path_characters,
			});
			const response = await baseScraper.init();
			const data = await readFile(path_characters, "utf-8");
			const json = JSON.parse(data);
			const charactersMapped = json.map(
				({ link, Name, Year, Note, img, description, appareance }: {link: string, Name: string, Year: string, Note: string, img: string, description: string, appareance: string}) => ({
					name: Name,
					link,
					year: Year,
					note: Note,
					img,
					description,
					appareance,
				}),
			);
			await insertCharacters(charactersMapped);
			return response;
		},
	},
	Query: {
		character: async (_parent, args: { id: string }) => {
			return await findCharacterById(args.id);
		},
		characters: async (
			_parent,
			args: { name: string; year: number; appareance: string },
		) => {
			const query: FilterCharacters = {} as FilterCharacters;
			if (args.name) {
				query.name = { $regex: args.name, $options: "i" };
			}
			if (args.year) {
				query.year = args.year;
			}
			if (args.appareance) {
				query.appareance = { $regex: args.appareance, $options: "i" };
			}
			return await findCharacters(query);
		},
	},
};
