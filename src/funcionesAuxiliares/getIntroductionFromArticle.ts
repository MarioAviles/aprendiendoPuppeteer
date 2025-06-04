import { Page } from 'puppeteer';

export async function getIntroductionFromArticle(
    page: Page,
    bodySelector: string,
    customExtractor?: (body: Element) => string | null
): Promise<string | null> {
    return await page.evaluate(
        (BODY_SELECTOR, customExtractorStr) => {
            const body = document.querySelector(BODY_SELECTOR);
            if (!body) return null;
            if (customExtractorStr) {
                // Evalúa la función personalizada en el contexto del navegador
                const extractor = eval(customExtractorStr);
                return extractor(body);
            }
            // Lógica por defecto (primer h2/h3 hasta el siguiente)
            const children = Array.from(body.children);
            const firstSectionTitleIdx = children.findIndex(child =>
                /^H[23]$/.test(child.tagName)
            );
            if (firstSectionTitleIdx === -1) return null;
            let endIdx = children.length;
            for (let i = firstSectionTitleIdx + 1; i < children.length; i++) {
                if (/^H[23]$/.test(children[i].tagName) || children[i].tagName === 'HR') {
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
            return section.length > 0 ? section.join('\n\n') : null;
        },
        bodySelector,
        customExtractor ? customExtractor.toString() : null
    );
}