
  export type CartItem = {
    id: number
    quantity: number
    tableRow?: Element // строка таблицы, где элемент был найден (чтобы подсветить ошибки)
    warning?: boolean
  }

