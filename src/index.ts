import puppeteer from 'puppeteer';
import {
  DEFAULT_URL,
  DEFAULT_ARTICLE_SELECTOR,
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

    // [X] Seleccionar los artículos

    const articleLinks: string[] = await page.$$eval(
        DEFAULT_ARTICLE_SELECTOR,
        links => links.map(link => (link as HTMLAnchorElement).href)
    );
    console.log(`Artículos encontrados: ${articleLinks.length}`);

    const resultados: any[] = [];

    // [X] Extraer información de cada artículo

    for (let i = 0; i < articleLinks.length; i++) {
        console.log(`Procesando artículo ${i + 1} de ${articleLinks.length}`);
        await page.goto(articleLinks[i], { waitUntil: 'domcontentloaded' });
        const datos = await extractArticleData(page);
        resultados.push(datos);
    }

    console.log('Datos de todos los artículos:', resultados); //meter en json

    await browser.close();
}

main();
