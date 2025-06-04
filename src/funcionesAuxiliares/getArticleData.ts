import { Page } from 'puppeteer';
import { ArticleData, RepositoryJournal } from '../types'; // Importa las interfaces definidas en types.ts

export async function getArticleData(
    page: Page,
    repository: RepositoryJournal
): Promise<ArticleData> {
    const [portada, titulo, introduccion] = await Promise.all([
        repository.coverExtractor ? repository.coverExtractor(page) : null,
        repository.titleExtractor ? repository.titleExtractor(page) : null,
        repository.introductionExtractor
            ? repository.introductionExtractor(page, repository.bodySelector)
            : null
    ]);
    return {
        portada,
        titulo,
        introduccion,
        url: page.url()
    };
}
