import { Page } from 'puppeteer'

import { COUNT_ALL_ADS_ON_PAGE, COUNT_PAGES } from '../../constants'
import { AD_ID } from '../../selectors'
import { logServices } from '../../services'

export const getCountPages = async (page: Page, countAllAds: number) => {
  // количество объявлений на странице
  const countAllAdsOnPage = await page.$$(AD_ID)
  logServices.send(COUNT_ALL_ADS_ON_PAGE, countAllAdsOnPage.length)

  // количество страниц парсинга
  const countPages = Math.ceil(countAllAds / countAllAdsOnPage.length)
  logServices.send(COUNT_PAGES, countPages)

  return countPages
}
