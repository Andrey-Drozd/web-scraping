import { INNER_TEXT } from '../constants/index.js'

export const curryEvaluate = (page, adNode) => {
  return async (selector, property = INNER_TEXT) => {
    const result = await page.evaluate(
      (adNode, selector, property) => {
        return adNode.querySelector(selector)?.[property]
      },
      adNode,
      selector,
      property
    )

    return result
  }
}
