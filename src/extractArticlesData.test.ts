import puppeteer, { Browser, Page } from 'puppeteer';
import { goToPage } from './funcionesAuxiliares/goToPage';
import { extractArticleData, getArticlesLinks, openArticle, DEFAULT_URL, DEFAULT_ARTICLE_SELECTOR } from './funciones';

describe('extractArticleData en flujo real con página remota', () => {
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
        page = await goToPage({ browser, url: DEFAULT_URL }) as Page;
    });

    afterAll(async () => {
        await browser.close();
    });

    it('extrae datos reales del primer artículo', async () => {
        const articles = await getArticlesLinks(page, DEFAULT_ARTICLE_SELECTOR);
        expect(articles.length).toBeGreaterThan(0);

        await openArticle(page, articles[0]);
        const datos = await extractArticleData(page);

        expect(datos.titulo).toBeTruthy();
        expect(datos.introduccion).toBeTruthy();
        // La portada puede no existir en todos los artículos, así que solo comprobamos que la propiedad existe
        expect(datos).toHaveProperty('portada');
        expect(datos).toHaveProperty('url');
        console.log('Datos reales extraídos:', datos);
    });
});