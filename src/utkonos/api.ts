import * as Cookies from 'es-cookie';
import { uuidv4 } from "../sdk/helpers";


export type CartItem = {
  id: number;
  quantity: number;
}

class UtkonosAPI {
  async saveCart(items: CartItem[]) {
    const ids: string[] = []
    const quantities: number[] = []

    for (const item of items) {
      ids.push(item.id.toString())
      quantities.push(item.quantity)
    }

    const requestBody = {
      "GoodsItemId": ids,
      "Count": quantities,
      "UseDelta": 0,
      "Return": { "Cart": "0", "CartItemList": "0", "TotalCost": "0" }
    }

    return this.makeRequest("cartItemMultiAdd", requestBody)
  }

  async makeRequest(method: string, requestBody: unknown) {
    const deviceData = JSON.parse(localStorage.getItem('device_data') || '{}')
    const sessionToken = await Cookies.get('Utk_SessionToken')

    const request = {
      "Head": {
        "DeviceId": deviceData['device_id'],
        "Domain": "www.utkonos.ru",
        "RequestId": uuidv4().replaceAll(/-/g, ''),
        "MarketingPartnerKey": "mp-cc3c743ffd17487a9021d11129548218",
        "Version": "utkonos-ext",
        "Client": "utkonos-ext",
        "Method": method,
        "Store": "utk",
        "SessionToken": sessionToken,
        "Body": requestBody,
      },
    }
    console.log("sending request to method", method, request)
    const formData = new FormData()
    formData.append("request", JSON.stringify(request))

    const response = await fetch(`https://www.utkonos.ru/api/v1/${method}`, {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9,ru;q=0.8",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Chromium\";v=\"106\", \"Google Chrome\";v=\"106\", \"Not;A=Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
      },
      "referrer": "https://www.utkonos.ru/",
      "referrerPolicy": "no-referrer-when-downgrade",
      "body": formData,
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });
    console.log(response)
    return response
  }
}

export const utkonosAPI = new UtkonosAPI()