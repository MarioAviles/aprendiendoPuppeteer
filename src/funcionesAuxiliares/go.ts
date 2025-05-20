import { Browser } from 'puppeteer';
import {
  openPage,
} from '../funciones';
export interface goToPageProps {
    browser: Browser;
    url: string;
}


export async function goToPage( { browser, url }: goToPageProps) {
            const isOpen = await openPage(browser, url);
    
            if (!isOpen) {
                console.error('No se pudo abrir la página');
                await browser.close();
                return;
            }
            const pages = await browser.pages() // Obtenemos todas las páginas abiertas
            const page = pages[0]; // Obtenemos la primera página abierta
            return page;
}



