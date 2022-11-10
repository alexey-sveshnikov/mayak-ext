import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from 'styled-components';
import { extractData } from "./parsing";
import { lentaAPI } from "./clients/api_lenta";
import { CartItem } from "./types";
import Grid from "./components/Grid";

declare global {
  interface Window {
    promocode: string;
  }
}

type Props = {
  promocode: string;
}

export default function App(props: Props) {
  const [visible, setVisible] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const [progressState, setProgressState] = useState<string | null>(null)
  const [notes, setNotes] = useState<string[]>([])
  const [items, setItems] = useState<CartItem[]>([])

  const promocode = props.promocode

  useKeyboardHandler(ev => ev.key == 'Escape', () => setVisible(!visible), [visible])

  const onPaste = useCallback(() => {
    setNotes([])
    const notes: string [] = []

    if (!editorRef.current)
      return

    setTimeout(() => {
      if (!editorRef.current) return

      editorRef.current && prepareTextareaContent(editorRef.current)

      const { cartItems, rejectedRows, withCounts } = extractData(editorRef.current)
      if (!withCounts) {
        setNotes(["Не удалось распознать колонку таблицы с количествами – везде будут '1'", ...notes])
      }
      // TODO: отобразить rejectedRows как-нибудь
      // for (const el of rejectedRows) {
      //   el.setAttribute('style', 'background: grey;')
      // }
      setItems(cartItems)
    }, 100)
  }, [editorRef, notes])

  const applyPromocode = useCallback(async () => {
    // if (promocode) {
    //   setProgressState("применяем промокод")
    //   await lentaAPI.cartPromocodeAdd(promocode)
    //   setProgressState("")
    //   setNotes(["Промокод попробовали применить! Результат нужно проверить!", ...notes])
    // }
  }, [promocode, notes])

  const save = useCallback(() => {
    setNotes([])
    const notes: string[] = []

    const saveCart = async (): Promise<number> => {
      console.log('adding items', items)
      setProgressState("Проверяем наличие...")

      const firstAttempt = await lentaAPI.saveCart(items)

      for (const item of firstAttempt.rejectedItems) {
        console.log("item is failed to save: ", item)
        console.log("error was: ", item.error)
        items.find(x => x.id === item.id)!.error = item.error // note: O(x^2) here
      }
      setItems([...items])

      if (firstAttempt.success) {
        return firstAttempt.validItems.length
      } else {
        setProgressState("Сохраняем...")
        const secondAttempt = await lentaAPI.saveCart(firstAttempt.validItems)
        if (secondAttempt.success) {
          return secondAttempt.validItems.length
        } else {
          setNotes([
            "Ошибка при сохранении, должно помочь повторное сохранение",
            ...notes
          ])
          throw new Error()
        }
      }
    }

    saveCart().then((successCount) => {
      setNotes([
        `Сохранили успешно ${successCount} товаров из ${items.length}.`,
        `Товары, которые не удалось сохранить отмечены красным цветом`,
        `Изменения в корзине будут видны после перезагрузки страницы`,
        ...notes,
      ])
      setProgressState(null)
      // window.location.reload()
    }).catch((err: unknown) => {
      setProgressState(null)
      console.log('failed to save', err)
      alert(`Не удалось сохранить: ${err}`)
    })
  }, [applyPromocode, items])

  return (
    <React.StrictMode>
      {visible && (
        <Root className="utkonos-ext-root">
          {items.length > 0 && <Grid items={items} />}
          {items.length == 0 && (
            <TextArea
              contentEditable={true}
              ref={editorRef}
              onPaste={onPaste}
            />
          )}
          <Notes>
            {promocode && <div>Используется промокод {promocode}</div>}
            {notes.map(x => <div key={x}>{x}</div>)}
          </Notes>
          <Button onClick={save} disabled={!!progressState || !items.length}>
            {progressState ?? "Добавить"}
          </Button>
          {items.length > 0 && (
            <ClearButton onClick={() => setItems([])}>
              ❌
            </ClearButton>
          )}
        </Root>
      )}
      <Badge onClick={() => setVisible(!visible)} />
    </React.StrictMode>
  )
}

function useKeyboardHandler(filter: (ev: KeyboardEvent) => boolean, cb: () => void, deps: unknown[]) {
  useEffect(() => {
    const handler = (ev: KeyboardEvent) => {
      if (filter(ev))
        cb()
    }
    document.addEventListener('keyup', handler)
    return () => {
      document.removeEventListener('keyup', handler)
    }
  }, deps)
}

function prepareTextareaContent(startNode: Node) {
  clearCustomStyling(startNode)
  setLinksTarget(startNode)
}

function clearCustomStyling(startNode: Node) {
  let node
  const iterator = document.createNodeIterator(
    startNode,
    NodeFilter.SHOW_ALL,
  );

  while (node = iterator.nextNode() as Element) {
    node.removeAttribute && node.removeAttribute('style')
  }
}

function setLinksTarget(startNode: Node) {
  let node
  const iterator = document.createNodeIterator(
    startNode,
    NodeFilter.SHOW_ALL,
  );

  while (node = iterator.nextNode() as Element) {
    if (node.tagName == 'A') {

      node.setAttribute('target', '_blank')
    }
  }
}

const Root = styled.div`
  position: fixed;
  width: 600px;
  height: 80vh;
  top: calc(50% - 40vh);
  right: 5px;
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
  
  font-size: 0.8em;
  
  padding: 5px 10px;
`;

const Notes = styled.div`
  font-size: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Button = styled.button`
  margin: 5px;
  border: 1px solid black;
  border-radius: 3px;
`

const Badge = styled.div`
  position: fixed;
  height: 73px;
  width: 36px;
  top: 0;
  right: 0;
  z-index: 1000;
  background: url(https://mayak.help/wp-content/themes/mayak/img/logo.png);
  transform: scale(0.8);
  -webkit-transform-origin-x: right;
  -webkit-transform-origin-y: top;
`;


const ClearButton = styled.a`
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  width: 1em;
  height: 1em;
  padding: 5px;
  background: white;
  border-radius: 4px;
  line-height: 17px;
  font-size: 14px;
  
  opacity: 0.6;
  transition: all .2s ease-in-out;
  
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`
