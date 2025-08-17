import { test, expect, chromium } from '@playwright/test';
import fs from "node:fs/promises";
import { existsSync } from 'node:fs';
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
  testInfo.setTimeout(0)
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
  testInfo.setTimeout(0)
  const locator = page.locator('.fandom-table:nth-of-type(1) tbody tr:nth-of-type(-n+4)')
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
     characters.push(element)      
  }
})
test('serializing main table', async({},testInfo) => {
  testInfo.setTimeout(0) 
  for (let y = 0; y < characters.length; y++) {
    const element = characters[y];
    const tds_locator = element.locator('td')
    let character = {}  
    const tds_refactored = await tds_locator.evaluateAll(tds =>{
      return tds.map(td=> {
        const column = {href: '', text: ''}
        if(Object.keys(td.childNodes).length > 1){
          column.href = td.childNodes['0'].href
        }
        column.text = td.textContent
        return column
      })
    })
    for (let i = 0; i < expected_columns.length; i++) {
      const header = expected_columns[i];
      character[header.label] ??= tds_refactored[header.index]?.text || ''
      if(header.type === 'link') {
        character['link'] ??= tds_refactored[header.index].href
      }
    }
    characters[y]= character
  }
})
 /**
  * This part of the scaper count with an individual DOM structure 
  * |   <aside/>
  *       | <img/> --> character's image
  *     <p/>
  *       |--description
  *       |--appareance 
  * 
  */
test('Getting individual information', async({},testInfo) => {
  testInfo.setTimeout(0)
  for (let i = 0; i < 4; i++) {
    const character = characters[i];
    await page.goto(character.link);
    const images = page.locator('#content aside img')
    const images_evaluated = await images.evaluateAll(imgs=>imgs.map(img => img.src))
    const locator_description = page.locator('#content p')
    const p = await locator_description.evaluateAll(ps=>ps.map(p=>p.textContent))
    character.img = images_evaluated[0]
    character.description = p[0]
    character.appareance = p[1]  
  }
  console.log(characters.length)
})
test('Generating Json', async({}, testInfo)=>{
  const data = JSON.stringify(characters,null,2)
  await fs.writeFile('characters.json', data, 'utf8')
  expect(existsSync('characters.json')).toBeTruthy()
})