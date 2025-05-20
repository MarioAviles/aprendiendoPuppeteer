import puppeteer from 'puppeteer';

import {
  DEFAULT_URL,
  DEFAULT_ARTICLE_SELECTOR,
  DEFAULT_BODY_SELECTOR,
  DEFAULT_COVER_SELECTOR,
  DEFAULT_TITLE_SELECTOR,
  waitForArticles,
  getArticlesLinks,
  openArticle,
  extractArticleData
} from './funciones';
import { goToPage } from './funcionesAuxiliares/goToPage';



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

    const page = await goToPage({
        browser,
        url: DEFAULT_URL
    });

    if (!page) {
        console.error('No se pudo abrir la página');
        await browser.close();
        return;
    }

    // [ ] Seleccionar los artículos
        
    const articleElement = await getArticlesLinks(page, DEFAULT_ARTICLE_SELECTOR);

    if (!articleElement) {
        console.error('No se encontró el artículo solicitado');
        await browser.close();
        return;
    }
    
    // [ ] Extraer información de cada artículo
    //     [ ] Extraer título
    //     [ ] Extraer descripción
    //     [ ] Extraer imagen
    //     [ ] Extraer urs



    // Esperar a que cargue el listado de artículos

    // obtemos todos los articulos
}

main();