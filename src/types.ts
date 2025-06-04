import { Page, ElementHandle } from 'puppeteer';

export interface ArticleData {
    portada: string | null;
    titulo: string | null;
    introduccion: string | null;
    url: string;
}
export interface RepositoryJournal {
    url: string;
    bodySelector: string;
    coverSelector: string;
    titleSelector: string;
    articleSelector: string;
    // customExtractor?: (body: Element) => string | null;
    titleExtractor?: (page: Page) => Promise<string | null>;
    coverExtractor?: (page: Page) => Promise<string | null>;
    introductionExtractor?: (
        page: Page,
        bodySelector?: string,
    ) => Promise<string | null>;
    getArticlesLinks?: (page: Page, selector?: string) => Promise<ElementHandle<Element>[]>;
}