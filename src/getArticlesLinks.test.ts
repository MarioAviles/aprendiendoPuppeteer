import puppeteer, { Browser, Page } from 'puppeteer';
import { getArticlesLinks, DEFAULT_ARTICLE_SELECTOR } from './funciones';
import { goToPage } from './funcionesAuxiliares/goToPage';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('getArticlesLinks', () => {
    let browser: Browser;
    let page: Page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--ignore-certificate-errors',
                '--ignore-ssl-errors'
            ]
        });
        const result = await goToPage({
            browser,
            url: 'https://dev.to/t/programming'
        });
        if (!result) {
            throw new Error('No se pudo abrir la página');
        }
        page = result;
    });

    afterAll(async () => {
        await browser.close();
    });

    it('debe devolver un array (aunque esté vacío) de elementos', async () => {
        const articles = await getArticlesLinks(page, DEFAULT_ARTICLE_SELECTOR);
        expect(Array.isArray(articles)).toBe(true);

        for (const article of articles) {
            const titulo = await article.evaluate(a => a.textContent?.trim());
            const href = await article.evaluate(a => (a as HTMLAnchorElement).href);
            console.log({ titulo, href });
        }
    });
});