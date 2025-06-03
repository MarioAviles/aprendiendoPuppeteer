import { Page, ElementHandle } from 'puppeteer';

// Interfaz común para los datos de un artículo
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
    extractorTitulo?: (page: Page) => Promise<string | null>;
    extractorPortada?: (page: Page) => Promise<string | null>;
    extractorIntroduccion?: (
        page: Page,
        bodySelector?: string,
    ) => Promise<string | null>;
    getArticlesLinks?: (page: Page, selector?: string) => Promise<ElementHandle<Element>[]>;
}

// Repositorio de dev.to
// export const DEFAULT_BODY_SELECTOR = '.crayons-article__body';
// export const DEFAULT_COVER_SELECTOR = 'header.crayons-article__header a.crayons-article__cover img';
// export const DEFAULT_TITLE_SELECTOR = 'h1';
// export const DEFAULT_ARTICLE_SELECTOR = '.crayons-story__body h2.crayons-story__title > a';
// export const DEFAULT_URL = 'https://dev.to/t/programming';

const repositoryDevTo: RepositoryJournal = {
    url: 'https://dev.to/t/programming',
    bodySelector: '.crayons-article__body',
    coverSelector: 'header.crayons-article__header a.crayons-article__cover img',
    titleSelector: 'h1',
    articleSelector: '.crayons-story__body h2.crayons-story__title > a',
    extractorTitulo: async (page: Page) => {
        return await page.evaluate((TITLE_SELECTOR) => {
            const tituloEl = document.querySelector(TITLE_SELECTOR);
            return tituloEl ? tituloEl.textContent?.trim() ?? null : null;
        }, repositoryDevTo.titleSelector);
    },
    extractorPortada: async (page: Page) => {
        return await page.evaluate((COVER_SELECTOR) => {
            const portadaEl = document.querySelector(COVER_SELECTOR);
            return portadaEl && (portadaEl as HTMLImageElement).src ? (portadaEl as HTMLImageElement).src : null;
        }, repositoryDevTo.coverSelector);
    },
    extractorIntroduccion: async (page: Page, bodySelector = repositoryDevTo.bodySelector) => {
        return await page.evaluate((BODY_SELECTOR) => {
            const body = document.querySelector(BODY_SELECTOR);
            if (!body) return null;
            // Lógica por defecto (primer h2/h3 hasta el siguiente)
            const children = Array.from(body.children);
            const firstSectionTitleIdx = children.findIndex(child =>
                /^H[23]$/.test(child.tagName)
            );
            if (firstSectionTitleIdx === -1) return null;
            let endIdx = children.length;
            for (let i = firstSectionTitleIdx + 1; i < children.length; i++) {
                if (/^H[23]$/.test(children[i].tagName) || children[i].tagName === 'HR') {
                    endIdx = i;
                    break;
                }
            }
            let section: string[] = [];
            for (let i = firstSectionTitleIdx + 1; i < endIdx; i++) {
                const node = children[i];
                if (node.tagName === 'P') {
                    const text = node.textContent?.trim();
                    if (text) section.push(text);
                } else if (node.tagName === 'IMG') {
                    if ((node as HTMLImageElement).src) section.push((node as HTMLImageElement).src);
                }
            }
            return section.length > 0 ? section.join('\n\n') : null;
        }, bodySelector);
    },
    getArticlesLinks: async (page: Page, selector = repositoryDevTo.articleSelector) => {
        await page.waitForSelector(selector);
        const articles = await page.$$(selector);
        return articles; // Devuelve siempre un array (vacío si no hay artículos)
    }
};

// Repositorio de el pais
export const DEFAULT_BODY_SELECTOR = 'div.a_styled, div.article_body, .a_c';
export const DEFAULT_COVER_SELECTOR = 'figure img';
export const DEFAULT_TITLE_SELECTOR = 'h1';
export const DEFAULT_ARTICLE_SELECTOR = 'article h2 a';
export const DEFAULT_URL = 'https://elpais.com/tecnologia';

