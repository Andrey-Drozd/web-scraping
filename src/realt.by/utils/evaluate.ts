import { ElementHandle, Page } from 'puppeteer'

import { PROPERTIES } from '../constants'

export const curryEvaluate = (
  page: Page,
  node: ElementHandle<HTMLDivElement>
) => {
  return async (selector: string, currentProperty: PROPERTIES) => {
    return page.evaluate(
      (node, selector, currentProperty, PROPERTIES) => {
        const { HREF, INNER_TEXT } = PROPERTIES
        const nodeElement: HTMLDivElement | null = node.querySelector(selector)

        if (!nodeElement) return null

        switch (currentProperty) {
          case INNER_TEXT:
            return nodeElement[INNER_TEXT]
          case HREF:
            return nodeElement[HREF as keyof typeof nodeElement] as string
          default:
            return null
        }
      },
      node,
      selector,
      currentProperty,
      PROPERTIES
    )
  }
}
