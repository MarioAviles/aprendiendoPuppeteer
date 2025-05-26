import { Page, ElementHandle } from 'puppeteer';

// Constantes configurables y reutilizables
export const DEFAULT_URL = 'https://dev.to/t/programming';
export const DEFAULT_ARTICLE_SELECTOR = '.crayons-story__body h2.crayons-story__title > a';
export const DEFAULT_BODY_SELECTOR = '.crayons-article__body';
export const DEFAULT_COVER_SELECTOR = 'header.crayons-article__header a.crayons-article__cover img';
export const DEFAULT_TITLE_SELECTOR = 'h1';

// Tipos para extracción modular
export interface ArticleFieldExtractor {
    selector?: string;
    extractor?: (el: Element | null) => any;
}

export interface ArticleExtractConfig {
    portada?: ArticleFieldExtractor;
    titulo?: ArticleFieldExtractor;
    introduccion?: ArticleFieldExtractor;
    [key: string]: ArticleFieldExtractor | undefined;
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

/**
 * Extrae los datos de un artículo según la configuración modular.
 */
export async function extractArticleData(
    page: Page,
): Promise<Record<string, any>> {
    // Pasa las constantes como parámetros a page.evaluate
    return await page.evaluate(
        (BODY_SELECTOR, COVER_SELECTOR, TITLE_SELECTOR) => {
            // Portada
            let portada = '';
            const portadaEl = document.querySelector(COVER_SELECTOR);
            if (portadaEl && (portadaEl as HTMLImageElement).src) {
                portada = (portadaEl as HTMLImageElement).src;
            }

            // Título
            const tituloEl = document.querySelector(TITLE_SELECTOR);
            const titulo = tituloEl ? tituloEl.textContent?.trim() : null; //hacer como en portada

            // Introducción
            const body = document.querySelector(BODY_SELECTOR);
            let introduccion = null;
            if (body) {
                const children = Array.from(body.children);
                const firstSectionTitleIdx = children.findIndex(child =>
                    /^H[23]$/.test(child.tagName)
                );
                if (firstSectionTitleIdx !== -1) {
                    let endIdx = children.length;
                    for (let i = firstSectionTitleIdx + 1; i < children.length; i++) {
                        if (/^H[23]$/.test(children[i].tagName) || children[i].tagName === 'HR') { // mirar sobre RegExp
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
                    introduccion = section.length > 0 ? section.join('\n\n') : null;
                }
            }

            return {
                portada,
                titulo,
                introduccion,
                url: window.location.href
            };
        },
        DEFAULT_BODY_SELECTOR,
        DEFAULT_COVER_SELECTOR,
        DEFAULT_TITLE_SELECTOR
    );
}