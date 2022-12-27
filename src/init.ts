import puppeteer from 'puppeteer'

import { NETWORK_IDLE_2 } from './realt.by/constants'

async function init(url: string, options: { headless: boolean }) {
  const browser = await puppeteer.launch({ headless: options.headless })
  const page = await browser.newPage()

  await page.setViewport({
    width: 1920,
    height: 1080
  })

  await page.goto(url, { waitUntil: NETWORK_IDLE_2 })

  return { browser, page }
}

export { init }
