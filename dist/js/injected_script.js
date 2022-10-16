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
    const xp = document.evaluate(query, root, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NKQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1dDaERBOzs7OztVRUFBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly91dGtvbm9zLWV4dC8uL3NyYy9BcHAudHN4Iiwid2VicGFjazovL3V0a29ub3MtZXh0Ly4vc3JjL2luamVjdGVkX3NjcmlwdC50c3giLCJ3ZWJwYWNrOi8vdXRrb25vcy1leHQvLi9zcmMvcGFyc2luZy9leHRyYWN0X2Zyb21fdGFibGUudHMiLCJ3ZWJwYWNrOi8vdXRrb25vcy1leHQvLi9zcmMvcGFyc2luZy9leHRyYWN0X3Vuc3RydWN0dXJlZC50cyIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC8uL3NyYy9wYXJzaW5nL2luZGV4LnRzIiwid2VicGFjazovL3V0a29ub3MtZXh0Ly4vc3JjL3Nkay9oZWxwZXJzLnRzIiwid2VicGFjazovL3V0a29ub3MtZXh0Ly4vc3JjL3Nkay94cGF0aC50cyIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC8uL3NyYy91dGtvbm9zL2FwaS50cyIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL3V0a29ub3MtZXh0L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3V0a29ub3MtZXh0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL3V0a29ub3MtZXh0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdXRrb25vcy1leHQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC93ZWJwYWNrL3J1bnRpbWUvbm9kZSBtb2R1bGUgZGVjb3JhdG9yIiwid2VicGFjazovL3V0a29ub3MtZXh0L3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL3V0a29ub3MtZXh0L3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3V0a29ub3MtZXh0L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHJlYWN0XzEgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcInJlYWN0XCIpKTtcbmNvbnN0IHN0eWxlZF9jb21wb25lbnRzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcInN0eWxlZC1jb21wb25lbnRzXCIpKTtcbmNvbnN0IHBhcnNpbmdfMSA9IHJlcXVpcmUoXCIuL3BhcnNpbmdcIik7XG5jb25zdCBhcGlfMSA9IHJlcXVpcmUoXCIuL3V0a29ub3MvYXBpXCIpO1xuZnVuY3Rpb24gQXBwKCkge1xuICAgIGNvbnN0IFt2aXNpYmxlLCBzZXRWaXNpYmxlXSA9ICgwLCByZWFjdF8xLnVzZVN0YXRlKShmYWxzZSk7XG4gICAgY29uc3QgZWRpdG9yUmVmID0gKDAsIHJlYWN0XzEudXNlUmVmKShudWxsKTtcbiAgICBjb25zdCBbc2hvd1Byb2dyZXNzLCBzZXRTaG93UHJvZ3Jlc3NdID0gKDAsIHJlYWN0XzEudXNlU3RhdGUpKGZhbHNlKTtcbiAgICB1c2VPbkNhcnRJdGVtc0hhbmRsZXIoKCkgPT4gc2V0U2hvd1Byb2dyZXNzKGZhbHNlKSk7XG4gICAgdXNlS2V5Ym9hcmRIYW5kbGVyKGV2ID0+IGV2LmtleSA9PSAnRXNjYXBlJywgKCkgPT4gc2V0VmlzaWJsZSghdmlzaWJsZSksIFt2aXNpYmxlXSk7XG4gICAgY29uc3Qgc2F2ZSA9ICgwLCByZWFjdF8xLnVzZUNhbGxiYWNrKSgoKSA9PiB7XG4gICAgICAgIGlmIChlZGl0b3JSZWYuY3VycmVudCA9PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCBpdGVtcyA9ICgwLCBwYXJzaW5nXzEuZXh0cmFjdERhdGEpKGVkaXRvclJlZi5jdXJyZW50KTtcbiAgICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbm8gZGF0YSBleHRyYWN0ZWQnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZygnYWRkaW5nIGl0ZW1zJywgaXRlbXMpO1xuICAgICAgICBzZXRTaG93UHJvZ3Jlc3ModHJ1ZSk7XG4gICAgICAgIGFwaV8xLnV0a29ub3NBUEkuc2F2ZUNhcnQoaXRlbXMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgcnJUb1V0a0FkYXB0ZXIubW9kaWZ5SXRlbUF0Q2FydChpdGVtc1swXSk7IC8vIGZha2UgY2FydCBtb2RpZmljYXRpb24gdG8gdHJpZ2dlciByZWxvYWRcbiAgICAgICAgfSk7XG4gICAgfSwgW10pO1xuICAgIHJldHVybiAocmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQocmVhY3RfMS5kZWZhdWx0LlN0cmljdE1vZGUsIG51bGwsXG4gICAgICAgIHZpc2libGUgJiYgKHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFJvb3QsIG51bGwsXG4gICAgICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChUZXh0QXJlYSwgeyBjb250ZW50RWRpdGFibGU6IHRydWUsIHJlZjogZWRpdG9yUmVmIH0pLFxuICAgICAgICAgICAgcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IG9uQ2xpY2s6IHNhdmUsIGRpc2FibGVkOiBzaG93UHJvZ3Jlc3MgfSxcbiAgICAgICAgICAgICAgICBzaG93UHJvZ3Jlc3MgJiYgXCLQodC+0YXRgNCw0L3Rj9C10LwuLi5cIixcbiAgICAgICAgICAgICAgICAhc2hvd1Byb2dyZXNzICYmIFwi0JTQvtCx0LDQstC40YLRjFwiKSkpLFxuICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChCYWRnZSwgeyBvbkNsaWNrOiAoKSA9PiBzZXRWaXNpYmxlKCF2aXNpYmxlKSB9KSkpO1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gQXBwO1xuZnVuY3Rpb24gdXNlT25DYXJ0SXRlbXNIYW5kbGVyKGNiKSB7XG4gICAgKDAsIHJlYWN0XzEudXNlRWZmZWN0KSgoKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgcnJUb1V0a0FkYXB0ZXIub25DYXJ0SXRlbXMoY2IpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICB9LCBbXSk7XG59XG5mdW5jdGlvbiB1c2VLZXlib2FyZEhhbmRsZXIoZmlsdGVyLCBjYiwgZGVwcykge1xuICAgICgwLCByZWFjdF8xLnVzZUVmZmVjdCkoKCkgPT4ge1xuICAgICAgICBjb25zdCBoYW5kbGVyID0gKGV2KSA9PiB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyKGV2KSlcbiAgICAgICAgICAgICAgICBjYigpO1xuICAgICAgICB9O1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZXIpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBoYW5kbGVyKTtcbiAgICAgICAgfTtcbiAgICB9LCBkZXBzKTtcbn1cbmNvbnN0IFJvb3QgPSBzdHlsZWRfY29tcG9uZW50c18xLmRlZmF1bHQuZGl2IGBcbiAgcG9zaXRpb246IGZpeGVkO1xuICB3aWR0aDogNDAwcHg7XG4gIGhlaWdodDogODB2aDtcbiAgdG9wOiBjYWxjKDUwJSAtIDQwdmgpO1xuICByaWdodDogNXB4O1xuICBiYWNrZ3JvdW5kOiAjZmZkOWQ5O1xuICB6LWluZGV4OiAxMDAwO1xuICBib3JkZXI6IDFweCBzb2xpZCAjNTU1O1xuICBib3JkZXItcmFkaXVzOiA3cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuYDtcbmNvbnN0IFRleHRBcmVhID0gc3R5bGVkX2NvbXBvbmVudHNfMS5kZWZhdWx0LmRpdiBgXG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6IDEwMCU7XG4gIGJvcmRlci1yYWRpdXM6IDdweDtcbiAgYmFja2dyb3VuZDogd2hpdGU7XG4gIG92ZXJmbG93OiBzY3JvbGw7XG4gIFxuICBwYWRkaW5nOiA1cHggMTBweDtcbmA7XG5jb25zdCBCdXR0b24gPSBzdHlsZWRfY29tcG9uZW50c18xLmRlZmF1bHQuYnV0dG9uIGBcbiAgbWFyZ2luOiA1cHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsYWNrO1xuICBib3JkZXItcmFkaXVzOiAzcHg7XG5gO1xuY29uc3QgQmFkZ2UgPSBzdHlsZWRfY29tcG9uZW50c18xLmRlZmF1bHQuZGl2IGBcbiAgcG9zaXRpb246IGZpeGVkO1xuICBoZWlnaHQ6IDczcHg7XG4gIHdpZHRoOiAzNnB4O1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuICB6LWluZGV4OiAxMDAwO1xuICBiYWNrZ3JvdW5kOiB1cmwoaHR0cHM6Ly9tYXlhay5oZWxwL3dwLWNvbnRlbnQvdGhlbWVzL21heWFrL2ltZy9sb2dvLnBuZyk7XG4gIHRyYW5zZm9ybTogc2NhbGUoMC44KTtcbiAgLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luLXg6IHJpZ2h0O1xuICAtd2Via2l0LXRyYW5zZm9ybS1vcmlnaW4teTogdG9wO1xuYDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgcmVhY3RfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwicmVhY3RcIikpO1xuY29uc3QgcmVhY3RfZG9tXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcInJlYWN0LWRvbVwiKSk7XG5jb25zdCBBcHBfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9BcHBcIikpO1xuY29uc29sZS5sb2coJ1t1dGtvbm9zLWV4dF0gaW5pdGlhbGl6aW5nJyk7XG5jb25zdCByb290ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJvb3QpO1xucmVhY3RfZG9tXzEuZGVmYXVsdC5yZW5kZXIocmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoQXBwXzEuZGVmYXVsdCwgbnVsbCksIHJvb3QpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmV4dHJhY3RGcm9tVGFibGUgPSB2b2lkIDA7XG5jb25zdCB4cGF0aF8xID0gcmVxdWlyZShcIi4uL3Nkay94cGF0aFwiKTtcbmNvbnN0IGlzRXF1YWwgPSByZXF1aXJlKFwibG9kYXNoL2lzRXF1YWxcIik7XG5jb25zdCB6aXAgPSByZXF1aXJlKFwibG9kYXNoL3ppcFwiKTtcbmNvbnN0IHJhbmdlID0gcmVxdWlyZShcImxvZGFzaC9yYW5nZVwiKTtcbmZ1bmN0aW9uIGV4dHJhY3RGcm9tVGFibGUoZWxlbWVudCkge1xuICAgIGNvbnN0IHRhYmxlRGF0YSA9IHBhcnNlVGFibGUoZWxlbWVudCk7XG4gICAgaWYgKHRhYmxlRGF0YS5sZW5ndGggPT0gMClcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIGxldCBsaW5rcyA9IFtdO1xuICAgIGxldCBxdWFudGl0aWVzID0gW107XG4gICAgLy8gY2hlY2sgaWYgdGhlIGZpcnN0IHJvdyBsb29rcyBsaWtlIGEgaGVhZGVyIChubyBudW1iZXIgdmFsdWVzKVxuICAgIGlmICh0YWJsZURhdGFbMF0uZmlsdGVyKGl0ZW0gPT4gIWlzTmFOKHBhcnNlRmxvYXQoaXRlbS50cmltKCkpKSkubGVuZ3RoID09IDApIHtcbiAgICAgICAgdGFibGVEYXRhLnNoaWZ0KCk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwidGFibGUgZGF0YVwiKTtcbiAgICBjb25zb2xlLnRhYmxlKHRhYmxlRGF0YSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWJsZURhdGFbMF0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgY29sdW1uRGF0YSA9IHRhYmxlRGF0YS5tYXAocm93ID0+IHJvd1tpXSk7XG4gICAgICAgIGlmICh0YWJsZURhdGFbMF1baV0uaW5kZXhPZigndXRrb25vcy5ydScpICE9IC0xKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgY29sdW1uICR7aX0gc2VlbXMgdG8gY29udGFpbiBsaW5rc2ApO1xuICAgICAgICAgICAgbGlua3MgPSBjb2x1bW5EYXRhO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbnVtZXJpY1ZhbHVlcyA9IGNvbHVtbkRhdGEubWFwKHggPT4gcGFyc2VGbG9hdCh4KSk7XG4gICAgICAgIGlmIChudW1lcmljVmFsdWVzLmZpbmQoaXNOYU4pICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBjb2x1bW4gJHtpfSBpcyBub3QgYWxsIG51bWJlcnNgKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0VxdWFsKG51bWVyaWNWYWx1ZXMsIHJhbmdlKDEsIHRhYmxlRGF0YS5sZW5ndGggKyAxKSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBjb2x1bW4gJHtpfSBsb29rcyBsaWtlIGEgcm93IG51bWJlcnNgKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGF2Z1ZhbHVlID0gbnVtZXJpY1ZhbHVlcy5yZWR1Y2UoKHJlc3VsdCwgaXRlbSkgPT4gcmVzdWx0ICsgaXRlbSwgMCkgLyBjb2x1bW5EYXRhLmxlbmd0aDtcbiAgICAgICAgY29uc3QgcmF0ZU9mUm91bmRWYWx1ZXMgPSBudW1lcmljVmFsdWVzLmZpbHRlcih4ID0+IE1hdGgucm91bmQoeCkgPT0geCkubGVuZ3RoIC8gY29sdW1uRGF0YS5sZW5ndGg7XG4gICAgICAgIGlmIChhdmdWYWx1ZSA8IDE1ICYmIHJhdGVPZlJvdW5kVmFsdWVzID4gMC41KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgY29sdW1uICR7aX0gc2VlbXMgdG8gaGF2ZSBhIHF1YW50aXRpZXNgKTtcbiAgICAgICAgICAgIHF1YW50aXRpZXMgPSBudW1lcmljVmFsdWVzO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coYGNvbHVtbiAke2l9IGlnbm9yZWQuIEF2ZXJhZ2UgdmFsdWU6ICR7YXZnVmFsdWV9LCByYXRlIG9mIHJvdW5kZWQgdmFsdWVzOiAke3JhdGVPZlJvdW5kVmFsdWVzfSlgKTtcbiAgICB9XG4gICAgY29uc3QgaWRzID0gbGlua3NcbiAgICAgICAgLm1hcChsaW5rID0+IHsgdmFyIF9hOyByZXR1cm4gKF9hID0gbGluay5tYXRjaCgvdXRrb25vc1xcLnJ1XFwvaXRlbVxcLyhcXGQrKS8pKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2FbMV07IH0pXG4gICAgICAgIC5tYXAoeCA9PiBwYXJzZUludCh4IHx8ICcnKSlcbiAgICAgICAgLmZpbHRlcihCb29sZWFuKTtcbiAgICBpZiAoaWRzLmxlbmd0aCA9PSBxdWFudGl0aWVzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gaWRzLm1hcCgoaWQsIGkpID0+ICh7XG4gICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICBxdWFudGl0eTogcXVhbnRpdGllc1tpXSxcbiAgICAgICAgfSkpO1xuICAgIH1cbiAgICByZXR1cm4gaWRzLm1hcChpZCA9PiAoe1xuICAgICAgICBpZDogaWQsXG4gICAgICAgIHF1YW50aXR5OiAxLFxuICAgIH0pKTtcbn1cbmV4cG9ydHMuZXh0cmFjdEZyb21UYWJsZSA9IGV4dHJhY3RGcm9tVGFibGU7XG4vLyBSZXR1cm5zIGEgdGV4dCBjb250ZW50IG9mIGEgdGFibGUgKGFuZCBsaW5rIHRhcmdldHMpXG5mdW5jdGlvbiBwYXJzZVRhYmxlKGVsZW1lbnQpIHtcbiAgICBjb25zdCByb3dFbGVtZW50cyA9ICgwLCB4cGF0aF8xLmRvWHBhdGgpKCcuLy90cicsIGVsZW1lbnQpO1xuICAgIGNvbnN0IHRhYmxlRGF0YSA9IFtdO1xuICAgIGZvciAoY29uc3Qgcm93RWxlbWVudCBvZiByb3dFbGVtZW50cykge1xuICAgICAgICBjb25zdCByb3dEYXRhID0gW107XG4gICAgICAgIGZvciAoY29uc3QgY2VsbCBvZiByb3dFbGVtZW50LmNoaWxkTm9kZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5ldmFsdWF0ZSgnLi8vYScsIGNlbGwsIG51bGwsIFhQYXRoUmVzdWx0LkFOWV9UWVBFKS5pdGVyYXRlTmV4dCgpO1xuICAgICAgICAgICAgaWYgKGxpbmsgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSBsaW5rIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgPyBsaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpIDogbGluay50ZXh0Q29udGVudDtcbiAgICAgICAgICAgICAgICByb3dEYXRhLnB1c2godXJsIHx8ICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJvd0RhdGEucHVzaChjZWxsLnRleHRDb250ZW50IHx8ICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0YWJsZURhdGEucHVzaChyb3dEYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIHRhYmxlRGF0YTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5leHRyYWN0RnJvbVVuc3RydWN0dXJlZFRleHQgPSB2b2lkIDA7XG5jb25zdCB4cGF0aF8xID0gcmVxdWlyZShcIi4uL3Nkay94cGF0aFwiKTtcbmZ1bmN0aW9uIGV4dHJhY3RGcm9tVW5zdHJ1Y3R1cmVkVGV4dChlbGVtZW50KSB7XG4gICAgY29uc3QgbGlua3MgPSBbXTtcbiAgICBjb25zdCBsaW5rRWxlbWVudHMgPSAoMCwgeHBhdGhfMS5kb1hwYXRoKSgnLi8vYScsIGVsZW1lbnQpO1xuICAgIGZvciAoY29uc3QgZWwgb2YgbGlua0VsZW1lbnRzKSB7XG4gICAgICAgIGlmIChlbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBjb25zdCBocmVmID0gZWwuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gICAgICAgICAgICBpZiAoaHJlZikge1xuICAgICAgICAgICAgICAgIGxpbmtzLnB1c2goaHJlZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgdGV4dCA9IGxpbmtzLmpvaW4oXCJcXG5cIikgKyBlbGVtZW50LnRleHRDb250ZW50O1xuICAgIGNvbnN0IGl0ZW1zID0gW107XG4gICAgY29uc3Qgc2Vlbkl0ZW1zID0gbmV3IFNldCgpO1xuICAgIGZvciAoY29uc3QgbSBvZiB0ZXh0Lm1hdGNoQWxsKC9odHRwczpcXC9cXC93d3dcXC51dGtvbm9zXFwucnVcXC9pdGVtXFwvKFxcZCspL2cpKSB7XG4gICAgICAgIGNvbnN0IGlkID0gbVsxXTtcbiAgICAgICAgaWYgKHNlZW5JdGVtcy5oYXMoaWQpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBzZWVuSXRlbXMuYWRkKGlkKTtcbiAgICAgICAgaXRlbXMucHVzaCh7XG4gICAgICAgICAgICBpZDogcGFyc2VJbnQoaWQpLFxuICAgICAgICAgICAgcXVhbnRpdHk6IDEsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gaXRlbXM7XG59XG5leHBvcnRzLmV4dHJhY3RGcm9tVW5zdHJ1Y3R1cmVkVGV4dCA9IGV4dHJhY3RGcm9tVW5zdHJ1Y3R1cmVkVGV4dDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5leHRyYWN0RGF0YSA9IHZvaWQgMDtcbmNvbnN0IGV4dHJhY3RfZnJvbV90YWJsZV8xID0gcmVxdWlyZShcIi4vZXh0cmFjdF9mcm9tX3RhYmxlXCIpO1xuY29uc3QgZXh0cmFjdF91bnN0cnVjdHVyZWRfMSA9IHJlcXVpcmUoXCIuL2V4dHJhY3RfdW5zdHJ1Y3R1cmVkXCIpO1xuZnVuY3Rpb24gZXh0cmFjdERhdGEoZWwpIHtcbiAgICBpZiAoZG9jdW1lbnQuZXZhbHVhdGUoJ2NvdW50KC4vL3RhYmxlKScsIGVsLCBudWxsLCBYUGF0aFJlc3VsdC5OVU1CRVJfVFlQRSkubnVtYmVyVmFsdWUgPT0gMSkge1xuICAgICAgICBjb25zdCBkYXRhID0gKDAsIGV4dHJhY3RfZnJvbV90YWJsZV8xLmV4dHJhY3RGcm9tVGFibGUpKGVsKTtcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICByZXR1cm4gKDAsIGV4dHJhY3RfdW5zdHJ1Y3R1cmVkXzEuZXh0cmFjdEZyb21VbnN0cnVjdHVyZWRUZXh0KShlbCk7XG59XG5leHBvcnRzLmV4dHJhY3REYXRhID0gZXh0cmFjdERhdGE7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudXVpZHY0ID0gdm9pZCAwO1xuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIxMTc1MjNcbmZ1bmN0aW9uIHV1aWR2NCgpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgcmV0dXJuIChbMWU3XSArIC0xZTMgKyAtNGUzICsgLThlMyArIC0xZTExKS5yZXBsYWNlKC9bMDE4XS9nLCBjID0+IChjIF4gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheSgxKSlbMF0gJiAxNSA+PiBjIC8gNCkudG9TdHJpbmcoMTYpKTtcbn1cbmV4cG9ydHMudXVpZHY0ID0gdXVpZHY0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRvWHBhdGggPSB2b2lkIDA7XG5mdW5jdGlvbiBkb1hwYXRoKHF1ZXJ5LCByb290LCByZXN1bHRUeXBlID0gWFBhdGhSZXN1bHQuT1JERVJFRF9OT0RFX0lURVJBVE9SX1RZUEUpIHtcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICBjb25zdCB4cCA9IGRvY3VtZW50LmV2YWx1YXRlKHF1ZXJ5LCByb290LCBudWxsLCBYUGF0aFJlc3VsdC5PUkRFUkVEX05PREVfSVRFUkFUT1JfVFlQRSk7XG4gICAgbGV0IGl0ZW0gPSB4cC5pdGVyYXRlTmV4dCgpO1xuICAgIHdoaWxlIChpdGVtKSB7XG4gICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIGl0ZW0gPSB4cC5pdGVyYXRlTmV4dCgpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZXhwb3J0cy5kb1hwYXRoID0gZG9YcGF0aDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcbn0pIDogZnVuY3Rpb24obywgdikge1xuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcbn0pO1xudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudXRrb25vc0FQSSA9IHZvaWQgMDtcbmNvbnN0IENvb2tpZXMgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcImVzLWNvb2tpZVwiKSk7XG5jb25zdCBoZWxwZXJzXzEgPSByZXF1aXJlKFwiLi4vc2RrL2hlbHBlcnNcIik7XG5jbGFzcyBVdGtvbm9zQVBJIHtcbiAgICBzYXZlQ2FydChpdGVtcykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgaWRzID0gW107XG4gICAgICAgICAgICBjb25zdCBxdWFudGl0aWVzID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICAgICAgICAgICAgICBpZHMucHVzaChpdGVtLmlkLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIHF1YW50aXRpZXMucHVzaChpdGVtLnF1YW50aXR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RCb2R5ID0ge1xuICAgICAgICAgICAgICAgIFwiR29vZHNJdGVtSWRcIjogaWRzLFxuICAgICAgICAgICAgICAgIFwiQ291bnRcIjogcXVhbnRpdGllcyxcbiAgICAgICAgICAgICAgICBcIlVzZURlbHRhXCI6IDAsXG4gICAgICAgICAgICAgICAgXCJSZXR1cm5cIjogeyBcIkNhcnRcIjogXCIwXCIsIFwiQ2FydEl0ZW1MaXN0XCI6IFwiMFwiLCBcIlRvdGFsQ29zdFwiOiBcIjBcIiB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFrZVJlcXVlc3QoXCJjYXJ0SXRlbU11bHRpQWRkXCIsIHJlcXVlc3RCb2R5KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG1ha2VSZXF1ZXN0KG1ldGhvZCwgcmVxdWVzdEJvZHkpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGRldmljZURhdGEgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdkZXZpY2VfZGF0YScpIHx8ICd7fScpO1xuICAgICAgICAgICAgY29uc3Qgc2Vzc2lvblRva2VuID0geWllbGQgQ29va2llcy5nZXQoJ1V0a19TZXNzaW9uVG9rZW4nKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3QgPSB7XG4gICAgICAgICAgICAgICAgXCJIZWFkXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJEZXZpY2VJZFwiOiBkZXZpY2VEYXRhWydkZXZpY2VfaWQnXSxcbiAgICAgICAgICAgICAgICAgICAgXCJEb21haW5cIjogXCJ3d3cudXRrb25vcy5ydVwiLFxuICAgICAgICAgICAgICAgICAgICBcIlJlcXVlc3RJZFwiOiAoMCwgaGVscGVyc18xLnV1aWR2NCkoKS5yZXBsYWNlQWxsKC8tL2csICcnKSxcbiAgICAgICAgICAgICAgICAgICAgXCJNYXJrZXRpbmdQYXJ0bmVyS2V5XCI6IFwibXAtY2MzYzc0M2ZmZDE3NDg3YTkwMjFkMTExMjk1NDgyMThcIixcbiAgICAgICAgICAgICAgICAgICAgXCJWZXJzaW9uXCI6IFwidXRrb25vcy1leHRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJDbGllbnRcIjogXCJ1dGtvbm9zLWV4dFwiLFxuICAgICAgICAgICAgICAgICAgICBcIk1ldGhvZFwiOiBtZXRob2QsXG4gICAgICAgICAgICAgICAgICAgIFwiU3RvcmVcIjogXCJ1dGtcIixcbiAgICAgICAgICAgICAgICAgICAgXCJTZXNzaW9uVG9rZW5cIjogc2Vzc2lvblRva2VuLFxuICAgICAgICAgICAgICAgICAgICBcIkJvZHlcIjogcmVxdWVzdEJvZHksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNlbmRpbmcgcmVxdWVzdCB0byBtZXRob2RcIiwgbWV0aG9kLCByZXF1ZXN0KTtcbiAgICAgICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJyZXF1ZXN0XCIsIEpTT04uc3RyaW5naWZ5KHJlcXVlc3QpKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0geWllbGQgZmV0Y2goYGh0dHBzOi8vd3d3LnV0a29ub3MucnUvYXBpL3YxLyR7bWV0aG9kfWAsIHtcbiAgICAgICAgICAgICAgICBcImhlYWRlcnNcIjoge1xuICAgICAgICAgICAgICAgICAgICBcImFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKlwiLFxuICAgICAgICAgICAgICAgICAgICBcImFjY2VwdC1sYW5ndWFnZVwiOiBcImVuLVVTLGVuO3E9MC45LHJ1O3E9MC44XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiY2FjaGUtY29udHJvbFwiOiBcIm5vLWNhY2hlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicHJhZ21hXCI6IFwibm8tY2FjaGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzZWMtY2gtdWFcIjogXCJcXFwiQ2hyb21pdW1cXFwiO3Y9XFxcIjEwNlxcXCIsIFxcXCJHb29nbGUgQ2hyb21lXFxcIjt2PVxcXCIxMDZcXFwiLCBcXFwiTm90O0E9QnJhbmRcXFwiO3Y9XFxcIjk5XFxcIlwiLFxuICAgICAgICAgICAgICAgICAgICBcInNlYy1jaC11YS1tb2JpbGVcIjogXCI/MFwiLFxuICAgICAgICAgICAgICAgICAgICBcInNlYy1jaC11YS1wbGF0Zm9ybVwiOiBcIlxcXCJtYWNPU1xcXCJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzZWMtZmV0Y2gtZGVzdFwiOiBcImVtcHR5XCIsXG4gICAgICAgICAgICAgICAgICAgIFwic2VjLWZldGNoLW1vZGVcIjogXCJjb3JzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic2VjLWZldGNoLXNpdGVcIjogXCJzYW1lLW9yaWdpblwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcInJlZmVycmVyXCI6IFwiaHR0cHM6Ly93d3cudXRrb25vcy5ydS9cIixcbiAgICAgICAgICAgICAgICBcInJlZmVycmVyUG9saWN5XCI6IFwibm8tcmVmZXJyZXItd2hlbi1kb3duZ3JhZGVcIixcbiAgICAgICAgICAgICAgICBcImJvZHlcIjogZm9ybURhdGEsXG4gICAgICAgICAgICAgICAgXCJtZXRob2RcIjogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgXCJtb2RlXCI6IFwiY29yc1wiLFxuICAgICAgICAgICAgICAgIFwiY3JlZGVudGlhbHNcIjogXCJpbmNsdWRlXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLnV0a29ub3NBUEkgPSBuZXcgVXRrb25vc0FQSSgpO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0bG9hZGVkOiBmYWxzZSxcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG5cdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5ubWQgPSAobW9kdWxlKSA9PiB7XG5cdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdHJldHVybiBtb2R1bGU7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcImluamVjdGVkX3NjcmlwdFwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmt1dGtvbm9zX2V4dFwiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmt1dGtvbm9zX2V4dFwiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5qZWN0ZWRfc2NyaXB0LnRzeFwiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9