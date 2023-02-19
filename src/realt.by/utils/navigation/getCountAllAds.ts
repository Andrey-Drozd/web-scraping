import { Page } from 'puppeteer'

import { COUNT_ALL_ADS, LOG_PARSING } from '../../constants'
import { COUNT_OF_ALL_ADS } from '../../selectors'
import { logServices } from '../../services'

export const getCountAllAds = async (page: Page) => {
  // количество объявлений по выбранным фильтрам
  const countAllAdsNode = await page.$(COUNT_OF_ALL_ADS)

  const countAllAds = await page.evaluate((countAllAds) => {
    const result = countAllAds?.innerText
    return result ? Number(result) : null
  }, countAllAdsNode)
  logServices.send(COUNT_ALL_ADS, countAllAds)

  // проверка корректности парсинга количества всех объявлений
  if (!countAllAds) throw Error(`${LOG_PARSING}countAllAds is undefined!`)

  return countAllAds
}
