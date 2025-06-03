import puppeteer from 'puppeteer';
import {
    DEFAULT_ARTICLE_SELECTOR,
    extractArticleData,
    DEFAULT_URL
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

    // Abrir la página principal
    const page = await goToPage({ browser, url: DEFAULT_URL });
    if (!page) {
        console.error('No se pudo abrir la página');
        await browser.close();
        return;
    }

    // Esperar a que los artículos estén disponibles
    await page.waitForSelector(DEFAULT_ARTICLE_SELECTOR);

    // Extraer los href de los artículos
    const articleLinks: string[] = await page.$$eval(
        DEFAULT_ARTICLE_SELECTOR,
        links => links.map(link => (link as HTMLAnchorElement).href)
    );
    console.log(`Artículos encontrados: ${articleLinks.length}`);

    const resultados: any[] = [];

    for (let i = 0; i < articleLinks.length; i++) {
        console.log(`Procesando artículo ${i + 1} de ${articleLinks.length}`);
        await page.goto(articleLinks[i], { waitUntil: 'domcontentloaded', timeout: 60000 });
        const datos = await extractArticleData(page);
        resultados.push(datos);
    }

    console.log('Datos de todos los artículos:', resultados);

    await browser.close();
}

main();
