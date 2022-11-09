import { CartItem } from "../types";
import { StoreException } from "./exceptions";


// type APIResponse = {
//   Body: {
//     ErrorList: {
//       Class: string
//       Data: unknown
//       Code: string
//       Message: string
//       Description: string
//       Type: string
//     }[]
//     CartList: {
//       CartNotices: {
//         CartNoticeList: {
//           Class: string // cart_exception_validate_stock,
//           Description: string // Извините, некоторые из выбранных товаров отсутствуют.,
//         }[]
//       }
//     }[]
//   }
// }

export class LentaAPI {
  async saveCart(items: CartItem[]) {
    const body = items.map(item => ({
      skuCode: item.id.toString(),
      quantity: item.quantity,
      isPostedFromCartPage: true,
    }))
    return this.makeRequest('/api/v2/ecom/cart/skus', body)
  }

  async makeRequest(method: string, body: unknown) {
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

    if (!response.ok)
      throw new StoreException(response.statusText)

    return await response.json()
  }
}

export const lentaAPI = new LentaAPI()
