import { CartItem } from "../types";
import { extractFromTable } from "./extract_from_table";
import { extractFromUnstructuredText } from "./extract_unstructured";

export function extractData(el: HTMLElement): { cartItems: CartItem[], rejectedRows: Element[], withCounts: boolean } {
  if (document.evaluate('count(.//table)', el, null, XPathResult.NUMBER_TYPE).numberValue == 1) {
    const { cartItems, rejectedRows } = extractFromTable(el)
    if (cartItems.length > 0) return { withCounts: true, cartItems, rejectedRows }
  }
  return {
    cartItems: extractFromUnstructuredText(el),
    rejectedRows: [],
    withCounts: false,
  }
}