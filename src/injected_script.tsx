import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

console.log('[utkonos-ext] initializing')

const root = document.createElement('div')
document.body.appendChild(root)

ReactDOM.render(<App />, root)
