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

class UtkonosLegacyAPI {
  async saveCartBulk(items: CartItem[]) {
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

  async modifyCartItem(item: CartItem) {
    const response = await this.makeRequest("cartItemModify", {
      "GoodsItemId": item.id.toString(),
      "Quantity": item.quantity,
      "Return": { "Cart": 1, "CartItemList": 0, "TotalCost": 0 },
      "Source": null,
      "SourceId": null,
    })

    const cartNotice = (response.Body.CartList || [])[0]?.CartNotices?.CartNoticeList[0]?.Description
    if (cartNotice) {
      throw new UtkonosAPIException(cartNotice)
    }

    return response
  }

  async goodsItemSearchByid(id: number) {
    const requestBody = {
      "Id": id.toString(),
      "Return": {
        "BrandInfo": 1
      }
    }
    return this.makeRequest("goodsItemSearchByid", requestBody)
  }

  async cartPromocodeAdd(code: string) {
    await this.makeRequest('cartPromocodeAdd', {
      Code: code,
    })
  }

  // searchById
  //   fetch("https://www.utkonos.ru/api/v1/goodsItemSearchByid", {
  //   "headers": {
  //     "accept": "application/json, text/plain, */*",
  //     "accept-language": "en-US,en;q=0.9,ru;q=0.8",
  //     "cache-control": "no-cache",
  //     "content-type": "multipart/form-data; boundary=----WebKitFormBoundary7crB16oreZ2ti08S",
  //     "pragma": "no-cache",
  //     "sec-ch-ua": "\"Chromium\";v=\"106\", \"Google Chrome\";v=\"106\", \"Not;A=Brand\";v=\"99\"",
  //     "sec-ch-ua-mobile": "?0",
  //     "sec-ch-ua-platform": "\"macOS\"",
  //     "sec-fetch-dest": "empty",
  //     "sec-fetch-mode": "cors",
  //     "sec-fetch-site": "same-origin"
  //   },
  //   "referrer": "https://www.utkonos.ru/item/3456177/korm-vlazhnyj-whiskas-polnoracionnyj-pashtet-s-govjadinoj-i-pechenju-dlja-vzroslykh-koshek-24-shtuk-po-75-g",
  //   "referrerPolicy": "no-referrer-when-downgrade",
  //   "body": "------WebKitFormBoundary7crB16oreZ2ti08S\r\nContent-Disposition: form-data; name=\"request\"\r\n\r\n{\"Head\":{\"DeviceId\":\"60415571-f163-4aae-c215-b34a91364f00\",\"Domain\":\"www.utkonos.ru\",\"RequestId\":\"fd947996c73548e3f5fe1cb65ec88da8\",\"MarketingPartnerKey\":\"mp-cc3c743ffd17487a9021d11129548218\",\"Version\":\"angular_web_0.0.2\",\"Client\":\"angular_web_0.0.2\",\"Method\":\"goodsItemSearchByid\",\"Store\":\"utk\",\"SessionToken\":\"6F9EF1A46C71F4861ECD7C225D3371E0\"},\"Body\":{\"Id\":\"3456177\",\"Return\":{\"BrandInfo\":1,\"Recipes\":1}}}\r\n------WebKitFormBoundary7crB16oreZ2ti08S--\r\n",
  //   "method": "POST",
  //   "mode": "cors",
  //   "credentials": "include"
  // });

  async makeRequest(method: string, requestBody: unknown): Promise<APIResponse> {
    const deviceData = JSON.parse(localStorage.getItem('device_data') || '{}')
    const sessionToken = await Cookies.get('Utk_SessionToken')
    const host = window.location.host

    const request = {
      "Head": {
        "DeviceId": deviceData['device_id'],
        "Domain": host,
        "RequestId": uuidv4().replaceAll(/-/g, ''),
        "MarketingPartnerKey": "mp-cc3c743ffd17487a9021d11129548218",
        "Version": "utkonos-ext",
        "Client": "utkonos-ext",
        "Method": method,
        "Store": "utk",
        "SessionToken": sessionToken,
      },
      "Body": requestBody,
    }
    console.log("[legacy API] sending request to method", method, request)
    const formData = new FormData()
    formData.append("request", JSON.stringify(request))

    const response = await fetch(`https://${host}/api/rest/${method}`, {
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
      "referrer": `https://${host}/`,
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
      throw  new UtkonosAPIException(data.Body.ErrorList[0].Description)
    }

    return data
  }
}

export const utkonosLegacyAPI = new UtkonosLegacyAPI()