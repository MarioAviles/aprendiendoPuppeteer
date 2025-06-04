import { Page } from 'puppeteer';

export async function getCoverFromArticle(page: Page, coverSelector: string): Promise<string | null> {
    return await page.evaluate((COVER_SELECTOR) => {
        const portadaEl = document.querySelector(COVER_SELECTOR);
        return portadaEl && (portadaEl as HTMLImageElement).src ? (portadaEl as HTMLImageElement).src : null;
    }, coverSelector);
}