import { test, expect, chromium } from '@playwright/test';
const expected_columns = [ 
  've',
  'Name',
  'Chapter',
  'Episode',
  'Year',
  'Note'
]
let browser:any, page:any;
test.beforeAll(async ({}, testInfo) => {
  testInfo.setTimeout(60000)
  browser = await chromium.launch({
    executablePath: "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe"
  })
  const context = await browser.newContext();
  page = await context.newPage()
  await page.goto('https://onepiece.fandom.com/wiki/List_of_Canon_Characters');
});
test('has title', async () => {
  await expect(page).toHaveTitle(/List of Canon Characters/);
});
test('has table with columns', async() => {
  const locator = page.locator('.fandom-table:nth-of-type(1) thead th')
  const columns = locator.map(header => header.textContent.trim() )
  console.log(columns)
  // const columns = await page.$$eval('.fandom-table:nth-of-type(1) thead th', ths =>
  //   ths.map(th => th.textContent.trim())
  // );
  // for (const col of expected_columns) {
  //   expect(columns).toContain(col);
  // }
})
// test('extract columns', async() => {
//   const headers = await page.$$eval(
//     '.fandom-table:nth-of-type(1) thead th',
//     ths => ths.map(th => th.textContent.trim())
//   );
//   // for (let i = 0; i < expected_columns.length; i++) {
//     // const element = expected_columns[i];
//     const element = expected_columns[1];
//     const indexHeader = headers.indexOf(element);
//     const datosNombre = await page.$$eval(
//       `.fandom-table:nth-of-type(1) tbody tr td:nth-child(${indexHeader + 1})`,
//       tds => tds.map(td => ({name: td.textContent.trim(), link: td.child('a')}))
//     );
//     console.log('Datos de la columna Nombre:', datosNombre);
//   // }
// })
// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
