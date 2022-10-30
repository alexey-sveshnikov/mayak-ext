import React from "react";
import ReactDOM from "react-dom";
import App from "./App";


const params = new URLSearchParams((document.currentScript as HTMLScriptElement).src.split('?')[1]);
const promocode = params.get('promocode') || ''

console.log(`[utkonos-ext] initializing (with promocode: "${promocode}")`)

const root = document.createElement('div')
document.body.appendChild(root)

ReactDOM.render(<App promocode={promocode} />, root)
