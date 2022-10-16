/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/App.tsx":
/*!*********************!*\
  !*** ./src/App.tsx ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importStar(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
const styled_components_1 = __importDefault(__webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js"));
const parsing_1 = __webpack_require__(/*! ./parsing */ "./src/parsing/index.ts");
const api_1 = __webpack_require__(/*! ./utkonos/api */ "./src/utkonos/api.ts");
function App() {
    const [visible, setVisible] = (0, react_1.useState)(false);
    const editorRef = (0, react_1.useRef)(null);
    const [showProgress, setShowProgress] = (0, react_1.useState)(false);
    useOnCartItemsHandler(() => setShowProgress(false));
    useKeyboardHandler(ev => ev.key == 'Escape', () => setVisible(!visible), [visible]);
    const save = (0, react_1.useCallback)(() => {
        if (editorRef.current == null)
            return;
        const items = (0, parsing_1.extractData)(editorRef.current);
        if (items.length == 0) {
            console.log('no data extracted');
            return;
        }
        console.log('adding items', items);
        setShowProgress(true);
        api_1.utkonosAPI.saveCart(items).then(() => {
            // @ts-ignore
            rrToUtkAdapter.modifyItemAtCart(items[0]); // fake cart modification to trigger reload
        });
    }, []);
    return (react_1.default.createElement(react_1.default.StrictMode, null,
        visible && (react_1.default.createElement(Root, null,
            react_1.default.createElement(TextArea, { contentEditable: true, ref: editorRef }),
            react_1.default.createElement(Button, { onClick: save, disabled: showProgress },
                showProgress && "Сохраняем...",
                !showProgress && "Добавить"))),
        react_1.default.createElement(Badge, { onClick: () => setVisible(!visible) })));
}
exports["default"] = App;
function useOnCartItemsHandler(cb) {
    (0, react_1.useEffect)(() => {
        setTimeout(() => {
            // @ts-ignore
            rrToUtkAdapter.onCartItems(cb);
        }, 1000);
    }, []);
}
function useKeyboardHandler(filter, cb, deps) {
    (0, react_1.useEffect)(() => {
        const handler = (ev) => {
            if (filter(ev))
                cb();
        };
        document.addEventListener('keyup', handler);
        return () => {
            document.removeEventListener('keyup', handler);
        };
    }, deps);
}
const Root = styled_components_1.default.div `
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
const TextArea = styled_components_1.default.div `
  height: 100%;
  width: 100%;
  border-radius: 7px;
  background: white;
  overflow: scroll;
  
  padding: 5px 10px;
`;
const Button = styled_components_1.default.button `
  margin: 5px;
  border: 1px solid black;
  border-radius: 3px;
`;
const Badge = styled_components_1.default.div `
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


/***/ }),

/***/ "./src/injected_script.tsx":
/*!*********************************!*\
  !*** ./src/injected_script.tsx ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importDefault(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
const react_dom_1 = __importDefault(__webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js"));
const App_1 = __importDefault(__webpack_require__(/*! ./App */ "./src/App.tsx"));
console.log('[utkonos-ext] initializing');
const root = document.createElement('div');
document.body.appendChild(root);
react_dom_1.default.render(react_1.default.createElement(App_1.default, null), root);


/***/ }),

/***/ "./src/parsing/extract_from_table.ts":
/*!*******************************************!*\
  !*** ./src/parsing/extract_from_table.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extractFromTable = void 0;
const xpath_1 = __webpack_require__(/*! ../sdk/xpath */ "./src/sdk/xpath.ts");
const isEqual = __webpack_require__(/*! lodash/isEqual */ "./node_modules/lodash/isEqual.js");
const zip = __webpack_require__(/*! lodash/zip */ "./node_modules/lodash/zip.js");
const range = __webpack_require__(/*! lodash/range */ "./node_modules/lodash/range.js");
function extractFromTable(element) {
    const tableData = parseTable(element);
    if (tableData.length == 0)
        return [];
    let links = [];
    let quantities = [];
    // check if the first row looks like a header (no number values)
    if (tableData[0].filter(item => !isNaN(parseFloat(item.trim()))).length == 0) {
        tableData.shift();
    }
    console.log("table data");
    console.table(tableData);
    for (let i = 0; i < tableData[0].length; i++) {
        const columnData = tableData.map(row => row[i]);
        if (tableData[0][i].indexOf('utkonos.ru') != -1) {
            console.log(`column ${i} seems to contain links`);
            links = columnData;
            continue;
        }
        const numericValues = columnData.map(x => parseFloat(x));
        if (numericValues.find(isNaN) !== undefined) {
            console.log(`column ${i} is not all numbers`);
            continue;
        }
        if (isEqual(numericValues, range(1, tableData.length + 1))) {
            console.log(`column ${i} looks like a row numbers`);
            continue;
        }
        const avgValue = numericValues.reduce((result, item) => result + item, 0) / columnData.length;
        const rateOfRoundValues = numericValues.filter(x => Math.round(x) == x).length / columnData.length;
        if (avgValue < 15 && rateOfRoundValues > 0.5) {
            console.log(`column ${i} seems to have a quantities`);
            quantities = numericValues;
            continue;
        }
        console.log(`column ${i} ignored. Average value: ${avgValue}, rate of rounded values: ${rateOfRoundValues})`);
    }
    const ids = links
        .map(link => { var _a; return (_a = link.match(/utkonos\.ru\/item\/(\d+)/)) === null || _a === void 0 ? void 0 : _a[1]; })
        .map(x => parseInt(x || ''))
        .filter(Boolean);
    if (ids.length == quantities.length) {
        return ids.map((id, i) => ({
            id: id,
            quantity: quantities[i],
        }));
    }
    return ids.map(id => ({
        id: id,
        quantity: 1,
    }));
}
exports.extractFromTable = extractFromTable;
// Returns a text content of a table (and link targets)
function parseTable(element) {
    const rowElements = (0, xpath_1.doXpath)('.//tr', element);
    const tableData = [];
    for (const rowElement of rowElements) {
        const rowData = [];
        for (const cell of rowElement.childNodes) {
            const link = document.evaluate('.//a', cell, null, XPathResult.ANY_TYPE).iterateNext();
            if (link !== null) {
                const url = link instanceof HTMLElement ? link.getAttribute('href') : link.textContent;
                rowData.push(url || '');
            }
            else {
                rowData.push(cell.textContent || '');
            }
        }
        tableData.push(rowData);
    }
    return tableData;
}


