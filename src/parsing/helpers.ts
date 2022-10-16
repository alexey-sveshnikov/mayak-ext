export function doXpath(query: string, root: HTMLElement, resultType = XPathResult.ORDERED_NODE_ITERATOR_TYPE): HTMLElement[] {
  const result: HTMLElement[] = []
  const xp = document.evaluate(query, root, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE)

  let item = xp.iterateNext()
  while (item) {
    if (item instanceof HTMLElement) {
      result.push(item)
    }
    item = xp.iterateNext()
  }
  return result
}
