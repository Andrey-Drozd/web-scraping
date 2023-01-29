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

export const getPreparedData = (params: {
  id: string
  // price?: string
  // href?: string
  // title?: string
  // square?: string
  // rooms?: string
  // floor?: string
}): {
  id: number
  // price: number | null
  // href: string | null
  // title: string | null
  // square: number | null
  // rooms: number | null
  // floor: string | null
} => {
  // const { id, price, href, title, square, rooms, floor } = params
  const { id } = params

  return {
    id: Number(id.replace(/\D/g, ''))
    // price: price ? Number(price.replace(/\D/g, '')) : null
    // href: href ? String(href).trim() : null,
    // title: title ? String(title.replace(/,/g, '%2C').trim()) : null,
    // square: square ? Number(square.replace(/м\n2/g, '')) : null,
    // rooms: rooms ? Number(rooms.replace(/-комн\./g, '')) : null,
    // floor: floor ? String(floor.replace(/этаж/g, '').trim()) : null
  }
}
