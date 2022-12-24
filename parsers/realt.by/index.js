import { init } from '../init.js'
import { curryEvaluate } from './utils/index.js'

import { START_URL, INNER_TEXT } from './constants/index.js'
import {
  ITEM,
  ITEM_FLOOR,
  ITEM_ID,
  ITEM_PRICE,
  ITEM_ROOMS,
  ITEM_SQUARE,
  NUMBER_OF_ITEMS,
  PAGINATION,
} from './selectors/index.js'

async function parser(URL) {
  let PAGE_NUMBER = 0
  const PREPARED_URL = `${URL}&page=${PAGE_NUMBER}`

  const { browser, page } = await init(PREPARED_URL, { headless: true })

  const itemsCount = await page.$(NUMBER_OF_ITEMS)

  const itemsCountTest = await page.evaluate((el) => {
    return el?.innerText
  }, itemsCount)

  console.log('itemsCountTest: ', itemsCountTest) // 465

  const products = await page.$$(ITEM)

  console.log('products.length: ', products.length) // 60 ElementHandle

  const items = []

  for (const product of products) {
    const evaluate = curryEvaluate(page, product)

    const id = await evaluate({ selector: ITEM_ID, property: INNER_TEXT })
    const price = await evaluate({ selector: ITEM_PRICE, property: INNER_TEXT })
    const square = await evaluate({ selector: ITEM_SQUARE, property: INNER_TEXT })
    const rooms = await evaluate({ selector: ITEM_ROOMS, property: INNER_TEXT })
    const floor = await evaluate({ selector: ITEM_FLOOR, property: INNER_TEXT })

    // фильтр для некорректных объявлений
    id && items.push({ id, price, square, rooms, floor })
  }

  const pages = await page.$$(PAGINATION)
  console.log('pages: ', pages)

  console.log('items.lengt: ', items.length) // 50 или 10

  console.log('страниц всего: ', Math.ceil(itemsCountTest / items.length))
  console.log('страниц всего для парсинга: ', Math.ceil(itemsCountTest / items.length) - 1)

  items.forEach((item) => console.log(item))

  await browser.close()
}

parser(START_URL).then(() => console.log('PARSING DONE'))
