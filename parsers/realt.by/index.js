import { init } from '../init.js'
import { curryEvaluate } from './utils/index.js'

import {
  AD,
  AD_FLOOR,
  AD_ID,
  AD_PRICE,
  AD_ROOMS,
  AD_SQUARE,
  COUNT_OF_ALL_ADS,
  PAGINATION,
} from './selectors/index.js'

import { START_PREPARED_URL } from './constants/index.js'

async function parser(URL) {
  const { browser, page } = await init(URL, { headless: true })

  const countAllAdsNode = await page.$(COUNT_OF_ALL_ADS)
  const countAllAds = await page.evaluate((number) => {
    return number?.innerText
  }, countAllAdsNode)
  console.log('countAllAds: ', countAllAds) // 465

  // 1 - блок получения данных с одной страницы
  const ads = []
  const adsNode = await page.$$(AD)

  for (const adNode of adsNode) {
    const evaluate = curryEvaluate(page, adNode)

    const id = await evaluate(AD_ID)
    const price = await evaluate(AD_PRICE)
    const square = await evaluate(AD_SQUARE)
    const rooms = await evaluate(AD_ROOMS)
    const floor = await evaluate(AD_FLOOR)

    // фильтр для некорректных объявлений
    id && ads.push({ id, price, square, rooms, floor })
  }
  // 1 - блок получения данных с одной страницы

  const pagesNode = await page.$$(PAGINATION)
  console.log('pages: ', pagesNode)

  console.log('страниц всего: ', Math.ceil(countAllAds / ads.length))
  console.log('страниц всего для парсинга: ', Math.ceil(countAllAds / ads.length) - 1)

  ads.forEach((ad) => console.log(ad))

  await browser.close()
}

parser(START_PREPARED_URL).then(() => console.log('PARSING DONE'))
