import{ Page, ElementHandle } from 'puppeteer';

// Constantes configurables y reutilizables
export const DEFAULT_URL = 'https://dev.to/t/programming';
export const DEFAULT_ARTICLE_SELECTOR = '.crayons-story__body h2.crayons-story__title > a';
export const DEFAULT_BODY_SELECTOR = '.crayons-article__body';
export const DEFAULT_COVER_SELECTOR = 'header.crayons-article__header a.crayons-article__cover img';
export const DEFAULT_TITLE_SELECTOR = 'h1';


/**
 * Espera a que cargue el listado de artículos.
 */
export async function waitForArticles(
    page: Page, //aqui me da el error porque el page que devuelve openPage no es del tipo Page
    selector: string = DEFAULT_ARTICLE_SELECTOR,
): Promise<void> {
    await page.waitForSelector(selector);
}
debugger

/**
 * Devuelve el enlace al artículo por índice (0 = primero, 1 = segundo, etc).
 */
export async function getArticlesLinks(
    page: Page,
    selector: string = DEFAULT_ARTICLE_SELECTOR,
): Promise<ElementHandle<Element>[]> {
        // Sacamos por consola el contenido de la página
    // console.log(await page.content())
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

export async function extractArticlesData(
    page: Page,
    selector: string = DEFAULT_ARTICLE_SELECTOR
): Promise<ArticleData[]> {
    const articles = await getArticlesLinks(page, selector);
    const articleDataArray: ArticleData[] = [];

    for (const articleElement of articles) {
        await openArticle(page, articleElement);
        const articleData = await extractArticleData(page);
        articleDataArray.push(articleData);
        await page.goBack();
    }

    return articleDataArray;
}

/**
 * Extrae los datos del artículo abierto.
 * Todos los selectores son argumentos para máxima flexibilidad.
 */
export interface ArticleData {
    portada: string | null;
    titulo: string | null;
    introduccion: string | null;
    url: string;
}
// [ ] Cambiar a un tipo de dato más específico
export async function extractArticleData(
    page: Page,
    {
        bodySelector = DEFAULT_BODY_SELECTOR,
        coverSelector = DEFAULT_COVER_SELECTOR,
        titleSelector = DEFAULT_TITLE_SELECTOR
    }: {
        bodySelector?: string;
        coverSelector?: string;
        titleSelector?: string;
    } = {}
): Promise<ArticleData> {
    return await page.evaluate(({ bodySelector, coverSelector, titleSelector }) => {
        // Imagen de portada
        let img = document.querySelector(coverSelector);
        let portada = img ? (img as HTMLImageElement).src : null;

        // Título
        let tituloEl = document.querySelector(titleSelector);
        let titulo = tituloEl ? tituloEl.textContent?.trim() ?? null : null;

        // Introducción robusta y flexible
        let introduccion = null;
        const body = document.querySelector(bodySelector);
        if (body) {
            let introParagraphs: string[] = [];
            // 1. Busca el primer h2 que NO sea "Table of Contents"
            let h2s = Array.from(body.querySelectorAll('h2'));
            let introH2 = h2s.find(h2 => !/table of contents/i.test(h2.textContent?.trim() ?? ''));

            if (introH2) {
                // Toma todos los <p> entre ese h2 y el siguiente h2/h3
                let next = introH2.nextElementSibling;
                while (next && !/^H[23]$/.test(next.tagName)) {
                    if (next.tagName === 'P') {
                        introParagraphs.push(next.textContent?.trim() ?? '');
                    }
                    next = next.nextElementSibling;
                }
            }

            // 2. Si no hay h2 relevante o no hay párrafos tras el h2, toma los <p> iniciales antes del primer h2/h3
            if (introParagraphs.length === 0) {
                let children = Array.from(body.children);
                for (let el of children) {
                    if (/^H[23]$/.test(el.tagName)) break;
                    if (el.tagName === 'P') {
                        introParagraphs.push(el.textContent?.trim() ?? '');
                    }
                }
            }

            introduccion = introParagraphs.length > 0 ? introParagraphs.join('\n\n') : null;
        }

        // URL actual
        let url = window.location.href;

        return {
            portada,
            titulo,
            introduccion,
            url
        };
    }, { bodySelector, coverSelector, titleSelector });
}