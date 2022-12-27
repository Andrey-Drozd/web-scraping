import { ElementHandle, Page } from 'puppeteer'

import { INNER_TEXT } from '../constants'

export const curryEvaluate = (page: Page, node: ElementHandle<Element>) => {
  return async (selector: string, property = INNER_TEXT) => {
    const result = await page.evaluate(
      (node, selector, property) => {
        const data = node.querySelector(selector)
        return data?.[property as keyof typeof data]
      },
      node,
      selector,
      property
    )

    return result
  }
}