/***/ }),

/***/ "./src/parsing/extract_unstructured.ts":
/*!*********************************************!*\
  !*** ./src/parsing/extract_unstructured.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extractFromUnstructuredText = void 0;
const xpath_1 = __webpack_require__(/*! ../sdk/xpath */ "./src/sdk/xpath.ts");
function extractFromUnstructuredText(element) {
    const links = [];
    const linkElements = (0, xpath_1.doXpath)('.//a', element);
    for (const el of linkElements) {
        if (el instanceof HTMLElement) {
            const href = el.getAttribute('href');
            if (href) {
                links.push(href);
            }
        }
    }
    const text = links.join("\n") + element.textContent;
    const items = [];
    const seenItems = new Set();
    for (const m of text.matchAll(/https:\/\/www\.utkonos\.ru\/item\/(\d+)/g)) {
        const id = m[1];
        if (seenItems.has(id)) {
            continue;
        }
        seenItems.add(id);
        items.push({
            id: parseInt(id),
            quantity: 1,
        });
    }
    return items;
}
exports.extractFromUnstructuredText = extractFromUnstructuredText;


/***/ }),

/***/ "./src/parsing/index.ts":
/*!******************************!*\
  !*** ./src/parsing/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extractData = void 0;
const extract_from_table_1 = __webpack_require__(/*! ./extract_from_table */ "./src/parsing/extract_from_table.ts");
const extract_unstructured_1 = __webpack_require__(/*! ./extract_unstructured */ "./src/parsing/extract_unstructured.ts");
function extractData(el) {
    if (document.evaluate('count(.//table)', el, null, XPathResult.NUMBER_TYPE).numberValue == 1) {
        const data = (0, extract_from_table_1.extractFromTable)(el);
        if (data.length > 0)
            return data;
    }
    return (0, extract_unstructured_1.extractFromUnstructuredText)(el);
}
exports.extractData = extractData;


/***/ }),

/***/ "./src/sdk/helpers.ts":
/*!****************************!*\
  !*** ./src/sdk/helpers.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.uuidv4 = void 0;
// https://stackoverflow.com/a/2117523
function uuidv4() {
    // @ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}
exports.uuidv4 = uuidv4;


/***/ }),

/***/ "./src/sdk/xpath.ts":
/*!**************************!*\
  !*** ./src/sdk/xpath.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.doXpath = void 0;
function doXpath(query, root, resultType = XPathResult.ORDERED_NODE_ITERATOR_TYPE) {
    const result = [];
    const xp = document.evaluate('.//tr', root, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
    let item = xp.iterateNext();
    while (item) {
        if (item instanceof HTMLElement) {
            result.push(item);
        }
        item = xp.iterateNext();
    }
    return result;
}
exports.doXpath = doXpath;


/***/ }),

