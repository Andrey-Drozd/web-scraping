import {
  FIRST_ROW,
  PROPERTIES,
  REALT_BY,
  RESULTS_PATH,
  START_PREPARED_URL,
  START_URL
} from './constants'
import { init } from './init'
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
  const { INNER_TEXT, HREF } = PROPERTIES

  checkIsFolderForFiles(RESULTS_PATH)

  // количество объявлений по выбранным фильтрам
  const countAllAdsNode = await page.$(COUNT_OF_ALL_ADS)
  const countAllAds = await page.evaluate((countAllAds) => {
    const result = countAllAds?.innerText
    return result ? Number(result) : null
  }, countAllAdsNode)
  console.log('LOG | parsing > countAllAds: ', countAllAds)

  // проверка корректности парсинга количества всех объявлений
  if (!countAllAds) throw Error('LOG | selector "countAllAds" is undefined!')

  // количество объявлений на странице
  const countAllAdsNodeOnPage = await page.$$(AD_ID)
  console.log(
    'LOG | parsing > countAllAdsNodeOnPage: ',
    countAllAdsNodeOnPage.length
  )

  // количество страниц парсинга
  const countPages = Math.ceil(countAllAds / countAllAdsNodeOnPage.length)
  console.log('LOG | parsing > countPages: ', countPages)

  // данные парсинга
  const ads = []

  let CURRENT_PAGE = 0
  let IS_FIRST_ROW = false

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

      // фильтр для некорректных объявлений
      if (id) {
        const preparedData = getPreparedData({
          id,
          price,
          href,
          title,
          square,
          rooms,
          floor
        })

        ads.push({
          id: preparedData.id,
          price: preparedData.price,
          href: preparedData.href,
          title: preparedData.title,
          square: preparedData.square,
          rooms: preparedData.rooms,
          floor: preparedData.floor,
          totalFloors: preparedData.totalFloors
        })

        const fileData = getFileData(preparedData)
        const rowData = getRowData(fileData)

        if (!IS_FIRST_ROW) {
          writeFirstRow({
            path: RESULTS_PATH,
            fileName: REALT_BY,
            row: FIRST_ROW
          })

          IS_FIRST_ROW = true
        }

        writeRow({
          path: RESULTS_PATH,
          fileName: REALT_BY,
          row: rowData
        })
      }
    }

    ++CURRENT_PAGE

    const NEXT_PAGE = `${START_URL}&page=${CURRENT_PAGE}`

    console.log('LOG | parsing > nextPage: ', NEXT_PAGE)

    await page.goto(NEXT_PAGE)
  }

  // ads.forEach((ad) => console.log(ad))

  await browser.close()

  return ads.length === countAllAds
}

parser(START_PREPARED_URL)
  .then((result) => console.log('PARSING-SUCCESS: ', result))
  .catch((err) => console.log(err))
