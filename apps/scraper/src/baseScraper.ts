import { test, expect, chromium, Page, Browser } from "@playwright/test";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
type SpectedColumn = {
    label: string;
    index: number;
    type: string | null;
}
class baseScraper {
    EXPECTED_COLUMNS!: SpectedColumn[];
    BASE_URL: string;
    LIST_URL: string;
    browser:Browser;
    page: Page;
    constructor(){
        this.EXPECTED_COLUMNS = [
	        { label: "Name", index: 0, type: "link" },
	        { label: "Year", index: 0, type: null },
	        { label: "Note", index: 0, type: null },
        ];
        this.BASE_URL ="https://onepiece.fandom.com";
        this.LIST_URL = this.BASE_URL + "/wiki/List_of_Canon_Characters";
        this.browser = await chromium.launch({
            executablePath:
            "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
        });
        const context = await this.browser.newContext();
        this.page = await context.newPage();
    }
    async init() {

    }
}