import React, { useCallback } from "react";
import styled from "styled-components";

import { CartItem } from "../types";

export default function ({ items }: { items: CartItem[] }) {
  const getBackgroundColor = useCallback((item: CartItem) => {
    if (item.error)
      return '#ffb0b0'
    else if (item.warning)
      return 'lightgrey'
    else
      return 'white'

  }, [])
  return <Grid>
    {items.map(item => (
      <Product key={item.id} style={{ background: getBackgroundColor(item) }}>
        <ProductRow>
          <ProductDetails>
            <Link href={`/product/${item.id}/`} target="_blank">{item.name}</Link>
          </ProductDetails>
          <ProductDetails>
            {item.quantity}&nbsp;шт
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
