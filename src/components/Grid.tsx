import React from "react";
import { CartItem } from "../utkonos/api";

type Props = {
  items: CartItem[]
}

export default function Grid(props: Props) {
  return <div>
    {props.items.map(item => (
      <div>
        {item.id} - {item.quantity}
      </div>
    ))}

  </div>
}