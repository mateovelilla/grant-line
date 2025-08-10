import { test, expect, chromium } from '@playwright/test';
let expected_columns = [
  { label: 'Name', index: 0, type: 'link'},
  { label: 'Year', index: 0, type: null},
  { label: 'Note', index: 0, type: null},
]
const BASE_URL = "https://onepiece.fandom.com"
const LIST_URL = BASE_URL + '/wiki/List_of_Canon_Characters'
let characters:any[] = []
let browser:any, page:any;
test.beforeAll(async ({}, testInfo) => {
  testInfo.setTimeout(80000)
  browser = await chromium.launch({
    executablePath: "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe"
  })
  const context = await browser.newContext();
  page = await context.newPage()
  await page.goto(LIST_URL);
});
test('has title', async () => {
  await expect(page).toHaveTitle(/List of Canon Characters/);
});
test('has table with columns', async() => {
  const locator = page.locator('.fandom-table:nth-of-type(1) thead th')
  const columns = await locator.evaluateAll(elements => {
    return elements.map(header => header.textContent.trim())
  })
  for (const col of expected_columns) {
    expect(columns).toContain(col.label);
  }
})
test('extract columns', async({},testInfo) => {
  testInfo.setTimeout(80000)
  const locator = page.locator('.fandom-table:nth-of-type(1) tbody tr:nth-child(-n+40)')
  const header = page.locator('.fandom-table:nth-of-type(1) thead th')
  const headers = await header.evaluateAll(elements => {
    return elements
      .map((header, index) => ({
        label: header.textContent.trim(),
        index
      }))
  })
  expected_columns = expected_columns.map(({label, type})=>({
    label,
    index: headers.find(col=> col.label === label ).index,
    type
  }))
  for (const element of await locator.all()) {
    try {
      let character = {}
      for (let i = 0; i < expected_columns.length; i++) {
        const header = expected_columns[i];
        character[header.label] = await element.locator(`td:nth-child(${header.index + 1})`).textContent()
        if(header.type === 'link') {
          const url = await element.locator(`td:nth-child(${header.index + 1}) > a`).getAttribute('href')
          character['link'] = BASE_URL + url
        } 
      }
      characters.push(character)
    } catch (error) {
      console.log(element)
      console.log(error)
    }
  }
})