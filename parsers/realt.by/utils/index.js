import { INNER_TEXT } from '../constants/index.js'

export const curryEvaluate = (page, node) => {
  return async (selector, property = INNER_TEXT) => {
    const result = await page.evaluate(
      (node, selector, property) => {
        return node.querySelector(selector)?.[property]
      },
      node,
      selector,
      property
    )

    return result
  }
}
