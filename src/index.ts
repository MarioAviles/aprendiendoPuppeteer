import puppeteer from 'puppeteer';
import {
    getArticleData
} from './funcionesAuxiliares/getArticleData';
import { goToPage } from './funcionesAuxiliares/goToPage';
import { repositoryDevTo } from './repositories';

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
    const page = await goToPage({ browser, url: repositoryDevTo.url });
    if (!page) {
        console.error('No se pudo abrir la página');
        await browser.close();
        return;
    }

    // Esperar a que los artículos estén disponibles
    await page.waitForSelector(repositoryDevTo.articleSelector);

    // Extraer los href de los artículos
    const articleLinks: string[] = await page.$$eval(
        repositoryDevTo.articleSelector,
        links => links.map(link => (link as HTMLAnchorElement).href)
    );
    console.log(`Artículos encontrados: ${articleLinks.length}`);

    const resultados: any[] = [];

    for (let i = 0; i < articleLinks.length; i++) {
        console.log(`Procesando artículo ${i + 1} de ${articleLinks.length}`);
        await page.goto(articleLinks[i], { waitUntil: 'domcontentloaded', timeout: 60000 });
        const datos = await getArticleData(page, repositoryDevTo);
        resultados.push(datos);
    }

    console.log('Datos de todos los artículos:', resultados);

    await browser.close();
}

main();
