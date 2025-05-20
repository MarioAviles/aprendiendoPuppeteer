import puppeteer from 'puppeteer';

import {
  DEFAULT_URL,
  DEFAULT_ARTICLE_SELECTOR,
  DEFAULT_BODY_SELECTOR,
  DEFAULT_COVER_SELECTOR,
  DEFAULT_TITLE_SELECTOR,
  openPage,
  waitForArticles,
  getArticleLink,
  openArticle,
  extractArticleData
} from './funciones';
import { goToPage } from './funcionesAuxiliares/go';



async function main() {

    // [X] Implementar navegador

    const browser = await puppeteer.launch({
        headless: true,
        acceptInsecureCerts: true,
        // ignoreHTTPSErrors: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--ignore-certificate-errors',
            '--ignore-ssl-errors'
        ]
    });

    // [X] Ir a la página

const page = goToPage({
    browser,
    url: DEFAULT_URL
});
    // [ ] Seleccionar los artículos

        

    // [ ] Extraer información de cada artículo
    //     [ ] Extraer título
    //     [ ] Extraer descripción
    //     [ ] Extraer imagen
    //     [ ] Extraer urs



    // Esperar a que cargue el listado de artículos
    await waitForArticles(page, DEFAULT_ARTICLE_SELECTOR); //cambiar a get ready

    // obtemos todos los articulos


    // Obtener el segundo artículo (índice 1)
    const articleElement = await getArticleLink(page, 4, DEFAULT_ARTICLE_SELECTOR);

    if (!articleElement) {
        console.error('No se encontró el artículo solicitado');
        await browser.close();
        return;
    }

    // Abrir el artículo
    await openArticle(page, articleElement);

    // Extraer los datos del artículo
    const data = await extractArticleData(page, {
        bodySelector: DEFAULT_BODY_SELECTOR,
        coverSelector: DEFAULT_COVER_SELECTOR,
        titleSelector: DEFAULT_TITLE_SELECTOR
    });

    console.log('Datos del artículo:', data);

    await browser.close();
}

main();