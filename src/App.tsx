import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from 'styled-components';
import * as Cookies from 'es-cookie';
import { extractData } from "./parsing";
import { utkonosLegacyAPI } from "./utkonos/api_legacy";
import { utkonosNewAPI } from "./utkonos/api_new";


export default function App() {
  const [visible, setVisible] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const [progressState, setProgressState] = useState<string | null>(null)

  const onNewVersion = useMemo(() => {
    return Cookies.get('CanaryReleaseRouteV4') === 'lo'
  }, [])


  useOnCartItemsHandler(() => setProgressState(null))
  useKeyboardHandler(ev => ev.key == 'Escape', () => setVisible(!visible), [visible])

  const save = useCallback(() => {
    if (editorRef.current == null) return

    const items = extractData(editorRef.current)
    if (items.length == 0) {
      console.log('no data extracted')
      return
    }

    console.log('adding items', items)
    let saveCart: (() => Promise<void>) | undefined
    if (onNewVersion) {
      saveCart = async () => {
        let i = 0
        for (const item of items) {
          i++
          setProgressState(`${i} из ${items.length}`)
          await utkonosNewAPI.modifyCartItem(item)
        }
      }
    } else {
      saveCart = async () => {
        await utkonosLegacyAPI.saveCart(items)
      }
    }

    saveCart().then(() => {
      window.location.reload()
      // @ts-ignore
      // rrToUtkAdapter.modifyItemAtCart(items[0]) // fake cart modification to trigger reload
    }).catch((err: unknown) => {
      console.log('failed to save', err)
      alert(`Не удалось сохранить: ${err}`)
      window.location.reload()
    })
  }, [])

  return (
    <React.StrictMode>
      {visible && (
        <Root>
          <TextArea
            contentEditable={true}
            ref={editorRef}
          />
          <Notes>
            <div>
              {onNewVersion ? "Версия сайта новая" : "Версия сайта старая"}
            </div>
          </Notes>
          <Button onClick={save} disabled={!!progressState}>
            {progressState && `Сохраняем... ${progressState}`}
            {!progressState && "Добавить"}
          </Button>
        </Root>
      )}
      <Badge onClick={() => setVisible(!visible)} />
    </React.StrictMode>
  )
}

function useOnCartItemsHandler(cb: () => void) {
  useEffect(() => {
    setTimeout(() => {
      // @ts-ignore
      rrToUtkAdapter.onCartItems(cb)
    }, 1000)
  }, [])
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


const Root = styled.div`
  position: fixed;
  width: 400px;
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