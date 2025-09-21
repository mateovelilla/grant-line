import path from "node:path";
import { readFile, unlink } from "node:fs/promises";
import { __dirname } from "../../utils/dirname.js";
import { BaseScraper } from "@grant-line/scraper";
import type { ExpectedColumn } from "@grant-line/scraper";
import type { FilterCharacters } from "@grant-line/database";
import {
	insertCharacters,
	findCharacterById,
	findCharacters,
	countCharacters
} from "@grant-line/database";

class CharacterController {
	runScaper = async () => {
		const base_url = process.env.BASE_URL_SCRAPER || "";
		const list_url = base_url + process.env.LIST_URL_SCRAPER || "";
		const path_characters = path.resolve(__dirname(import.meta.url), "characters.json");
		const expected_columns: ExpectedColumn[] = [
			{ label: "Name", index: 0, type: "link" },
			{ label: "Year", index: 0, type: null },
			{ label: "Note", index: 0, type: null },
		];
		const baseScraper = new BaseScraper({
			characters_limit: Number.parseInt(
				process.env.CHARACTERS_LIMIT || "5",
				10,
			),
			expected_columns,
			base_url,
			list_url,
			path_characters,
		});
		const response = await baseScraper.init();
		const data = await readFile(path_characters, "utf-8");
		const json = JSON.parse(data);
		const charactersMapped = json.map(
			({
				link,
				Name,
				Year,
				Note,
				img,
				description,
				appareance,
			}: {
				link: string;
				Name: string;
				Year: string;
				Note: string;
				img: string;
				description: string;
				appareance: string;
			}) => ({
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
		unlink(path_characters);
		return response;
	};
	findCharacter = async (_parent: unknown, args: { id: string }) => {
		const characters = await countCharacters();
		if (!characters) {
			await this.runScaper();
		}
		return await findCharacterById(args.id);
	};
	findCharacters = async (
		_parent: unknown,
		args: {
			name: string;
			year: number;
			appareance: string;
			offset: number;
			limit: number;
		},
	) => {
		const characters = await countCharacters();
		if (!characters) {
			await this.runScaper();
		}
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
		query.offset = args.offset || 0 
		query.limit = args.limit || Number.parseInt(process.env.DEFAULT_LIMIT || '0')
		return await findCharacters(query);
	};
}
export {
	CharacterController
}