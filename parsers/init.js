import puppeteer from 'puppeteer'

async function init(url, options) {
  const browser = await puppeteer.launch({ headless: options.headless })
  const page = await browser.newPage()

  await page.setViewport({
    width: 1200,
    height: 1200,
  })

  await page.goto(url, { waitUntil: 'load' })

  return { browser, page }
}

export { init }
