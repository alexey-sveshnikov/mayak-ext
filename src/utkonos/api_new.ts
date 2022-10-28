import * as Cookies from 'es-cookie';
import { uuidv4 } from "../sdk/helpers";
import { CartItem } from "../types";
import { UtkonosAPIException } from "./exceptions";


type APIResponse = {
  Body: {
    ErrorList: {
      Class: string
      Data: unknown
      Code: string
      Message: string
      Description: string
      Type: string
    }[]
    CartList: {
      CartNotices: {
        CartNoticeList: {
          Class: string // cart_exception_validate_stock,
          Description: string // Извините, некоторые из выбранных товаров отсутствуют.,
        }[]
      }
    }[]
  }
}

class UtkonosNewAPI {
  async modifyCartItem(item: CartItem): Promise<APIResponse> {
    const data = await this.makeRequest("cartItemModify", {
      "GoodsItemId": item.id,
      "Quantity": item.quantity,
      "Return": {
        "Cart": 0,
        "Goods": 0,
      }
    })

    const cartNotice = data.Body.CartList[0]?.CartNotices?.CartNoticeList[0]?.Description
    if (cartNotice) {
      throw new UtkonosAPIException(cartNotice)
    }
    return data
  }

  //   fetch("https://www.utkonos.ru/api/rest/cartItemModify", {
  //   "headers": {
  //     "accept": "application/json, text/plain, */*",
  //     "accept-language": "en-US,en;q=0.9,ru;q=0.8",
  //     "content-type": "application/x-www-form-urlencoded",
  //     "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
  //     "sec-ch-ua-mobile": "?0",
  //     "sec-ch-ua-platform": "\"macOS\"",
  //     "sec-fetch-dest": "empty",
  //     "sec-fetch-mode": "cors",
  //     "sec-fetch-site": "same-origin",
  //     "x-retail-brand": "utk"
  //   },
  //   "referrer": "https://www.utkonos.ru/action/detail/39815",
  //   "referrerPolicy": "strict-origin-when-cross-origin",
  //   "body:"
  //         request:{ "Head": {
  //           "RequestId": "fd947996c73548e3f5fe1cb65ec88da8",
  //             "MarketingPartnerKey": "mp80-661295c9cbf9d6b2f6428414504a8deed3020641",
  //             "Version": "angular_web_0.0.2",
  //             "Client": "angular_web_0.0.2",
  //             "Method": "cartItemModify",
  //             "DeviceId": "98830fe6-f566-7609-903c-7c643e46ffa2",
  //             "Domain": "moscow",
  //             "Store": "utk",
  //             "SessionToken": "FC0FED52A9A1E28364406274E2A32B07"
  //         }, "Body": { "GoodsItemId": "567405", "Quantity": 1, "Return": { "Cart": 1, "Goods": 1 } }
  //         }
  //   "method": "POST",
  //   "mode": "cors",
  //   "credentials": "include"
  // });
  //
  async makeRequest(method: string, requestBody: unknown): Promise<APIResponse> {
    const sessionToken = await Cookies.get('Utk_SessionToken')
    const deviceId = await Cookies.get('Utk_DvcGuid')

    const request = {
      "Head": {
        "DeviceId": deviceId,
        "SessionToken": sessionToken,
        "RequestId": uuidv4().replaceAll(/-/g, ''),
        "MarketingPartnerKey": "mp80-661295c9cbf9d6b2f6428414504a8deed3020641",
        "Version": "utkonos-ext",
        "Client": "utkonos-ext",
        "Method": method,
        "Domain": "moscow",
        "Store": "utk",
      },
      "Body": requestBody,
    }
    console.log("[new API] sending request to method", method, request)

    // const formData = new URLSearchParams()
    // formData.append("request", JSON.stringify(request))
    const formData = `request=${JSON.stringify(request)}`

    const response = await fetch(`https://www.utkonos.ru/api/rest/${method}`, {
      "headers": {
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9,ru;q=0.8",
        "Content-Type": "application/x-www-form-urlencoded",
        "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-retail-brand": "utk"
      },
      "referrer": "https://www.utkonos.ru/",
      "referrerPolicy": "no-referrer-when-downgrade",
      "body": formData,
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });
    if (!response.ok)
      throw new UtkonosAPIException(response.statusText)

    const data = await response.json() as APIResponse
    console.log('response: ', data)

    if (data.Body.ErrorList) {
      throw  new UtkonosAPIException(data.Body.ErrorList[0].Message)
    }

    return data
  }
}

export const utkonosNewAPI = new UtkonosNewAPI()