/***/ "./src/utkonos/api.ts":
/*!****************************!*\
  !*** ./src/utkonos/api.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.utkonosAPI = void 0;
const Cookies = __importStar(__webpack_require__(/*! es-cookie */ "./node_modules/es-cookie/src/es-cookie.js"));
const helpers_1 = __webpack_require__(/*! ../sdk/helpers */ "./src/sdk/helpers.ts");
class UtkonosAPI {
    saveCart(items) {
        return __awaiter(this, void 0, void 0, function* () {
            const ids = [];
            const quantities = [];
            for (const item of items) {
                ids.push(item.id.toString());
                quantities.push(item.quantity);
            }
            const requestBody = {
                "GoodsItemId": ids,
                "Count": quantities,
                "UseDelta": 0,
                "Return": { "Cart": "0", "CartItemList": "0", "TotalCost": "0" }
            };
            return this.makeRequest("cartItemMultiAdd", requestBody);
        });
    }
    makeRequest(method, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceData = JSON.parse(localStorage.getItem('device_data') || '{}');
            const sessionToken = yield Cookies.get('Utk_SessionToken');
            const request = {
                "Head": {
                    "DeviceId": deviceData['device_id'],
                    "Domain": "www.utkonos.ru",
                    "RequestId": (0, helpers_1.uuidv4)().replaceAll(/-/g, ''),
                    "MarketingPartnerKey": "mp-cc3c743ffd17487a9021d11129548218",
                    "Version": "utkonos-ext",
                    "Client": "utkonos-ext",
                    "Method": method,
                    "Store": "utk",
                    "SessionToken": sessionToken,
                    "Body": requestBody,
                },
            };
            console.log("sending request to method", method, request);
            const formData = new FormData();
            formData.append("request", JSON.stringify(request));
            const response = yield fetch(`https://www.utkonos.ru/api/v1/${method}`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-US,en;q=0.9,ru;q=0.8",
                    "cache-control": "no-cache",
                    "pragma": "no-cache",
                    "sec-ch-ua": "\"Chromium\";v=\"106\", \"Google Chrome\";v=\"106\", \"Not;A=Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                "referrer": "https://www.utkonos.ru/",
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": formData,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });
            console.log(response);
            return response;
        });
    }
}
exports.utkonosAPI = new UtkonosAPI();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"injected_script": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkutkonos_ext"] = self["webpackChunkutkonos_ext"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./src/injected_script.tsx")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NKQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1dDaERBOzs7OztVRUFBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly91dGtvbm9zLWV4dC8uL3NyYy9BcHAudHN4Iiwid2VicGFjazovL3V0a29ub3MtZXh0Ly4vc3JjL2luamVjdGVkX3NjcmlwdC50c3giLCJ3ZWJwYWNrOi8vdXRrb25vcy1leHQvLi9zcmMvcGFyc2luZy9leHRyYWN0X2Zyb21fdGFibGUudHMiLCJ3ZWJwYWNrOi8vdXRrb25vcy1leHQvLi9zcmMvcGFyc2luZy9leHRyYWN0X3Vuc3RydWN0dXJlZC50cyIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC8uL3NyYy9wYXJzaW5nL2luZGV4LnRzIiwid2VicGFjazovL3V0a29ub3MtZXh0Ly4vc3JjL3Nkay9oZWxwZXJzLnRzIiwid2VicGFjazovL3V0a29ub3MtZXh0Ly4vc3JjL3Nkay94cGF0aC50cyIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC8uL3NyYy91dGtvbm9zL2FwaS50cyIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL3V0a29ub3MtZXh0L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3V0a29ub3MtZXh0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL3V0a29ub3MtZXh0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdXRrb25vcy1leHQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC93ZWJwYWNrL3J1bnRpbWUvbm9kZSBtb2R1bGUgZGVjb3JhdG9yIiwid2VicGFjazovL3V0a29ub3MtZXh0L3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL3V0a29ub3MtZXh0L3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3V0a29ub3MtZXh0L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHJlYWN0XzEgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcInJlYWN0XCIpKTtcbmNvbnN0IHN0eWxlZF9jb21wb25lbnRzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcInN0eWxlZC1jb21wb25lbnRzXCIpKTtcbmNvbnN0IHBhcnNpbmdfMSA9IHJlcXVpcmUoXCIuL3BhcnNpbmdcIik7XG5jb25zdCBhcGlfMSA9IHJlcXVpcmUoXCIuL3V0a29ub3MvYXBpXCIpO1xuZnVuY3Rpb24gQXBwKCkge1xuICAgIGNvbnN0IFt2aXNpYmxlLCBzZXRWaXNpYmxlXSA9ICgwLCByZWFjdF8xLnVzZVN0YXRlKShmYWxzZSk7XG4gICAgY29uc3QgZWRpdG9yUmVmID0gKDAsIHJlYWN0XzEudXNlUmVmKShudWxsKTtcbiAgICBjb25zdCBbc2hvd1Byb2dyZXNzLCBzZXRTaG93UHJvZ3Jlc3NdID0gKDAsIHJlYWN0XzEudXNlU3RhdGUpKGZhbHNlKTtcbiAgICB1c2VPbkNhcnRJdGVtc0hhbmRsZXIoKCkgPT4gc2V0U2hvd1Byb2dyZXNzKGZhbHNlKSk7XG4gICAgdXNlS2V5Ym9hcmRIYW5kbGVyKGV2ID0+IGV2LmtleSA9PSAnRXNjYXBlJywgKCkgPT4gc2V0VmlzaWJsZSghdmlzaWJsZSksIFt2aXNpYmxlXSk7XG4gICAgY29uc3Qgc2F2ZSA9ICgwLCByZWFjdF8xLnVzZUNhbGxiYWNrKSgoKSA9PiB7XG4gICAgICAgIGlmIChlZGl0b3JSZWYuY3VycmVudCA9PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCBpdGVtcyA9ICgwLCBwYXJzaW5nXzEuZXh0cmFjdERhdGEpKGVkaXRvclJlZi5jdXJyZW50KTtcbiAgICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbm8gZGF0YSBleHRyYWN0ZWQnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZygnYWRkaW5nIGl0ZW1zJywgaXRlbXMpO1xuICAgICAgICBzZXRTaG93UHJvZ3Jlc3ModHJ1ZSk7XG4gICAgICAgIGFwaV8xLnV0a29ub3NBUEkuc2F2ZUNhcnQoaXRlbXMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgcnJUb1V0a0FkYXB0ZXIubW9kaWZ5SXRlbUF0Q2FydChpdGVtc1swXSk7IC8vIGZha2UgY2FydCBtb2RpZmljYXRpb24gdG8gdHJpZ2dlciByZWxvYWRcbiAgICAgICAgfSk7XG4gICAgfSwgW10pO1xuICAgIHJldHVybiAocmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQocmVhY3RfMS5kZWZhdWx0LlN0cmljdE1vZGUsIG51bGwsXG4gICAgICAgIHZpc2libGUgJiYgKHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFJvb3QsIG51bGwsXG4gICAgICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChUZXh0QXJlYSwgeyBjb250ZW50RWRpdGFibGU6IHRydWUsIHJlZjogZWRpdG9yUmVmIH0pLFxuICAgICAgICAgICAgcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IG9uQ2xpY2s6IHNhdmUsIGRpc2FibGVkOiBzaG93UHJvZ3Jlc3MgfSxcbiAgICAgICAgICAgICAgICBzaG93UHJvZ3Jlc3MgJiYgXCLQodC+0YXRgNCw0L3Rj9C10LwuLi5cIixcbiAgICAgICAgICAgICAgICAhc2hvd1Byb2dyZXNzICYmIFwi0JTQvtCx0LDQstC40YLRjFwiKSkpLFxuICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChCYWRnZSwgeyBvbkNsaWNrOiAoKSA9PiBzZXRWaXNpYmxlKCF2aXNpYmxlKSB9KSkpO1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gQXBwO1xuZnVuY3Rpb24gdXNlT25DYXJ0SXRlbXNIYW5kbGVyKGNiKSB7XG4gICAgKDAsIHJlYWN0XzEudXNlRWZmZWN0KSgoKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgcnJUb1V0a0FkYXB0ZXIub25DYXJ0SXRlbXMoY2IpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICB9LCBbXSk7XG59XG5mdW5jdGlvbiB1c2VLZXlib2FyZEhhbmRsZXIoZmlsdGVyLCBjYiwgZGVwcykge1xuICAgICgwLCByZWFjdF8xLnVzZUVmZmVjdCkoKCkgPT4ge1xuICAgICAgICBjb25zdCBoYW5kbGVyID0gKGV2KSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyKGV2KSlcbiAgICAgICAgICAgICAgICBjYigpO1xuICAgICAgICB9O1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZXIpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVyKTtcbiAgICAgICAgfTtcbiAgICB9LCBkZXBzKTtcbn1cbmNvbnN0IFJvb3QgPSBzdHlsZWRfY29tcG9uZW50c18xLmRlZmF1bHQuZGl2IGBcbiAgcG9zaXRpb246IGZpeGVkO1xuICB3aWR0aDogNDAwcHg7XG4gIGhlaWdodDogODB2aDtcbiAgdG9wOiBjYWxjKDUwJSAtIDQwdmgpO1xuICByaWdodDogNXB4O1xuICBiYWNrZ3JvdW5kOiAjZmZkOWQ5O1xuICB6LWluZGV4OiAxMDAwO1xuICBib3JkZXI6IDFweCBzb2xpZCAjNTU1O1xuICBib3JkZXItcmFkaXVzOiA3cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuYDtcbmNvbnN0IFRleHRBcmVhID0gc3R5bGVkX2NvbXBvbmVudHNfMS5kZWZhdWx0LmRpdiBgXG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6IDEwMCU7XG4gIGJvcmRlci1yYWRpdXM6IDdweDtcbiAgYmFja2dyb3VuZDogd2hpdGU7XG4gIG92ZXJmbG93OiBzY3JvbGw7XG4gIFxuICBwYWRkaW5nOiA1cHggMTBweDtcbmA7XG5jb25zdCBCdXR0b24gPSBzdHlsZWRfY29tcG9uZW50c18xLmRlZmF1bHQuYnV0dG9uIGBcbiAgbWFyZ2luOiA1cHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xuICBib3JkZXItcmFkaXVzOiAzcHg7XG5gO1xuY29uc3QgQmFkZ2UgPSBzdHlsZWRfY29tcG9uZW50c18xLmRlZmF1bHQuZGl2IGBcbiAgcG9zaXRpb246IGZpeGVkO1xuICBoZWlnaHQ6IDczcHg7XG4gIHdpZHRoOiAzNnB4O1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuICB6LWluZGV4OiAxMDAwO1xuICBiYWNrZ3JvdW5kOiB1cmwoaHR0cHM6Ly9tYXlhay5oZWxwL3dwLWNvbnRlbnQvdGhlbWVzL21heWFrL2ltZy9sb2dvLnBuZyk7XG4gIHRyYW5zZm9ybTogc2NhbGUoMC44KTtcbiAgLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luLXg6IHJpZ2h0O1xuICAtd2Via2l0LXRyYW5zZm9ybS1vcmlnaW4teTogdG9wO1xuYDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgcmVhY3RfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwicmVhY3RcIikpO1xuY29uc3QgcmVhY3RfZG9tXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcInJlYWN0LWRvbVwiKSk7XG5jb25zdCBBcHBfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9BcHBcIikpO1xuY29uc29sZS5sb2coJ1t1dGtvbm9zLWV4dF0gaW5pdGlhbGl6aW5nJyk7XG5jb25zdCByb290ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJvb3QpO1xucmVhY3RfZG9tXzEuZGVmYXVsdC5yZW5kZXIocmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoQXBwXzEuZGVmYXVsdCwgbnVsbCksIHJvb3QpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmV4dHJhY3RGcm9tVGFibGUgPSB2b2lkIDA7XG5jb25zdCB4cGF0aF8xID0gcmVxdWlyZShcIi4uL3Nkay94cGF0aFwiKTtcbmNvbnN0IGlzRXF1YWwgPSByZXF1aXJlKFwibG9kYXNoL2lzRXF1YWxcIik7XG5jb25zdCB6aXAgPSByZXF1aXJlKFwibG9kYXNoL3ppcFwiKTtcbmNvbnN0IHJhbmdlID0gcmVxdWlyZShcImxvZGFzaC9yYW5nZVwiKTtcbmZ1bmN0aW9uIGV4dHJhY3RGcm9tVGFibGUoZWxlbWVudCkge1xuICAgIGNvbnN0IHRhYmxlRGF0YSA9IHBhcnNlVGFibGUoZWxlbWVudCk7XG4gICAgaWYgKHRhYmxlRGF0YS5sZW5ndGggPT0gMClcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIGxldCBsaW5rcyA9IFtdO1xuICAgIGxldCBxdWFudGl0aWVzID0gW107XG4gICAgLy8gY2hlY2sgaWYgdGhlIGZpcnN0IHJvdyBsb29rcyBsaWtlIGEgaGVhZGVyIChubyBudW1iZXIgdmFsdWVzKVxuICAgIGlmICh0YWJsZURhdGFbMF0uZmlsdGVyKGl0ZW0gPT4gIWlzTmFOKHBhcnNlRmxvYXQoaXRlbS50cmltKCkpKSkubGVuZ3RoID09IDApIHtcbiAgICAgICAgdGFibGVEYXRhLnNoaWZ0KCk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwidGFibGUgZGF0YVwiKTtcbiAgICBjb25zb2xlLnRhYmxlKHRhYmxlRGF0YSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWJsZURhdGFbMF0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgY29sdW1uRGF0YSA9IHRhYmxlRGF0YS5tYXAocm93ID0+IHJvd1tpXSk7XG4gICAgICAgIGlmICh0YWJsZURhdGFbMF1baV0uaW5kZXhPZigndXRrb25vcy5ydScpICE9IC0xKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgY29sdW1uICR7aX0gc2VlbXMgdG8gY29udGFpbiBsaW5rc2ApO1xuICAgICAgICAgICAgbGlua3MgPSBjb2x1bW5EYXRhO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbnVtZXJpY1ZhbHVlcyA9IGNvbHVtbkRhdGEubWFwKHggPT4gcGFyc2VGbG9hdCh4KSk7XG4gICAgICAgIGlmIChudW1lcmljVmFsdWVzLmZpbmQoaXNOYU4pICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBjb2x1bW4gJHtpfSBpcyBub3QgYWxsIG51bWJlcnNgKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0VxdWFsKG51bWVyaWNWYWx1ZXMsIHJhbmdlKDEsIHRhYmxlRGF0YS5sZW5ndGggKyAxKSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBjb2x1bW4gJHtpfSBsb29rcyBsaWtlIGEgcm93IG51bWJlcnNgKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGF2Z1ZhbHVlID0gbnVtZXJpY1ZhbHVlcy5yZWR1Y2UoKHJlc3VsdCwgaXRlbSkgPT4gcmVzdWx0ICsgaXRlbSwgMCkgLyBjb2x1bW5EYXRhLmxlbmd0aDtcbiAgICAgICAgY29uc3QgcmF0ZU9mUm91bmRWYWx1ZXMgPSBudW1lcmljVmFsdWVzLmZpbHRlcih4ID0+IE1hdGgucm91bmQoeCkgPT0geCkubGVuZ3RoIC8gY29sdW1uRGF0YS5sZW5ndGg7XG4gICAgICAgIGlmIChhdmdWYWx1ZSA8IDE1ICYmIHJhdGVPZlJvdW5kVmFsdWVzID4gMC41KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgY29sdW1uICR7aX0gc2VlbXMgdG8gaGF2ZSBhIHF1YW50aXRpZXNgKTtcbiAgICAgICAgICAgIHF1YW50aXRpZXMgPSBudW1lcmljVmFsdWVzO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coYGNvbHVtbiAke2l9IGlnbm9yZWQuIEF2ZXJhZ2UgdmFsdWU6ICR7YXZnVmFsdWV9LCByYXRlIG9mIHJvdW5kZWQgdmFsdWVzOiAke3JhdGVPZlJvdW5kVmFsdWVzfSlgKTtcbiAgICB9XG4gICAgY29uc3QgaWRzID0gbGlua3NcbiAgICAgICAgLm1hcChsaW5rID0+IHsgdmFyIF9hOyByZXR1cm4gKF9hID0gbGluay5tYXRjaCgvdXRrb25vc1xcLnJ1XFwvaXRlbVxcLyhcXGQrKS8pKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2FbMV07IH0pXG4gICAgICAgIC5tYXAoeCA9PiBwYXJzZUludCh4IHx8ICcnKSlcbiAgICAgICAgLmZpbHRlcihCb29sZWFuKTtcbiAgICBpZiAoaWRzLmxlbmd0aCA9PSBxdWFudGl0aWVzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gaWRzLm1hcCgoaWQsIGkpID0+ICh7XG4gICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICBxdWFudGl0eTogcXVhbnRpdGllc1tpXSxcbiAgICAgICAgfSkpO1xuICAgIH1cbiAgICByZXR1cm4gaWRzLm1hcChpZCA9PiAoe1xuICAgICAgICBpZDogaWQsXG4gICAgICAgIHF1YW50aXR5OiAxLFxuICAgIH0pKTtcbn1cbmV4cG9ydHMuZXh0cmFjdEZyb21UYWJsZSA9IGV4dHJhY3RGcm9tVGFibGU7XG4vLyBSZXR1cm5zIGEgdGV4dCBjb250ZW50IG9mIGEgdGFibGUgKGFuZCBsaW5rIHRhcmdldHMpXG5mdW5jdGlvbiBwYXJzZVRhYmxlKGVsZW1lbnQpIHtcbiAgICBjb25zdCByb3dFbGVtZW50cyA9ICgwLCB4cGF0aF8xLmRvWHBhdGgpKCcuLy90cicsIGVsZW1lbnQpO1xuICAgIGNvbnN0IHRhYmxlRGF0YSA9IFtdO1xuICAgIGZvciAoY29uc3Qgcm93RWxlbWVudCBvZiByb3dFbGVtZW50cykge1xuICAgICAgICBjb25zdCByb3dEYXRhID0gW107XG4gICAgICAgIGZvciAoY29uc3QgY2VsbCBvZiByb3dFbGVtZW50LmNoaWxkTm9kZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5ldmFsdWF0ZSgnLi8vYScsIGNlbGwsIG51bGwsIFhQYXRoUmVzdWx0LkFOWV9UWVBFKS5pdGVyYXRlTmV4dCgpO1xuICAgICAgICAgICAgaWYgKGxpbmsgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSBsaW5rIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgPyBsaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpIDogbGluay50ZXh0Q29udGVudDtcbiAgICAgICAgICAgICAgICByb3dEYXRhLnB1c2godXJsIHx8ICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJvd0RhdGEucHVzaChjZWxsLnRleHRDb250ZW50IHx8ICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0YWJsZURhdGEucHVzaChyb3dEYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIHRhYmxlRGF0YTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5leHRyYWN0RnJvbVVuc3RydWN0dXJlZFRleHQgPSB2b2lkIDA7XG5jb25zdCB4cGF0aF8xID0gcmVxdWlyZShcIi4uL3Nkay94cGF0aFwiKTtcbmZ1bmN0aW9uIGV4dHJhY3RGcm9tVW5zdHJ1Y3R1cmVkVGV4dChlbGVtZW50KSB7XG4gICAgY29uc3QgbGlua3MgPSBbXTtcbiAgICBjb25zdCBsaW5rRWxlbWVudHMgPSAoMCwgeHBhdGhfMS5kb1hwYXRoKSgnLi8vYScsIGVsZW1lbnQpO1xuICAgIGZvciAoY29uc3QgZWwgb2YgbGlua0VsZW1lbnRzKSB7XG4gICAgICAgIGlmIChlbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBjb25zdCBocmVmID0gZWwuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gICAgICAgICAgICBpZiAoaHJlZikge1xuICAgICAgICAgICAgICAgIGxpbmtzLnB1c2goaHJlZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgdGV4dCA9IGxpbmtzLmpvaW4oXCJcXG5cIikgKyBlbGVtZW50LnRleHRDb250ZW50O1xuICAgIGNvbnN0IGl0ZW1zID0gW107XG4gICAgY29uc3Qgc2Vlbkl0ZW1zID0gbmV3IFNldCgpO1xuICAgIGZvciAoY29uc3QgbSBvZiB0ZXh0Lm1hdGNoQWxsKC9odHRwczpcXC9cXC93d3dcXC51dGtvbm9zXFwucnVcXC9pdGVtXFwvKFxcZCspL2cpKSB7XG4gICAgICAgIGNvbnN0IGlkID0gbVsxXTtcbiAgICAgICAgaWYgKHNlZW5JdGVtcy5oYXMoaWQpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBzZWVuSXRlbXMuYWRkKGlkKTtcbiAgICAgICAgaXRlbXMucHVzaCh7XG4gICAgICAgICAgICBpZDogcGFyc2VJbnQoaWQpLFxuICAgICAgICAgICAgcXVhbnRpdHk6IDEsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gaXRlbXM7XG59XG5leHBvcnRzLmV4dHJhY3RGcm9tVW5zdHJ1Y3R1cmVkVGV4dCA9IGV4dHJhY3RGcm9tVW5zdHJ1Y3R1cmVkVGV4dDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5leHRyYWN0RGF0YSA9IHZvaWQgMDtcbmNvbnN0IGV4dHJhY3RfZnJvbV90YWJsZV8xID0gcmVxdWlyZShcIi4vZXh0cmFjdF9mcm9tX3RhYmxlXCIpO1xuY29uc3QgZXh0cmFjdF91bnN0cnVjdHVyZWRfMSA9IHJlcXVpcmUoXCIuL2V4dHJhY3RfdW5zdHJ1Y3R1cmVkXCIpO1xuZnVuY3Rpb24gZXh0cmFjdERhdGEoZWwpIHtcbiAgICBpZiAoZG9jdW1lbnQuZXZhbHVhdGUoJ2NvdW50KC4vL3RhYmxlKScsIGVsLCBudWxsLCBYUGF0aFJlc3VsdC5OVU1CRVJfVFlQRSkubnVtYmVyVmFsdWUgPT0gMSkge1xuICAgICAgICBjb25zdCBkYXRhID0gKDAsIGV4dHJhY3RfZnJvbV90YWJsZV8xLmV4dHJhY3RGcm9tVGFibGUpKGVsKTtcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICByZXR1cm4gKDAsIGV4dHJhY3RfdW5zdHJ1Y3R1cmVkXzEuZXh0cmFjdEZyb21VbnN0cnVjdHVyZWRUZXh0KShlbCk7XG59XG5leHBvcnRzLmV4dHJhY3REYXRhID0gZXh0cmFjdERhdGE7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudXVpZHY0ID0gdm9pZCAwO1xuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIxMTc1MjNcbmZ1bmN0aW9uIHV1aWR2NCgpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgcmV0dXJuIChbMWU3XSArIC0xZTMgKyAtNGUzICsgLThlMyArIC0xZTExKS5yZXBsYWNlKC9bMDE4XS9nLCBjID0+IChjIF4gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheSgxKSlbMF0gJiAxNSA+PiBjIC8gNCkudG9TdHJpbmcoMTYpKTtcbn1cbmV4cG9ydHMudXVpZHY0ID0gdXVpZHY0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRvWHBhdGggPSB2b2lkIDA7XG5mdW5jdGlvbiBkb1hwYXRoKHF1ZXJ5LCByb290LCByZXN1bHRUeXBlID0gWFBhdGhSZXN1bHQuT1JERVJFRF9OT0RFX0lURVJBVE9SX1RZUEUpIHtcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICBjb25zdCB4cCA9IGRvY3VtZW50LmV2YWx1YXRlKCcuLy90cicsIHJvb3QsIG51bGwsIFhQYXRoUmVzdWx0Lk9SREVSRURfTk9ERV9JVEVSQVRPUl9UWVBFKTtcbiAgICBsZXQgaXRlbSA9IHhwLml0ZXJhdGVOZXh0KCk7XG4gICAgd2hpbGUgKGl0ZW0pIHtcbiAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgaXRlbSA9IHhwLml0ZXJhdGVOZXh0KCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnRzLmRvWHBhdGggPSBkb1hwYXRoO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy51dGtvbm9zQVBJID0gdm9pZCAwO1xuY29uc3QgQ29va2llcyA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiZXMtY29va2llXCIpKTtcbmNvbnN0IGhlbHBlcnNfMSA9IHJlcXVpcmUoXCIuLi9zZGsvaGVscGVyc1wiKTtcbmNsYXNzIFV0a29ub3NBUEkge1xuICAgIHNhdmVDYXJ0KGl0ZW1zKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBpZHMgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IHF1YW50aXRpZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuICAgICAgICAgICAgICAgIGlkcy5wdXNoKGl0ZW0uaWQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgcXVhbnRpdGllcy5wdXNoKGl0ZW0ucXVhbnRpdHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdEJvZHkgPSB7XG4gICAgICAgICAgICAgICAgXCJHb29kc0l0ZW1JZFwiOiBpZHMsXG4gICAgICAgICAgICAgICAgXCJDb3VudFwiOiBxdWFudGl0aWVzLFxuICAgICAgICAgICAgICAgIFwiVXNlRGVsdGFcIjogMCxcbiAgICAgICAgICAgICAgICBcIlJldHVyblwiOiB7IFwiQ2FydFwiOiBcIjBcIiwgXCJDYXJ0SXRlbUxpc3RcIjogXCIwXCIsIFwiVG90YWxDb3N0XCI6IFwiMFwiIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tYWtlUmVxdWVzdChcImNhcnRJdGVtTXVsdGlBZGRcIiwgcmVxdWVzdEJvZHkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgbWFrZVJlcXVlc3QobWV0aG9kLCByZXF1ZXN0Qm9keSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgZGV2aWNlRGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2RldmljZV9kYXRhJykgfHwgJ3t9Jyk7XG4gICAgICAgICAgICBjb25zdCBzZXNzaW9uVG9rZW4gPSB5aWVsZCBDb29raWVzLmdldCgnVXRrX1Nlc3Npb25Ub2tlbicpO1xuICAgICAgICAgICAgY29uc3QgcmVxdWVzdCA9IHtcbiAgICAgICAgICAgICAgICBcIkhlYWRcIjoge1xuICAgICAgICAgICAgICAgICAgICBcIkRldmljZUlkXCI6IGRldmljZURhdGFbJ2RldmljZV9pZCddLFxuICAgICAgICAgICAgICAgICAgICBcIkRvbWFpblwiOiBcInd3dy51dGtvbm9zLnJ1XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiUmVxdWVzdElkXCI6ICgwLCBoZWxwZXJzXzEudXVpZHY0KSgpLnJlcGxhY2VBbGwoLy0vZywgJycpLFxuICAgICAgICAgICAgICAgICAgICBcIk1hcmtldGluZ1BhcnRuZXJLZXlcIjogXCJtcC1jYzNjNzQzZmZkMTc0ODdhOTAyMWQxMTEyOTU0ODIxOFwiLFxuICAgICAgICAgICAgICAgICAgICBcIlZlcnNpb25cIjogXCJ1dGtvbm9zLWV4dFwiLFxuICAgICAgICAgICAgICAgICAgICBcIkNsaWVudFwiOiBcInV0a29ub3MtZXh0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiTWV0aG9kXCI6IG1ldGhvZCxcbiAgICAgICAgICAgICAgICAgICAgXCJTdG9yZVwiOiBcInV0a1wiLFxuICAgICAgICAgICAgICAgICAgICBcIlNlc3Npb25Ub2tlblwiOiBzZXNzaW9uVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgIFwiQm9keVwiOiByZXF1ZXN0Qm9keSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2VuZGluZyByZXF1ZXN0IHRvIG1ldGhvZFwiLCBtZXRob2QsIHJlcXVlc3QpO1xuICAgICAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChcInJlcXVlc3RcIiwgSlNPTi5zdHJpbmdpZnkocmVxdWVzdCkpO1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB5aWVsZCBmZXRjaChgaHR0cHM6Ly93d3cudXRrb25vcy5ydS9hcGkvdjEvJHttZXRob2R9YCwge1xuICAgICAgICAgICAgICAgIFwiaGVhZGVyc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiYWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYWNjZXB0LWxhbmd1YWdlXCI6IFwiZW4tVVMsZW47cT0wLjkscnU7cT0wLjhcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjYWNoZS1jb250cm9sXCI6IFwibm8tY2FjaGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwcmFnbWFcIjogXCJuby1jYWNoZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInNlYy1jaC11YVwiOiBcIlxcXCJDaHJvbWl1bVxcXCI7dj1cXFwiMTA2XFxcIiwgXFxcIkdvb2dsZSBDaHJvbWVcXFwiO3Y9XFxcIjEwNlxcXCIsIFxcXCJOb3Q7QT1CcmFuZFxcXCI7dj1cXFwiOTlcXFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic2VjLWNoLXVhLW1vYmlsZVwiOiBcIj8wXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic2VjLWNoLXVhLXBsYXRmb3JtXCI6IFwiXFxcIm1hY09TXFxcIlwiLFxuICAgICAgICAgICAgICAgICAgICBcInNlYy1mZXRjaC1kZXN0XCI6IFwiZW1wdHlcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzZWMtZmV0Y2gtbW9kZVwiOiBcImNvcnNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzZWMtZmV0Y2gtc2l0ZVwiOiBcInNhbWUtb3JpZ2luXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwicmVmZXJyZXJcIjogXCJodHRwczovL3d3dy51dGtvbm9zLnJ1L1wiLFxuICAgICAgICAgICAgICAgIFwicmVmZXJyZXJQb2xpY3lcIjogXCJuby1yZWZlcnJlci13aGVuLWRvd25ncmFkZVwiLFxuICAgICAgICAgICAgICAgIFwiYm9keVwiOiBmb3JtRGF0YSxcbiAgICAgICAgICAgICAgICBcIm1ldGhvZFwiOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBcIm1vZGVcIjogXCJjb3JzXCIsXG4gICAgICAgICAgICAgICAgXCJjcmVkZW50aWFsc1wiOiBcImluY2x1ZGVcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMudXRrb25vc0FQSSA9IG5ldyBVdGtvbm9zQVBJKCk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcblx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5tZCA9IChtb2R1bGUpID0+IHtcblx0bW9kdWxlLnBhdGhzID0gW107XG5cdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0cmV0dXJuIG1vZHVsZTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwiaW5qZWN0ZWRfc2NyaXB0XCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua3V0a29ub3NfZXh0XCJdID0gc2VsZltcIndlYnBhY2tDaHVua3V0a29ub3NfZXh0XCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvclwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmplY3RlZF9zY3JpcHQudHN4XCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=