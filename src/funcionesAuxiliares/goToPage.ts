import { Browser, Page } from 'puppeteer';

export interface goToPageProps {
    browser: Browser;
    url: string;
}

export async function goToPage({ browser, url }: goToPageProps): Promise<Page | null> {
    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: 'networkidle0' });
        return page;
    } catch {
        browser.close();
        return null;
    }
}


