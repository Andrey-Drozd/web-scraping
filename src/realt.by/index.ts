import { uniqBy } from 'lodash'

import {
  COUNT_ALL_ADS,
  COUNT_ALL_ADS_PARSING,
  NEXT_PAGE,
  PAGE,
  PARSING_CHECK,
  PARSING_SUCCESS,
  PROPERTIES,
  RESULTS_PATH,
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
  METRO_BLUE,
  METRO_GREEN,
  METRO_RED
} from './selectors'
import { logServices } from './services'
import { TPreparedAd } from './types'
import {
  checkIsFolderForFiles,
  curryEvaluate,
  getCountAllAds,
  getCountPages,
  getPreparedAd,
  saveDataToFile
} from './utils'

async function parser(URL: string) {
  const { browser, page } = await init(URL, { headless: true })
  const { INNER_TEXT, HREF, INNER_HTML } = PROPERTIES

  checkIsFolderForFiles(RESULTS_PATH)

  const countAllAds = await getCountAllAds(page)
  const countPages = await getCountPages(page, countAllAds)
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

  const uniqueAds = uniqBy(ads, 'id') as TPreparedAd[]
  saveDataToFile(uniqueAds)

  await browser.close()

  return {
    countAds: countAllAds,
    countAdsParsing: uniqueAds.length,
    parsingCheck: String(countAllAds === uniqueAds.length)
  }
}

parser(START_PREPARED_URL)
  .then(({ countAds, countAdsParsing, parsingCheck }) => {
    logServices.send(COUNT_ALL_ADS, countAds)
    logServices.send(COUNT_ALL_ADS_PARSING, countAdsParsing)
    logServices.send(PARSING_CHECK, parsingCheck)
  })
  .catch((err) => console.log(err))
