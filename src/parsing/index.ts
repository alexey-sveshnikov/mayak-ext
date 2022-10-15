import { CartItem } from "../utkonos/cart";
import { extractFromTable } from "./extract_from_table";
import { extractFromUnstructuredText } from "./extract_unstructured";

export function extractData(el: HTMLElement): CartItem[] {
  if (document.evaluate('count(.//table)', el, null, XPathResult.NUMBER_TYPE).numberValue == 1) {
    const data = extractFromTable(el)
    if (data.length > 0) return data
  }
  return extractFromUnstructuredText(el)
}