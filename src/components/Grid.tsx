import React, { useCallback } from "react";
import styled from "styled-components";

import { CartItem } from "../types";

type Props = {
  items: CartItem[]
  rejectedRows?: Element[]
}

function itemNameToSearchRequest(name: string): string {
  return name
    .replace(/вес до.+/, '')
    .replace(/,.+/, '')
}

export default function ({ items, rejectedRows }: Props) {
  const getBackgroundColor = useCallback((item: CartItem) => {
    if (item.error)
      return '#ffb0b0'
    else if (item.warning)
      return 'lightgrey'
    else if (item.mapped)
      return 'lightblue'
    else
      return 'white'

  }, [])
  return <Grid>
    {rejectedRows && (<table>
      {rejectedRows}
    </table>)}

    {items.map(item => (
      <Product key={item.id} style={{ background: getBackgroundColor(item) }}>
        <ProductRow>
          <ProductDetails style={{
            flex: '1 1 100%'
          }}>
            <Link href={`/item/${item.id}/`} target="_blank">{item.name}</Link>
          </ProductDetails>
          <ProductDetails>
            {item.quantity}&nbsp;шт
          </ProductDetails>
          <ProductDetails>
            <Link href={`/search/${encodeURI(itemNameToSearchRequest(item.name))}`} target="_blank">🔎</Link>
          </ProductDetails>
        </ProductRow>
        {item.error && (
          <Error>{item.error}</Error>
        )}
        {item.warning && (
          <Warning>Не удалось определить количество</Warning>
        )}
      </Product>
    ))}
  </Grid>
}

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  background: #444;
  overflow: auto;
  overscroll-behavior: contain;
  gap: 1px;
  width: 100%;
`
const Product = styled.div`
  flex: 0 0 3em;
  padding: 8px;
  background: white;
  
  display: flex;
  flex-direction:column;
  gap: 9px;
`

const Link = styled.a`
  text-decoration: none;
  color: black;
`

const ProductRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`

const ProductDetails = styled.div`
  display: flex
`

const Error = styled.div`
  font-weight: 500;
  color: black;
`

const Warning = styled.div`
  font-size: 1.2em;
`
