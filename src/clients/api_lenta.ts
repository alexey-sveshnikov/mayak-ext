import { CartItem } from "../types";
import { StoreException } from "./exceptions";

type APIErrorResponse = Array<{
  errorSkus: {
    skuCode: string,
    errorType: number,
    availableStock: number,
  }[]
  isSuccessful: boolean
  errorMessage: string
}>

export class LentaAPI {
  async saveCart(items: CartItem[]): Promise<{ success: boolean, validItems: CartItem[], rejectedItems: CartItem[] }> {
    const body = items.map(item => ({
      skuCode: item.id.toString(),
      quantity: item.quantity,
      isPostedFromCartPage: true,
    }))
    const [statusCode, responseData] = await this.makeRequest<APIErrorResponse>('/api/v2/ecom/cart/skus', body)

    if (statusCode == 200) {
      return {
        success: true,
        validItems: items,
        rejectedItems: []
      }
    } else {
      const rejectedItems: CartItem[] = []

      for (const responseItem of responseData) {
        const item = items.find(x => x.id.toString() == responseItem.errorSkus[0]?.skuCode)
        if (!item) {
          console.error("unexpected item in the response data", responseItem)
          continue
        }
        rejectedItems.push({
          ...item,
          error: responseItem.errorMessage,
        })
      }

      const rejectedItemIDs = new Set()
      for (const item of rejectedItems) {
        rejectedItemIDs.add(item.id)
      }

      const validItems = items.filter(x => !rejectedItemIDs.has(x.id))

      return {
        success: statusCode === 200,
        rejectedItems,
        validItems
      }
    }
  }

  async makeRequest<ResponseType>(method: string, body: unknown): Promise<[number, ResponseType]> {
    const response = await fetch('https://lenta.com' + method, {
      "headers": {
        "accept": "application/json",
        "accept-language": "en-US,en;q=0.9,ru;q=0.8",
        "content-type": "application/json",
      },
      "referrer": "https://lenta.com/order/cart/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": JSON.stringify(body),
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    })

    if (response.status >= 500)
      throw new StoreException(response.statusText)

    return [response.status, await response.json() as ResponseType]
  }
}

export const lentaAPI = new LentaAPI()
