import * as Cookies from 'es-cookie';


export type CartItem = {
  id: number;
  quantity: number;
}

export async function saveCartItems(items: CartItem[]) {
  const deviceData = JSON.parse(localStorage.getItem('device_data') || '{}')
  const sessionToken = await Cookies.get('Utk_SessionToken')

  const ids: string[] = []
  const quantities: number[] = []

  for (const item of items) {
    ids.push(item.id.toString())
    quantities.push(item.quantity)
  }

  const request = {
    "Head": {
      "DeviceId": deviceData['device_id'],
      "Domain": "www.utkonos.ru",
      "RequestId": uuidv4().replaceAll(/-/g, ''),
      "MarketingPartnerKey": "mp-cc3c743ffd17487a9021d11129548218",
      "Version": "utkonos-ext",
      "Client": "utkonos-ext",
      "Method": "cartItemMultiAdd",
      "Store": "utk",
      "SessionToken": sessionToken,
    },
    "Body": {
      "GoodsItemId": ids,
      "Count": quantities,
      "UseDelta": 0,
      "Return": { "Cart": "0", "CartItemList": "0", "TotalCost": "0" }
    }
  }
  console.log("sending request", request)
  const formData = new FormData()
  formData.append("request", JSON.stringify(request))

  const response = await fetch("https://www.utkonos.ru/api/v1/cartItemMultiAdd", {
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
}


// https://stackoverflow.com/a/2117523
function uuidv4() {
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
