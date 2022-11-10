export type CartItem = {
  id: number
  quantity: number
  name: string
  tableRow?: Element // строка таблицы, где элемент был найден (чтобы подсветить ошибки)
  warning?: boolean
  error?: string
  mapped?: boolean
  originalId?: number
}

