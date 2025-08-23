import fs from "node:fs/promises";
import path,{ dirname }  from "node:path"
import { chromium } from "@playwright/test";
import { type Browser, type Page } from "playwright"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { existsSync } from "node:fs";
export type ExpectedColumn = {
    label: string;
    index: number | undefined;
    type: string | null;
}
export type Character = {
    Name: string;
    Year: string;
    Note: string;
}
class BaseScraper {
    LIMIT_CHARACTERS:number
    EXPECTED_COLUMNS!: ExpectedColumn[];
    BASE_URL: string;
    LIST_URL: string;
    browser:Browser | undefined;
    page: Page | undefined;
    characters: Character[] | undefined;
    rows_raw: any[] | undefined;
    constructor(){
        this.LIMIT_CHARACTERS = 20
        this.EXPECTED_COLUMNS = [
            { label: "Name", index: 0, type: "link" },
            { label: "Year", index: 0, type: null },
            { label: "Note", index: 0, type: null },
        ];
        this.BASE_URL ="https://onepiece.fandom.com";
        this.LIST_URL = this.BASE_URL + "/wiki/List_of_Canon_Characters";
    }
    async extractColumns() {
        let rows_raw: any[] = [];
        const locator = this.page?.locator(`.fandom-table:nth-of-type(1) tbody tr:nth-of-type(-n+${this.LIMIT_CHARACTERS})`);
        const header = this.page?.locator(".fandom-table:nth-of-type(1) thead th");
        const headers = await header?.evaluateAll((elements) => {
            return elements.map((header, index) => ({
                label: header.textContent.trim(),
                index,
            }));
        });
        this.EXPECTED_COLUMNS = this.EXPECTED_COLUMNS.map(({ label, type }) => ({
            label,
            index: headers?.find((col) => col.label === label)?.index,
            type,
        }));
        if(locator) {
            for (const element of await locator.all()) {
                rows_raw.push(element);
            }
        }
        return rows_raw;
    }
    async serializeTable (characters: any[], expected_columns: any[]) {
        for (let y = 0; y < characters.length; y++) {
            const element = characters[y];
            const tds_locator = element.locator("td");
            let character: {} | any = {};
            const tds_refactored = await tds_locator.evaluateAll((tds:any[]) => {
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
                const header = expected_columns[i];
                character[header.label] ??= tds_refactored[header.index]?.text || "";
                if (header.type === "link") {
                    character["link"] ??= tds_refactored[header.index].href;
                }
            }
            characters[y] = character;
        }
        return characters
    }
    async getIndividualInformation(characters:any[]) {
        this.browser = await chromium.launch({  headless: true });
        const context = await this.browser.newContext();
        this.page = await context.newPage();
        for (let i = 0; i < characters.length; i++) {
            console.log('Getting individual information...')
            const character = characters[i];
            await this.page?.goto(character.link, {waitUntil: "domcontentloaded",timeout: 0});
            const images = this.page?.locator("#content aside img");
            const images_evaluated = await images?.evaluateAll((imgs) =>
                imgs.map((img) => img.src),
            );
            const locator_description = this.page?.locator("#content p");
            const p = await locator_description?.evaluateAll((ps) =>
                ps.map((p) => p.textContent),
            );
            character.img = images_evaluated? images_evaluated[0] : '';
            character.description = p ? p[0]: '';
            character.appareance = p ? p[1]: '';
            characters[i] = character
        }
        await this.browser.close()
        return characters
    }
    async buildJson(characters:any) {
        const data = JSON.stringify(characters, null, 2);
        await fs.writeFile("characters.json", data, "utf8");
    }
    async enqueue() {
        this.browser = await chromium.launch({  headless: true });
        const context = await this.browser.newContext();
        this.page = await context.newPage();
        await this.page.goto(this.LIST_URL, { timeout: 0 });
        const rows = await this.extractColumns();
        const characters = await this.serializeTable(rows, this.EXPECTED_COLUMNS)
        await this.browser.close()
        const refactoredCharacters = await this.getIndividualInformation(characters)
        await this.buildJson(refactoredCharacters)
        console.log("Done!")
    }
    async init() {
        const response = {
            msg: "request enqueued, it could take a lot time!"
        }
        if(existsSync(path.resolve(__dirname, 'characters.json'))) {
            response.msg = "the characters already exists!"
        }else {
            this.enqueue();
        }
        return response
    }
}
export default BaseScraper;