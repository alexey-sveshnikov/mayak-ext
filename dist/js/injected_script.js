(()=>{"use strict";var e,t={8957:function(e,t,n){var o=this&&this.__createBinding||(Object.create?function(e,t,n,o){void 0===o&&(o=n);var r=Object.getOwnPropertyDescriptor(t,n);r&&!("get"in r?!t.__esModule:r.writable||r.configurable)||(r={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,o,r)}:function(e,t,n,o){void 0===o&&(o=n),e[o]=t[n]}),r=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),i=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&o(t,e,n);return r(t,e),t},a=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(r,i){function a(e){try{c(o.next(e))}catch(e){i(e)}}function l(e){try{c(o.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,l)}c((o=o.apply(e,t||[])).next())}))},l=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const c=i(n(7294)),u=l(n(677)),s=n(1225),d=n(710),f=l(n(2791));t.default=function(e){const[t,n]=(0,c.useState)(!1),o=(0,c.useRef)(null),[r,i]=(0,c.useState)(null),[l,u]=(0,c.useState)([]),[x,y]=(0,c.useState)([]),_=e.promocode;var w,k,O;w=e=>"Escape"==e.key,k=()=>n(!t),O=[t],(0,c.useEffect)((()=>{const e=e=>{w(e)&&k()};return document.addEventListener("keyup",e),()=>{document.removeEventListener("keyup",e)}}),O);const E=(0,c.useCallback)((()=>{u([]);const e=[];o.current&&setTimeout((()=>{if(!o.current)return;var t;o.current&&(function(e){let t;const n=document.createNodeIterator(e,NodeFilter.SHOW_ALL);for(;t=n.nextNode();)t.removeAttribute&&t.removeAttribute("style")}(t=o.current),function(e){let t;const n=document.createNodeIterator(e,NodeFilter.SHOW_ALL);for(;t=n.nextNode();)"A"==t.tagName&&t.setAttribute("target","_blank")}(t));const{cartItems:n,rejectedRows:r,withCounts:i}=(0,s.extractData)(o.current);i||u(["Не удалось распознать колонку таблицы с количествами – везде будут '1'",...e]),y(n)}),100)}),[o,l]),j=(0,c.useCallback)((()=>a(this,void 0,void 0,(function*(){}))),[_,l]),P=(0,c.useCallback)((()=>{u([]);const e=[];(()=>a(this,void 0,void 0,(function*(){console.log("adding items",x),i("Проверяем наличие...");const t=yield d.lentaAPI.saveCart(x);for(const e of t.rejectedItems)console.log("item is failed to save: ",e),console.log("error was: ",e.error),x.find((t=>t.id===e.id)).error=e.error;if(y([...x]),t.success)return t.validItems.length;{i("Сохраняем...");const n=yield d.lentaAPI.saveCart(t.validItems);if(n.success)return n.validItems.length;throw u(["Ошибка при сохранении, должно помочь повторное сохранение",...e]),new Error}})))().then((t=>{u([`Сохранили успешно ${t} товаров из ${x.length}.`,"Товары, которые не удалось сохранить отмечены красным цветом","Изменения в корзине будут видны после перезагрузки страницы",...e]),i(null)})).catch((e=>{i(null),console.log("failed to save",e),alert(`Не удалось сохранить: ${e}`)}))}),[j,x]);return c.default.createElement(c.default.StrictMode,null,t&&c.default.createElement(p,{className:"utkonos-ext-root"},x.length>0&&c.default.createElement(f.default,{items:x}),0==x.length&&c.default.createElement(h,{contentEditable:!0,ref:o,onPaste:E}),c.default.createElement(m,null,_&&c.default.createElement("div",null,"Используется промокод ",_),l.map((e=>c.default.createElement("div",{key:e},e)))),c.default.createElement(v,{onClick:P,disabled:!!r||!x.length},null!=r?r:"Добавить"),x.length>0&&c.default.createElement(b,{onClick:()=>y([])},"❌")),c.default.createElement(g,{onClick:()=>n(!t)}))};const p=u.default.div`
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
`,h=u.default.div`
  height: 100%;
  width: 100%;
  border-radius: 7px;
  background: white;
  overflow: scroll;
  
  font-size: 0.8em;
  
  padding: 5px 10px;
`,m=u.default.div`
  font-size: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`,v=u.default.button`
  margin: 5px;
  border: 1px solid black;
  border-radius: 3px;
`,g=u.default.div`
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
`,b=u.default.a`
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
`},710:function(e,t,n){var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(r,i){function a(e){try{c(o.next(e))}catch(e){i(e)}}function l(e){try{c(o.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,l)}c((o=o.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.lentaAPI=t.LentaAPI=void 0;const r=n(5431);class i{saveCart(e){return o(this,void 0,void 0,(function*(){const t=e.map((e=>({skuCode:e.id.toString(),quantity:e.quantity,isPostedFromCartPage:!0}))),[n,o]=yield this.makeRequest("/api/v2/ecom/cart/skus",t);if(200==n)return{success:!0,validItems:e,rejectedItems:[]};{const t=[];for(const n of o){const o=e.find((e=>{var t;return e.id.toString()==(null===(t=n.errorSkus[0])||void 0===t?void 0:t.skuCode)}));o?t.push(Object.assign(Object.assign({},o),{error:n.errorMessage})):console.error("unexpected item in the response data",n)}const r=new Set;for(const e of t)r.add(e.id);return{success:200===n,rejectedItems:t,validItems:e.filter((e=>!r.has(e.id)))}}}))}makeRequest(e,t){return o(this,void 0,void 0,(function*(){const n=yield fetch("https://lenta.com"+e,{headers:{accept:"application/json","accept-language":"en-US,en;q=0.9,ru;q=0.8","content-type":"application/json"},referrer:"https://lenta.com/order/cart/",referrerPolicy:"strict-origin-when-cross-origin",body:JSON.stringify(t),method:"POST",mode:"cors",credentials:"include"});if(n.status>=500)throw new r.StoreException(n.statusText);return[n.status,yield n.json()]}))}}t.LentaAPI=i,t.lentaAPI=new i},5431:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.StoreException=void 0;class n extends Error{constructor(e){super(e),this.name="StoreException"}}t.StoreException=n},2791:function(e,t,n){var o=this&&this.__createBinding||(Object.create?function(e,t,n,o){void 0===o&&(o=n);var r=Object.getOwnPropertyDescriptor(t,n);r&&!("get"in r?!t.__esModule:r.writable||r.configurable)||(r={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,o,r)}:function(e,t,n,o){void 0===o&&(o=n),e[o]=t[n]}),r=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),i=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&o(t,e,n);return r(t,e),t},a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const l=i(n(7294)),c=a(n(677));t.default=function({items:e}){const t=(0,l.useCallback)((e=>e.error?"#ffb0b0":e.warning?"lightgrey":"white"),[]);return l.default.createElement(u,null,e.map((e=>l.default.createElement(s,{key:e.id,style:{background:t(e)}},l.default.createElement(f,null,l.default.createElement(p,null,l.default.createElement(d,{href:`/product/${e.id}/`,target:"_blank"},e.name)),l.default.createElement(p,null,e.quantity," шт")),e.error&&l.default.createElement(h,null,e.error),e.warning&&l.default.createElement(m,null,"Не удалось определить количество")))))};const u=c.default.div`
  display: flex;
  flex-direction: column;
  background: #444;
  overflow: auto;
  overscroll-behavior: contain;
  gap: 1px;
  width: 100%;
`,s=c.default.div`
  flex: 0 0 3em;
  padding: 8px;
  background: white;
  
  display: flex;
  flex-direction:column;
  gap: 9px;
`,d=c.default.a`
  text-decoration: none;
  color: black;
`,f=c.default.div`
  display: flex;
  justify-content: space-between;
`,p=c.default.div`
  display: flex
`,h=c.default.div`
  font-weight: 500;
  color: black;
`,m=c.default.div`
  font-size: 1.2em;
`},5311:function(e,t,n){var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const r=o(n(7294)),i=o(n(3935)),a=o(n(8957)),l=new URLSearchParams(document.currentScript.src.split("?")[1]).get("promocode")||"";console.log(`[utkonos-ext] initializing (with promocode: "${l}")`);const c=document.createElement("div");document.body.appendChild(c),i.default.render(r.default.createElement(a.default,{promocode:l}),c)},923:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.extractFromTable=void 0;const o=n(9385);n(8446),n(4788),n(6026),t.extractFromTable=function(e){var t;const[n,r]=function(e){const t=(0,o.doXpath)(".//tr",e),n=[];for(const e of t){const t=[];for(const n of e.childNodes){const e=document.evaluate(".//a",n,null,XPathResult.ANY_TYPE).iterateNext();null!==e&&e instanceof HTMLElement&&t.push(e.getAttribute("href")||""),t.push(n.textContent||"")}n.push(t)}return[n,t]}(e);if(0==n.length)return{cartItems:[],rejectedRows:[]};console.log("table data"),console.table(n);const i=function(e){var t;let n=e.map((e=>e.map((e=>e.replace(/\s*(штук|шт)\.?\s*/gi,"")))));n=n.filter((e=>e.filter((e=>!isNaN(parseFloat(null==e?void 0:e.trim())))).length>0));const o=Math.round(n.map((e=>e.filter((e=>!!(null==e?void 0:e.trim()))).length)).reduce(((e,t)=>e+t),0)/n.length);n=n.filter((e=>e.filter((e=>!!(null==e?void 0:e.trim()))).length==o)),console.log("Detecting quantities column. This is the filtered data"),console.table(n);for(let e=0;e<(null===(t=n[0])||void 0===t?void 0:t.length);e++){const t=n.map((t=>t[e])),o=t.map((e=>parseFloat(null==e?void 0:e.trim())));if(void 0!==o.find(isNaN)){console.log(`column ${e} is not all numbers`);continue}if(o.every(((e,t)=>0===t||e>o[t-1]))){console.log(`column ${e} looks like a row numbers`);continue}const r=o.reduce(((e,t)=>e+t),0)/t.length,i=o.filter((e=>Math.round(e)==e)).length/t.length;if(r<15&&i>.5)return console.log(`column ${e} seems to have a quantities`),e;console.log(`column ${e} ignored. Average value: ${r}, rate of rounded values: ${i})`)}}(n);if(void 0===i)return console.log("can't find quantities column"),{cartItems:[],rejectedRows:[]};const a=[],l=[];for(let e=0;e<n.length;e++){const o=n[e];if(0==o.filter((e=>!isNaN(parseFloat(null==e?void 0:e.trim())))).length){console.log("filter out possible header of footer row: ",o);continue}let c=!1,u=parseInt(o[i]);u||(console.log(`can't parse quantity from column ${i}. Using default value. Row: `,o),u=1,c=!0);const s=o.find((e=>-1!=e.indexOf("utkonos.ru")));if(!s){console.log("can't find link for this row",o),l.push(r[e]);continue}const d=parseInt((null===(t=s.match(/utkonos\.ru\/item\/(\d+)/))||void 0===t?void 0:t[1])||"");if(!d){console.log(`can't find ID for this link: ${s}, row: `,o),l.push(r[e]);continue}const f=new RegExp(/[а-яА-Я]{5,}/),p=o.find((e=>-1!==e.replace(/\s+/,"").search(f)));a.push({id:d,quantity:u,name:p||s,tableRow:r[e],warning:c})}return{cartItems:a,rejectedRows:l}}},3187:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.extractFromUnstructuredText=void 0;const o=n(9385);t.extractFromUnstructuredText=function(e){const t=[],n=(0,o.doXpath)(".//a",e);for(const e of n)if(e instanceof HTMLElement){const n=e.getAttribute("href");n&&t.push(n)}const r=t.join("\n")+e.textContent,i=[],a=new Set;for(const e of r.matchAll(/utkonos\.ru\/item\/(\d+)/g)){const t=e[1];a.has(t)||(a.add(t),i.push({id:parseInt(t),quantity:1,name:`https://utkonos.ru/item/${t}/`}))}return i}},1225:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.extractData=void 0;const o=n(923),r=n(3187);t.extractData=function(e){if(1==document.evaluate("count(.//table)",e,null,XPathResult.NUMBER_TYPE).numberValue){const{cartItems:t,rejectedRows:n}=(0,o.extractFromTable)(e);if(t.length>0)return{withCounts:!0,cartItems:t,rejectedRows:n}}return{cartItems:(0,r.extractFromUnstructuredText)(e),rejectedRows:[],withCounts:!1}}},9385:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.doXpath=void 0,t.doXpath=function(e,t,n=XPathResult.ORDERED_NODE_ITERATOR_TYPE){const o=[],r=document.evaluate(e,t,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE);let i=r.iterateNext();for(;i;)i instanceof HTMLElement&&o.push(i),i=r.iterateNext();return o}}},n={};function o(e){var r=n[e];if(void 0!==r)return r.exports;var i=n[e]={id:e,loaded:!1,exports:{}};return t[e].call(i.exports,i,i.exports,o),i.loaded=!0,i.exports}o.m=t,e=[],o.O=(t,n,r,i)=>{if(!n){var a=1/0;for(s=0;s<e.length;s++){for(var[n,r,i]=e[s],l=!0,c=0;c<n.length;c++)(!1&i||a>=i)&&Object.keys(o.O).every((e=>o.O[e](n[c])))?n.splice(c--,1):(l=!1,i<a&&(a=i));if(l){e.splice(s--,1);var u=r();void 0!==u&&(t=u)}}return t}i=i||0;for(var s=e.length;s>0&&e[s-1][2]>i;s--)e[s]=e[s-1];e[s]=[n,r,i]},o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),o.j=575,(()=>{var e={575:0};o.O.j=t=>0===e[t];var t=(t,n)=>{var r,i,[a,l,c]=n,u=0;if(a.some((t=>0!==e[t]))){for(r in l)o.o(l,r)&&(o.m[r]=l[r]);if(c)var s=c(o)}for(t&&t(n);u<a.length;u++)i=a[u],o.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return o.O(s)},n=self.webpackChunkutkonos_ext=self.webpackChunkutkonos_ext||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})(),o.nc=void 0;var r=o.O(void 0,[736],(()=>o(5311)));r=o.O(r)})();