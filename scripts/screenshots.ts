/**
 * Generates the README screenshots (docs/screenshots/*.png).
 *
 * Requires a running dev server (`npm run dev`) and a local Chrome or Edge.
 * Usage: npm run screenshots [-- http://localhost:9000]
 */
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import type { Browser, BrowserContextOptions, Page } from 'playwright-core';

const baseUrl = process.argv[2] ?? process.env.APP_URL ?? 'http://localhost:9000';
const outDir = new URL('../docs/screenshots/', import.meta.url);

const todos = [
  { title: 'Préparer la démo Quasar + PouchDB', done: false },
  { title: 'Ajouter le mode hors ligne (PWA)', done: false },
  { title: 'Configurer la réplication avec CouchDB', done: true },
  { title: 'Écrire les tests du repository', done: true },
  { title: 'Acheter du café ☕', done: false },
];

async function launchBrowser(): Promise<Browser> {
  for (const channel of ['chrome', 'msedge']) {
    try {
      return await chromium.launch({ channel });
    } catch {
      // try the next installed browser
    }
  }
  throw new Error('Chrome or Edge must be installed to take the screenshots.');
}

/** Fills a fresh (empty) database through the UI. */
async function seed(page: Page): Promise<void> {
  const input = page.getByLabel('Nouvelle tâche');
  for (const todo of [...todos].reverse()) {
    await input.fill(todo.title);
    await input.press('Enter');
    await page.getByText(todo.title).waitFor();
  }
  for (const todo of todos.filter((t) => t.done)) {
    await page.locator('.q-item', { hasText: todo.title }).getByRole('checkbox').click();
  }
  await page.locator('.todo-item__title--done').nth(1).waitFor();
}

async function shoot(
  browser: Browser,
  name: string,
  options: BrowserContextOptions,
  scenario?: (page: Page) => Promise<void>,
): Promise<void> {
  const context = await browser.newContext({ deviceScaleFactor: 2, ...options });
  const page = await context.newPage();
  await page.goto(baseUrl);
  await seed(page);
  await scenario?.(page);
  // drop hover/focus highlights, then let transitions (ripples, notifications) settle
  await page.mouse.move(0, 0);
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.waitForTimeout(500);

  // On desktop, crop the empty space below the todo card
  const viewport = page.viewportSize();
  const content = options.isMobile ? null : await page.locator('.todo-page').boundingBox();
  const clip =
    viewport && content
      ? {
          x: 0,
          y: 0,
          width: viewport.width,
          height: Math.min(viewport.height, content.y + content.height + 24),
        }
      : undefined;

  await page.screenshot({
    path: fileURLToPath(new URL(`${name}.png`, outDir)),
    ...(clip ? { clip } : {}),
  });
  await context.close();
  console.log(`✔ docs/screenshots/${name}.png`);
}

const desktop = { viewport: { width: 1024, height: 640 } };
const mobile = { viewport: { width: 390, height: 760 }, isMobile: true, hasTouch: true };

await mkdir(outDir, { recursive: true });
const browser = await launchBrowser();
try {
  await shoot(browser, 'desktop-light', { ...desktop, colorScheme: 'light' });
  await shoot(browser, 'desktop-dark', { ...desktop, colorScheme: 'dark' });
  await shoot(browser, 'search', { ...desktop, colorScheme: 'light' }, async (page) => {
    await page.getByLabel('Rechercher').fill('quasar');
    await page.getByText('1 résultat').waitFor();
  });
  await shoot(browser, 'mobile', { ...mobile, colorScheme: 'light' });
  await shoot(browser, 'mobile-undo', { ...mobile, colorScheme: 'dark' }, async (page) => {
    await page
      .locator('.q-item', { hasText: 'Acheter du café' })
      .getByRole('button', { name: 'Supprimer' })
      .click();
    await page.getByRole('button', { name: 'Annuler' }).waitFor();
  });
} finally {
  await browser.close();
}
