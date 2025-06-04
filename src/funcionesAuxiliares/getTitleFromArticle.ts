import { Page } from 'puppeteer';

export async function getTitleFromArticle(page: Page, titleSelector: string): Promise<string | null> {
    return await page.evaluate((TITLE_SELECTOR) => {
        const tituloEl = document.querySelector(TITLE_SELECTOR);
        return tituloEl ? tituloEl.textContent?.trim() ?? null : null;
    }, titleSelector);
}