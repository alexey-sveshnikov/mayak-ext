import React, { RefObject, useCallback, useEffect, useRef, useState } from "react";
import styled from 'styled-components';
import { CartItem, saveCartItems } from "./utkonos/cart";


function getItems(ref: RefObject<HTMLDivElement>): CartItem[] {
  if (ref.current == null) {
    return []
  }
  const res = document.evaluate('.//a', ref.current, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE)

  let el = res.iterateNext()

  const links: string[] = []

  while (el !== null) {
    if (el instanceof HTMLElement) {
      const href = el.getAttribute('href')
      if (href) {
        links.push(href)
      }
    }
    el = res.iterateNext()
  }

  const text = links.join("\n") + ref.current.textContent

  const items: CartItem[] = [];
  const seenItems = new Set<string>()

  for (const m of text.matchAll(/https:\/\/www\.utkonos\.ru\/item\/(\d+)/g)) {
    const id = m[1]
    if (seenItems.has(id)) {
      continue
    }
    seenItems.add(id)

    items.push({
      id: parseInt(id),
      quantity: 1,
    })
  }

  return items
}


export default function App() {
  const [visible, setVisible] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (ev: KeyboardEvent) => {
      if ((ev.key == 'k' || ev.key == 'к') && ev.ctrlKey) {
        setVisible(!visible)
      }
    }
    document.addEventListener('keyup', handler)
    return () => {
      document.removeEventListener('keyup', handler)
    }
  }, [visible])

  const save = useCallback(() => {
    const items = getItems(editorRef)

    if (items.length == 0) return

    console.log('adding items', items)

    saveCartItems(items).then(() => {
      // @ts-ignore
      rrToUtkAdapter.modifyItemAtCart(items[0]) // fake cart modification to trigger reload
    })

  }, [])

  return (
    <React.StrictMode>
      {visible && (
        <Root>
          <TextArea
            // onChange={(ev) => setText(ev.target.value)}
            contentEditable={true}
            ref={editorRef}
          />
          <button onClick={save}>
            Добавить
          </button>
        </Root>
      )}
      <Badge />
    </React.StrictMode>
  )
}

const Root = styled.div`
  position: fixed;
  width: 400px;
  height: 80vh;
  top: calc(50% - 40vh);
  right: calc(50% - 150px);
  background: #ffd9d9;
  z-index: 1000;
  border: 1px solid #555;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const TextArea = styled.div`
  height: 100%;
  width: 100%;
  border-radius: 7px;
  background: white;
  overflow: scroll;
`;

const Badge = styled.div`
  position: fixed;
  height: 73px;
  width: 36px;
  top: 0;
  right: 0;
  z-index: 1000;
  background: url(https://mayak.help/wp-content/themes/mayak/img/logo.png);
  transform: scale(0.5);
  -webkit-transform-origin-x: right;
  -webkit-transform-origin-y: top;
`;