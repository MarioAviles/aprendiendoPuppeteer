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



export async function main() {
    const browser = await puppeteer.launch({
        headless: true,
        slowMo: 100,
        acceptInsecureCerts: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--ignore-certificate-errors',
            '--ignore-ssl-errors'
        ]
    });

//   [ ] Ir a la página

    const page = await goToPage({
        browser,
        url: DEFAULT_URL
    });

    if (!page) {
        console.error('No se pudo abrir la página');
        await browser.close();
        return;
    }

//   [ ] Seleccionar los artículos

    // Si existe, continúa normalmente
    const articleElements = await getArticlesLinks(page, DEFAULT_ARTICLE_SELECTOR);
    console.log(`Artículos encontrados: ${articleElements.length}`);

    // for (let i = 0; i < articleElements.length; i++) {
    //     const el = articleElements[i];
    //     const titulo = await el.evaluate(a => a.textContent?.trim());
    //     const href = await el.evaluate(a => (a as HTMLAnchorElement).href);
    //     console.log(`Artículo ${i + 1}: ${titulo} (${href})`);
    // }

    // await browser.close();

    
}

main();
