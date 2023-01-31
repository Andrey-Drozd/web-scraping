import * as fs from 'fs'

import {
  FILE_NAME,
  FIRST_ROW,
  PROPERTIES,
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
  curryEvaluate,
  getFileData,
  getPreparedData,
  getRowData
} from './utils'

async function parser(URL: string) {
  const { browser, page } = await init(URL, { headless: true })
  const { INNER_TEXT, HREF } = PROPERTIES

  // количество объявлений по выбранным фильтрам
  const countAllAdsNode = await page.$(COUNT_OF_ALL_ADS)
  const countAllAds = await page.evaluate((countAllAds) => {
    const result = countAllAds?.innerText
    return result ? Number(result) : null
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

  // eslint-disable-next-line consistent-return
  // fs.access(`./${FILE_NAME}`, fs.constants.F_OK, (err) => {
  //   if (err) {
  //     fs.appendFile(FILE_NAME, FIRST_ROW, (err) => {
  //       if (err) throw err
  //     })
  //     console.log(`файл создан с названием: ${FILE_NAME}`)
  //   }
  //
  //   // fs.unlink(`./${FILE_NAME}`, (err) => {
  //   //   if (err) throw err
  //   //   console.log(`файл был удален по пути: ./${FILE_NAME}`)
  //   // })
  //   //
  //   // fs.appendFile(FILE_NAME, FIRST_ROW, (err) => {
  //   //   if (err) throw err
  //   // })
  //   // console.log(`файл создан с названием: ${FILE_NAME}`)
  // })

  fs.access(`./${FILE_NAME}`, fs.constants.F_OK, (e) => {
    if (e) {
      console.log('файла нет')
      return
    }

    console.log('файл есть')
  })

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

        // console.log(lineData)

        fs.appendFile('results.csv', rowData, (err) => {
          if (err) throw err
        })
      }
    }

    ++CURRENT_PAGE
    // console.log('nextPage: ', `${START_URL}&page=${CURRENT_PAGE}`)
    await page.goto(`${START_URL}&page=${CURRENT_PAGE}`)
  }

  // ads.forEach((ad) => console.log(ad))

  await browser.close()

  return ads.length === countAllAds
}

parser(START_PREPARED_URL)
  .then((result) => console.log('PARSING-SUCCESS: ', result))
  .catch((err) => console.log(err))
