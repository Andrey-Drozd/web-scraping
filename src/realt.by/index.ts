import {
  CSV,
  FIRST_ROW,
  LOG_PARSING,
  PROPERTIES,
  REALT_BY,
  RESULTS_PATH,
  START_PREPARED_URL,
  START_URL
} from './constants'
import { init } from './init'
import {
  AD,
  AD_CITY,
  AD_FLOOR,
  AD_ID,
  AD_INFO,
  AD_PRICE,
  AD_ROOMS,
  AD_SQUARE,
  AD_TITLE,
  AD_VIEWS,
  COUNT_OF_ALL_ADS,
  METRO_BLUE,
  METRO_GREEN,
  METRO_RED
} from './selectors'
import { dateServices } from './services'
import { TPreparedData } from './types'
import {
  checkIsFolderForFiles,
  curryEvaluate,
  getFileData,
  getPreparedData,
  getRowData,
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
  console.log(`${LOG_PARSING}countAllAds: `, countAllAds)

  // проверка корректности парсинга количества всех объявлений
  if (!countAllAds) throw Error(`${LOG_PARSING}countAllAds is undefined!`)

  // количество объявлений на странице
  const countAllAdsNodeOnPage = await page.$$(AD_ID)
  console.log(
    `${LOG_PARSING}countAllAdsNodeOnPage: `,
    countAllAdsNodeOnPage.length
  )

  // количество страниц парсинга
  const countPages = Math.ceil(countAllAds / countAllAdsNodeOnPage.length)
  console.log(`${LOG_PARSING}countPages: `, countPages)

  // данные парсинга
  const ads: TPreparedData[] = []

  let CURRENT_PAGE = 0
  let IS_FIRST_ROW = false

  while (countPages > CURRENT_PAGE) {
    const adsNode = await page.$$(AD)

    // получение данных с текущей страницы
    for (const adNode of adsNode) {
      const evaluate = curryEvaluate(page, adNode)

      const id = await evaluate(AD_ID, INNER_TEXT)
      const info = await evaluate(AD_INFO, INNER_HTML)
      const title = await evaluate(AD_TITLE, INNER_TEXT)
      const url = await evaluate(AD_TITLE, HREF)
      const views = await evaluate(AD_VIEWS, INNER_TEXT)
      const price = await evaluate(AD_PRICE, INNER_TEXT)
      const city = await evaluate(AD_CITY, INNER_TEXT)
      const metroGreen = await evaluate(METRO_GREEN, INNER_TEXT)
      const metroBlue = await evaluate(METRO_BLUE, INNER_TEXT)
      const metroRed = await evaluate(METRO_RED, INNER_TEXT)
      const square = await evaluate(AD_SQUARE, INNER_TEXT)
      const rooms = await evaluate(AD_ROOMS, INNER_TEXT)
      const floors = await evaluate(AD_FLOOR, INNER_TEXT)

      // фильтр для некорректных объявлений
      if (id) {
        const preparedData = getPreparedData({
          id,
          info,
          title,
          url,
          views,
          price,
          city,
          metro: [metroGreen, metroBlue, metroRed],
          square,
          rooms,
          floors
        })

        ads.push({
          id: preparedData.id,
          title: preparedData.title,
          url: preparedData.url,
          date: preparedData.date,
          views: preparedData.views,
          price: preparedData.price,
          city: preparedData.city,
          metro: preparedData.metro,
          square: preparedData.square,
          rooms: preparedData.rooms,
          floor: preparedData.floor,
          floors: preparedData.floors,
          floorTop: preparedData.floorTop
        })

        const fileData = getFileData(preparedData)
        const rowData = getRowData(fileData)

        if (!IS_FIRST_ROW) {
          writeFirstRow({
            path: RESULTS_PATH,
            fileName: `${REALT_BY}_${dateTime}.${CSV}`,
            row: FIRST_ROW
          })
          IS_FIRST_ROW = true
        }

        writeRow({
          path: RESULTS_PATH,
          fileName: `${REALT_BY}_${dateTime}.${CSV}`,
          row: rowData
        })
      }
    }

    ++CURRENT_PAGE

    const NEXT_PAGE = `${START_URL}&page=${CURRENT_PAGE}`
    console.log(`${LOG_PARSING}nextPage: `, NEXT_PAGE)
    await page.goto(NEXT_PAGE)
  }

  // ads.forEach((ad) => console.log(ad))

  await browser.close()

  return {
    countAds: countAllAds,
    countAdsParsing: ads.length,
    check: ads.length === countAllAds
  }
}

parser(START_PREPARED_URL)
  .then((result) => {
    console.log(`${LOG_PARSING}countAds: `, result.countAds)
    console.log(`${LOG_PARSING}countAdsParsingS: `, result.countAdsParsing)
    console.log(`${LOG_PARSING}PARSING-SUCCESS: `, result.check)
  })
  .catch((err) => console.log(err))
