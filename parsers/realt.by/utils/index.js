export const curryEvaluate = (page, product) => {
  return async (options) => {
    const result = await page.evaluate(
      (product, { selector, property }) => {
        return product.querySelector(selector)?.[property]
      },
      product,
      { ...options }
    )

    return result
  }
}
