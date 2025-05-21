import puppeteer, { Browser, Page } from 'puppeteer';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { goToPage } from './funcionesAuxiliares/goToPage';
import { extractArticlesData } from './funciones';

describe('extractArticlesData', () => {
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

    it('devuelve true si hay información de al menos un artículo', async () => {
        const articles = await extractArticlesData(page);
        expect(articles.length > 0).toBe(true);
    }, 30000); // 30 segundos
});