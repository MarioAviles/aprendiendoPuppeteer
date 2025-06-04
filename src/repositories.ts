import { Page } from 'puppeteer';
import { getTitleFromArticle } from './funcionesAuxiliares/getTitleFromArticle';
import { getCoverFromArticle } from './funcionesAuxiliares/getCoverFromArticle';
import { getIntroductionFromArticle } from './funcionesAuxiliares/getIntroductionFromArticle';
import { RepositoryJournal } from './types'; // Importa las interfaces definidas en types.ts

export const repositoryDevTo: RepositoryJournal = { //lo exporto para usarlo en index
    url: 'https://dev.to/t/programming',
    bodySelector: '.crayons-article__body',
    coverSelector: 'header.crayons-article__header a.crayons-article__cover img',
    titleSelector: 'h1',
    articleSelector: '.crayons-story__body h2.crayons-story__title > a',
    titleExtractor: async (page: Page) => getTitleFromArticle(page, repositoryDevTo.titleSelector),
    coverExtractor: async (page: Page) => getCoverFromArticle(page, repositoryDevTo.coverSelector),
    introductionExtractor: async (page: Page, bodySelector = repositoryDevTo.bodySelector) => getIntroductionFromArticle(page, bodySelector)
}

export const repositoryElPais: RepositoryJournal = { //lo exporto para usarlo en index
    url: 'https://elpais.com/tecnologia',
    bodySelector: 'div.a_styled, div.article_body, .a_c',
    coverSelector: 'figure img',
    titleSelector: 'h1',
    articleSelector: 'article h2 a',
    titleExtractor: async (page: Page) => getTitleFromArticle(page, repositoryElPais.titleSelector),
    coverExtractor: async (page: Page) => getCoverFromArticle(page, repositoryElPais.coverSelector),
    introductionExtractor: async (page: Page, bodySelector = repositoryElPais.bodySelector) => getIntroductionFromArticle(page, bodySelector)
}