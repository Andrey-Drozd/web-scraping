import { init } from '../init'
import { HREF, START_PREPARED_URL, START_URL } from './constants'
import {
  AD,
  AD_FLOOR,
  AD_ID,
  AD_PRICE,
  AD_ROOMS,
  AD_SQUARE,
  AD_TITLE,
  COUNT_OF_ALL_ADS
} from './selectors'
import { curryEvaluate } from './utils'

async function parser(URL: string) {
  const { browser, page } = await init(URL, { headless: true })

  // количество объявлений по выбранным фильтрам
  const countAllAdsNode = await page.$(COUNT_OF_ALL_ADS)
  const countAllAds = Number(
    await page.evaluate((number) => {
      return number?.innerText
    }, countAllAdsNode)
  )
  console.log('countAllAds: ', countAllAds) // 27

  // количество объявлений на странице
  const countAllAdsNodeOnPage = await page.$$(AD_ID)
  console.log('countAllAdsNodeOnPage: ', countAllAdsNodeOnPage.length) // 10

  // количество страниц парсинга
  const countPages = Math.ceil(countAllAds / countAllAdsNodeOnPage.length)
  console.log('страниц всего: ', countPages) // 3

  // данные парсинга
  const ads = []

  let CURRENT_PAGE = 0

  while (countPages > CURRENT_PAGE) {
    const adsNode = await page.$$(AD)

    // получение данных с текущей страницы
    for (const adNode of adsNode) {
      const evaluate = curryEvaluate(page, adNode)

      const id = await evaluate(AD_ID)
      const href = await evaluate(AD_TITLE, HREF)
      const price = await evaluate(AD_PRICE)
      const title = await evaluate(AD_TITLE)
      const square = await evaluate(AD_SQUARE)
      const rooms = await evaluate(AD_ROOMS)
      const floor = await evaluate(AD_FLOOR)

      // фильтр для некорректных объявлений
      if (id) ads.push({ id, href, price, title, square, rooms, floor })
    }

    ++CURRENT_PAGE
    // console.log('nextPage: ', `${START_URL}&page=${CURRENT_PAGE}`)
    await page.goto(`${START_URL}&page=${CURRENT_PAGE}`)
  }

  ads.forEach((ad) => console.log(ad))

  await browser.close()

  return ads.length === countAllAds
}

parser(START_PREPARED_URL)
  .then((result) => console.log('PARSING-SUCCESS: ', result))
  .catch((err) => console.log(err))
