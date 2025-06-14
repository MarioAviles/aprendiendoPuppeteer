import puppeteer, { Browser, Page } from 'puppeteer';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { goToPage } from './goToPage';

describe('Apertura de página', () => {
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

    it('debe abrir la página y tener un título', async () => {
        const title = await page.title();
        expect(title.length).toBeGreaterThan(0);
    });
});