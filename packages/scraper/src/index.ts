// import { writeFile } from "node:fs/promises";
// import { chromium } from "@playwright/test";
// import type { Browser, Page, Locator } from "playwright";
// import { existsSync } from "node:fs";

import type { Browser, Page, Locator } from "playwright";
const { writeFile } = require("node:fs/promises");
const { chromium } = require("@playwright/test");
const { existsSync } = require("node:fs");
export type ExpectedColumn = {
	label: string;
	index: number;
	type: string | null;
};
export type Character = {
	Name: string;
	Year: string;
	Note: string;
	link: string | undefined;
	img: string;
	description: string;
	appareance: string;
};
export type ImageHtml =  { src: string };
class BaseScraper {
	CHARACTERS_LIMIT: number;
	EXPECTED_COLUMNS!: ExpectedColumn[];
	BASE_URL: string;
	LIST_URL: string;
	PATH_CHARACTERS: string;
	browser: Browser | undefined;
	page: Page | undefined;
	characters: Character[] | undefined;

	constructor({
		characters_limit = 10,
		expected_columns,
		base_url,
		list_url,
		path_characters,
	}: {
		characters_limit: number;
		expected_columns: ExpectedColumn[];
		base_url: string;
		list_url: string;
		path_characters: string;
	}) {
		this.CHARACTERS_LIMIT = characters_limit;
		this.EXPECTED_COLUMNS = expected_columns;
		this.BASE_URL = base_url;
		this.LIST_URL = list_url;
		this.PATH_CHARACTERS = path_characters;
	}
	async extractColumns() {
		const rows_raw: Locator[] = [];
		const locator = this.page?.locator(
			`.fandom-table:nth-of-type(1) tbody tr:nth-of-type(-n+${this.CHARACTERS_LIMIT})`,
		);
		const header = this.page?.locator(".fandom-table:nth-of-type(1) thead th");
		const headers = await header?.evaluateAll((elements) => {
			return elements.map((header, index) => ({
				label: header.textContent.trim(),
				index,
			}));
		});
		this.EXPECTED_COLUMNS = this.EXPECTED_COLUMNS.map(({ label, type }) => ({
			label,
			index: headers?.find((col) => col.label === label)?.index || 0,
			type,
		}));
		if (locator) {
			for (const element of await locator.all()) {
				rows_raw.push(element);
			}
		}
		return rows_raw;
	}
	async serializeTable(
		characters: Locator[],
		expected_columns: ExpectedColumn[],
	) {
		const results: { [key: string]: any } [] = []
		for (let y = 0; y < characters.length; y++) {
			const element = characters[y];
			const tds_locator = element?.locator("td");
			const character: { [key: string]: any }  = {};
			
			// biome-ignore lint/suspicious/noExplicitAny: This is a temporary workaround for untyped data.
			const tds_refactored = await tds_locator?.evaluateAll((tds: any[]) => {
				return tds.map((td) => {
					const column = { href: "", text: "" };
					if (Object.keys(td.childNodes).length > 1) {
						column.href = td.childNodes["0"].href;
					}
					column.text = td.textContent;
					return column;
				});
			});
			for (let i = 0; i < expected_columns.length; i++) {
				const header = expected_columns[i] || { label: "", index: 0, type: null};
				character[header.label] ??= tds_refactored ? tds_refactored[header.index]?.text : "";
				if (header.type === "link") {
					character.link ??= tds_refactored ? tds_refactored[header.index]?.href : "";
				}
			}
			results[y] = character;
		}
		return results;
	}
	async getIndividualInformation(characters: { [key: string]: any } []) {
		this.browser = await chromium.launch({ headless: true });
		const context = await this.browser?.newContext();
		this.page = await context?.newPage();
		const charactersDetailed: Character[] = []
		for (let i = 0; i < characters.length; i++) {
			console.log("Getting individual information...");
			const character = characters[i];
			await this.page?.goto(character?.link || '', {
				waitUntil: "domcontentloaded",
				timeout: 0,
			});
			const images = this.page?.locator("#content aside img");
			const images_evaluated = await images?.evaluateAll((imgs) =>
				imgs.map((img) => img as HTMLImageElement),
			);
			const locator_description = this.page?.locator("#content p");
			const p = await locator_description?.evaluateAll((ps) =>
				ps.map((p) => p.textContent),
			);
			if(character) {
				character.img = images_evaluated ? images_evaluated[0]?.src : "";
				character.description = p ? p[0] : "";
				character.appareance = p ? p[1] : "";
			}
			charactersDetailed[i] = character as Character;
		}
		await this.browser?.close();
		return charactersDetailed;
	}
	async buildJson(characters: Character[]) {
		const data = JSON.stringify(characters, null, 2);
		await writeFile(this.PATH_CHARACTERS, data, "utf8");
	}
	async enqueue() {
		this.browser = await chromium.launch({ headless: true });
		const context = await this.browser?.newContext();
		this.page = await context?.newPage();
		await this.page?.goto(this.LIST_URL, { timeout: 0 });
		const rows = await this.extractColumns();
		const characters = await this.serializeTable(rows, this.EXPECTED_COLUMNS);
		await this.browser?.close();
		const refactoredCharacters =
			await this.getIndividualInformation(characters);
		await this.buildJson(refactoredCharacters);
	}
	async init() {
		const response = {
			msg: "request enqueued, it could take a lot time!",
		};
		if (existsSync(this.PATH_CHARACTERS)) {
			response.msg = "the characters already exists!";
		} else {
			await this.enqueue();
		}
		return response;
	}
}
module.exports = BaseScraper;
