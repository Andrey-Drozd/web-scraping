import { uniqBy } from 'lodash'

import {
  COUNT_ALL_ADS,
  COUNT_ALL_ADS_ON_PAGE,
  COUNT_PAGES,
  CREATE_FILE,
  CREATE_FILE_SUCCESS,
  CSV,
  FIRST_ROW,
  LOG_PARSING,
  NEXT_PAGE,
  PAGE,
  PARSING_SUCCESS,
  PROPERTIES,
  REALT_BY,
  RESULTS_PATH,
  SAVE_DATA,
  START_PREPARED_URL,
  START_URL
} from './constants'
import { init } from './init'
import {
  AD,
  AD_CITY,
  AD_ID,
  AD_INFO_LARGE,
  AD_INFO_MINI,
  AD_PRICE,
  AD_TITLE,
  AD_VIEWS,
  COUNT_OF_ALL_ADS,
  METRO_BLUE,
  METRO_GREEN,
  METRO_RED
} from './selectors'
import { dateServices, logServices } from './services'
import { TPreparedAd } from './types'
import {
  checkIsFolderForFiles,
  curryEvaluate,
  getPreparedAd,
  getPreparedAdForCsv,
  getRowAdForCsv,
  writeFirstRow,
  writeRow
} from './utils'

async function parser(URL: string) {
  const { browser, page } = await init(URL, { headless: true })
  const { INNER_TEXT, HREF, INNER_HTML } = PROPERTIES
  const dateTime = dateServices.getDateTime()

  checkIsFolderForFiles(RESULTS_PATH)

  // количество объявлений по выбранным фильтрам
  const countAllAdsNode = await page.$(COUNT_OF_ALL_ADS)
  const countAllAds = await page.evaluate((countAllAds) => {
    const result = countAllAds?.innerText
    return result ? Number(result) : null
  }, countAllAdsNode)
  logServices.send(COUNT_ALL_ADS, countAllAds)

  // проверка корректности парсинга количества всех объявлений
  if (!countAllAds) throw Error(`${LOG_PARSING}countAllAds is undefined!`)

  // количество объявлений на странице
  const countAllAdsOnPage = await page.$$(AD_ID)
  logServices.send(COUNT_ALL_ADS_ON_PAGE, countAllAdsOnPage.length)

  // количество страниц парсинга
  const countPages = Math.ceil(countAllAds / countAllAdsOnPage.length)
  logServices.send(COUNT_PAGES, countPages)

  const ads: TPreparedAd[] = []
  let currentPage = PAGE

  while (countPages > currentPage) {
    const adsNode = await page.$$(AD)

    for (const adNode of adsNode) {
      const evaluate = curryEvaluate(page, adNode)

      const id = await evaluate(AD_ID, INNER_TEXT)
      const infoMini = await evaluate(AD_INFO_MINI, INNER_HTML)
      const infoLarge = await evaluate(AD_INFO_LARGE, INNER_HTML)
      const title = await evaluate(AD_TITLE, INNER_TEXT)
      const url = await evaluate(AD_TITLE, HREF)
      const views = await evaluate(AD_VIEWS, INNER_TEXT)
      const price = await evaluate(AD_PRICE, INNER_TEXT)
      const city = await evaluate(AD_CITY, INNER_TEXT)
      const metroGreen = await evaluate(METRO_GREEN, INNER_TEXT)
      const metroBlue = await evaluate(METRO_BLUE, INNER_TEXT)
      const metroRed = await evaluate(METRO_RED, INNER_TEXT)

      if (id) {
        const preparedAd = getPreparedAd({
          id,
          infoMini,
          infoLarge,
          title,
          url,
          views,
          price,
          city,
          metro: [metroGreen, metroBlue, metroRed]
        })

        ads.push({
          id: preparedAd.id,
          title: preparedAd.title,
          url: preparedAd.url,
          date: preparedAd.date,
          views: preparedAd.views,
          price: preparedAd.price,
          city: preparedAd.city,
          metro: preparedAd.metro,
          square: preparedAd.square,
          rooms: preparedAd.rooms,
          floor: preparedAd.floor,
          floors: preparedAd.floors,
          floorTop: preparedAd.floorTop
        })
      }
    }

    ++currentPage
    const nextPage = `${START_URL}&page=${currentPage}`
    logServices.send(NEXT_PAGE, nextPage)
    await page.goto(nextPage)
  }

  logServices.send(PARSING_SUCCESS)
  logServices.send(CREATE_FILE)
  writeFirstRow({
    path: RESULTS_PATH,
    fileName: `${REALT_BY}_${dateTime}.${CSV}`,
    row: FIRST_ROW
  })
  logServices.send(CREATE_FILE_SUCCESS)

  const uniqueAds = uniqBy(ads, 'id') as TPreparedAd[]
  logServices.send(SAVE_DATA)
  uniqueAds.forEach((ad) => {
    const preparedAd = getPreparedAdForCsv(ad)
    const row = getRowAdForCsv(preparedAd)

    writeRow({
      path: RESULTS_PATH,
      fileName: `${REALT_BY}_${dateTime}.${CSV}`,
      row
    })
  })

  await browser.close()

  return {
    countAds: countAllAds
    // TODO
    // countAdsParsing: ads.length,
    // check: ads.length === countAllAds
  }
}

parser(START_PREPARED_URL)
  .then((result) => {
    logServices.send(COUNT_ALL_ADS, result.countAds)
    // TODO
    // console.log(`${LOG_PARSING}countAdsParsing: `, result.countAdsParsing)
    // console.log(`${LOG_PARSING}PARSING-SUCCESS: `, result.check)
  })
  .catch((err) => console.log(err))
