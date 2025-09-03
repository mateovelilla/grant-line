import type { Browser, Page, Locator } from "playwright";
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
export type ImageHtml = {
    src: string;
};
declare class BaseScraper {
    CHARACTERS_LIMIT: number;
    EXPECTED_COLUMNS: ExpectedColumn[];
    BASE_URL: string;
    LIST_URL: string;
    PATH_CHARACTERS: string;
    browser: Browser | undefined;
    page: Page | undefined;
    characters: Character[] | undefined;
    constructor({ characters_limit, expected_columns, base_url, list_url, path_characters, }: {
        characters_limit: number;
        expected_columns: ExpectedColumn[];
        base_url: string;
        list_url: string;
        path_characters: string;
    });
    extractColumns(): Promise<Locator[]>;
    serializeTable(characters: Locator[], expected_columns: ExpectedColumn[]): Promise<{
        [key: string]: any;
    }[]>;
    getIndividualInformation(characters: {
        [key: string]: any;
    }[]): Promise<Character[]>;
    buildJson(characters: Character[]): Promise<void>;
    enqueue(): Promise<void>;
    init(): Promise<{
        msg: string;
    }>;
}
export default BaseScraper;