// Función para extraer la portada
export async function extractPortada(page: Page): Promise<string | null> {
    return await page.evaluate((COVER_SELECTOR) => {
        const portadaEl = document.querySelector(COVER_SELECTOR);
        return portadaEl && (portadaEl as HTMLImageElement).src ? (portadaEl as HTMLImageElement).src : null;
    }, DEFAULT_COVER_SELECTOR);
}

// Función para extraer el título
export async function extractTitulo(page: Page): Promise<string | null> {
    return await page.evaluate((TITLE_SELECTOR) => {
        const tituloEl = document.querySelector(TITLE_SELECTOR);
        return tituloEl ? tituloEl.textContent?.trim() ?? null : null;
    }, DEFAULT_TITLE_SELECTOR);
}

/**
 * Extrae la introducción de un artículo, permitiendo personalizar el selector del cuerpo.
 * @param page Instancia de Puppeteer Page
 * @param bodySelector Selector CSS del cuerpo del artículo (opcional, por defecto usa DEFAULT_BODY_SELECTOR)
 * @param customExtractor Función personalizada para extraer la introducción (opcional)
 * @returns Texto e imágenes de la primera sección del artículo
 */
export async function extractIntroduccion(
    page: Page,
    bodySelector: string = DEFAULT_BODY_SELECTOR,
    customExtractor?: (body: Element) => string | null
): Promise<string | null> {
    return await page.evaluate(
        (BODY_SELECTOR, customExtractorStr) => {
            const body = document.querySelector(BODY_SELECTOR);
            if (!body) return null;
            if (customExtractorStr) {
                // Evalúa la función personalizada en el contexto del navegador
                const extractor = eval(customExtractorStr);
                return extractor(body);
            }
            // Lógica por defecto (primer h2/h3 hasta el siguiente)
            const children = Array.from(body.children);
            const firstSectionTitleIdx = children.findIndex(child =>
                /^H[23]$/.test(child.tagName)
            );
            if (firstSectionTitleIdx === -1) return null;
            let endIdx = children.length;
            for (let i = firstSectionTitleIdx + 1; i < children.length; i++) {
                if (/^H[23]$/.test(children[i].tagName) || children[i].tagName === 'HR') {
                    endIdx = i;
                    break;
                }
            }
            let section: string[] = [];
            for (let i = firstSectionTitleIdx + 1; i < endIdx; i++) {
                const node = children[i];
                if (node.tagName === 'P') {
                    const text = node.textContent?.trim();
                    if (text) section.push(text);
                } else if (node.tagName === 'IMG') {
                    if ((node as HTMLImageElement).src) section.push((node as HTMLImageElement).src);
                }
            }
            return section.length > 0 ? section.join('\n\n') : null;
        },
        bodySelector,
        customExtractor ? customExtractor.toString() : null
    );
}

// Función principal que usa las anteriores y devuelve el objeto tipado
export async function extractArticleData(page: Page): Promise<ArticleData> {
    const [portada, titulo, introduccion] = await Promise.all([
        extractPortada(page),
        extractTitulo(page),
        extractIntroduccion(page)
    ]);
    return {
        portada,
        titulo,
        introduccion,
        url: page.url()
    };
}

/**
 * Espera a que cargue el listado de artículos.
 */
export async function waitForArticles(
    page: Page,
    selector: string = DEFAULT_ARTICLE_SELECTOR,
): Promise<void> {
    await page.waitForSelector(selector);
}

/**
 * Devuelve el enlace al artículo por índice (0 = primero, 1 = segundo, etc).
 */
export async function getArticlesLinks(
    page: Page,
    selector: string = DEFAULT_ARTICLE_SELECTOR,
): Promise<ElementHandle<Element>[]> {
    await waitForArticles(page, selector);
    const articles = await page.$$(selector);
    return articles; // Devuelve siempre un array (vacío si no hay artículos)
}

/**
 * Hace clic en el enlace del artículo y espera la navegación.
 */
export async function openArticle(
    page: Page,
    articleElement: ElementHandle<Element>
): Promise<void> {
    await articleElement.click();
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
}