// import * as fs from 'fs'

import { init } from '../init'
import { PROPERTIES, START_PREPARED_URL, START_URL } from './constants'
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
import { curryEvaluate, getPreparedData } from './utils'

async function parser(URL: string) {
  const { browser, page } = await init(URL, { headless: true })
  const { INNER_TEXT, HREF } = PROPERTIES

  // количество объявлений по выбранным фильтрам
  const countAllAdsNode = await page.$(COUNT_OF_ALL_ADS)
  const countAllAds = await page.evaluate((countAllAds) => {
    const result = countAllAds?.innerText
    return result ? Number(result) : undefined
  }, countAllAdsNode)
  console.log('countAllAds: ', countAllAds) // 27

  // проверка корректности парсинга количества всех объявлений
  if (!countAllAds) throw Error('Selector "countAllAds" is undefined!')

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

      const id = await evaluate(AD_ID, INNER_TEXT)
      const price = await evaluate(AD_PRICE, INNER_TEXT)
      const href = await evaluate(AD_TITLE, HREF)
      const title = await evaluate(AD_TITLE, INNER_TEXT)
      const square = await evaluate(AD_SQUARE, INNER_TEXT)
      const rooms = await evaluate(AD_ROOMS, INNER_TEXT)
      const floor = await evaluate(AD_FLOOR, INNER_TEXT)

      if (id) {
        const preparedData = getPreparedData({
          id
          // price
          // href,
          // title,
          // square,
          // rooms,
          // floor
        })

        console.log('preparedData: ', preparedData)
      }

      // фильтр для некорректных объявлений
      if (id) {
        ads.push({ id, price, href, title, square, rooms, floor })

        // fs.appendFile(
        //   'message.csv',
        //   `${title.replace(
        //     /,/g,
        //     '%2C'
        //   )},${price},${href},${title},${square},${rooms},${floor}`,
        //   (err) => {
        //     if (err) throw err
        //     console.log('The "data to append" was appended to file!')
        //   }
        // )
      }
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
