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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importStar(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
const styled_components_1 = __importDefault(__webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js"));
const Cookies = __importStar(__webpack_require__(/*! es-cookie */ "./node_modules/es-cookie/src/es-cookie.js"));
const parsing_1 = __webpack_require__(/*! ./parsing */ "./src/parsing/index.ts");
const api_legacy_1 = __webpack_require__(/*! ./utkonos/api_legacy */ "./src/utkonos/api_legacy.ts");
const api_new_1 = __webpack_require__(/*! ./utkonos/api_new */ "./src/utkonos/api_new.ts");
const Grid_1 = __importDefault(__webpack_require__(/*! ./components/Grid */ "./src/components/Grid.tsx"));
const exceptions_1 = __webpack_require__(/*! ./utkonos/exceptions */ "./src/utkonos/exceptions.ts");
const getMapping = (() => {
    const result = new Map();
    for (const item of window.skuMapping) {
        result.set(item.new_utk_id, item.old_utk_id);
    }
    return () => {
        return result;
    };
})();
function App(props) {
    const [visible, setVisible] = (0, react_1.useState)(false);
    const editorRef = (0, react_1.useRef)(null);
    const [progressState, setProgressState] = (0, react_1.useState)(null);
    const [notes, setNotes] = (0, react_1.useState)([]);
    const [items, setItems] = (0, react_1.useState)([]);
    const [rejectedRows, setRejectedRows] = (0, react_1.useState)([]);
    const mapping = getMapping();
    const onLegacyDomain = window.location.host.match(/adm\.utkonos\.ru/);
    const onNewCanaryRelease = Cookies.get('CanaryReleaseRouteV4') === 'lo';
    const onNewVersion = !onLegacyDomain && onNewCanaryRelease;
    const promocode = props.promocode;
    useKeyboardHandler(ev => ev.key == 'Escape', () => setVisible(!visible), [visible]);
    const onPaste = (0, react_1.useCallback)(() => {
        setNotes([]);
        const notes = [];
        if (!editorRef.current)
            return;
        setTimeout(() => {
            if (!editorRef.current)
                return;
            editorRef.current && prepareTextareaContent(editorRef.current);
            const { cartItems, rejectedRows, withCounts } = (0, parsing_1.extractData)(editorRef.current);
            if (!withCounts) {
                setNotes(["Не удалось распознать колонку таблицы с количествами – везде будут '1'", ...notes]);
            }
            if (!onNewVersion) {
                for (const item of cartItems) {
                    if (mapping.has(item.id)) {
                        item.originalId = item.id;
                        item.id = mapping.get(item.id);
                        item.mapped = true;
                        console.log(`mapped ${item.name}: ${item.originalId} to ${item.id}`);
                    }
                }
            }
            setRejectedRows(rejectedRows);
            setItems(cartItems);
        }, 100);
    }, [editorRef, notes]);
    const applyPromocode = (0, react_1.useCallback)(() => __awaiter(this, void 0, void 0, function* () {
        if (promocode) {
            const api = onNewVersion ? api_new_1.utkonosNewAPI : api_legacy_1.utkonosLegacyAPI;
            setProgressState("применяем промокод");
            yield api_legacy_1.utkonosLegacyAPI.cartPromocodeAdd(promocode);
            setProgressState("");
            setNotes(["Промокод попробовали применить! Результат нужно проверить!", ...notes]);
        }
    }), [promocode, onNewVersion, notes]);
    const save = (0, react_1.useCallback)(() => {
        setNotes([]);
        const notes = [];
        const saveCart = () => __awaiter(this, void 0, void 0, function* () {
            console.log('adding items', items);
            const api = onNewVersion ? api_new_1.utkonosNewAPI : api_legacy_1.utkonosLegacyAPI;
            let i = 0;
            let savedCount = 0;
            for (const item of items) {
                i++;
                setProgressState(`${i} из ${items.length}`);
                try {
                    yield api.modifyCartItem(item);
                    savedCount++;
                }
                catch (err) {
                    console.log("item is failed to save: ", item);
                    console.log("error was: ", err);
                    if (err instanceof exceptions_1.UtkonosAPIException) {
                        item.error = err.message;
                        setItems([...items]);
                    }
                }
            }
            setProgressState("применяем промокод");
            try {
                yield applyPromocode();
            }
            catch (e) {
                console.log('failed to apply promocode', e);
                alert("Не удалось применить промокод: " + e);
            }
            return savedCount;
        });
        saveCart().then((successCount) => {
            setNotes([
                `Сохранили успешно ${successCount} товаров из ${items.length}.`,
                `Товары, которые не удалось сохранить отмечены красным цветом`,
                `Изменения в корзине будут видны после перезагрузки страницы`,
                ...notes,
            ]);
            setProgressState(null);
            // window.location.reload()
        }).catch((err) => {
            setProgressState(null);
            console.log('failed to save', err);
            alert(`Не удалось сохранить: ${err}`);
        });
    }, [applyPromocode, items]);
    return (react_1.default.createElement(react_1.default.StrictMode, null,
        visible && (react_1.default.createElement(Root, { className: "utkonos-ext-root" },
            items.length > 0 && react_1.default.createElement(Grid_1.default, { items: items, rejectedRows: rejectedRows }),
            items.length == 0 && (react_1.default.createElement(TextArea, { contentEditable: true, ref: editorRef, onPaste: onPaste })),
            react_1.default.createElement(Notes, null,
                react_1.default.createElement("div", null, onNewVersion ? "Версия сайта новая" : "Версия сайта старая"),
                promocode && react_1.default.createElement("div", null,
                    "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F \u043F\u0440\u043E\u043C\u043E\u043A\u043E\u0434 ",
                    promocode),
                notes.map(x => react_1.default.createElement("div", { key: x }, x))),
            react_1.default.createElement(Button, { onClick: save, disabled: !!progressState || !items.length }, progressState !== null && progressState !== void 0 ? progressState : "Добавить"),
            items.length > 0 && (react_1.default.createElement(ClearButton, { onClick: () => {
                    setItems([]);
                    setRejectedRows([]);
                } }, "\u274C")))),
        react_1.default.createElement(Badge, { onClick: () => setVisible(!visible) })));
}
exports["default"] = App;
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
function prepareTextareaContent(startNode) {
    clearCustomStyling(startNode);
    setLinksTarget(startNode);
}
function clearCustomStyling(startNode) {
    let node;
    const iterator = document.createNodeIterator(startNode, NodeFilter.SHOW_ALL);
    while (node = iterator.nextNode()) {
        node.removeAttribute && node.removeAttribute('style');
    }
}
function setLinksTarget(startNode) {
    let node;
    const iterator = document.createNodeIterator(startNode, NodeFilter.SHOW_ALL);
    while (node = iterator.nextNode()) {
        if (node.tagName == 'A') {
            node.setAttribute('target', '_blank');
        }
    }
}
const Root = styled_components_1.default.div `
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
const TextArea = styled_components_1.default.div `
  height: 100%;
  width: 100%;
  border-radius: 7px;
  background: white;
  overflow: scroll;
  
  font-size: 0.8em;
  
  padding: 5px 10px;
`;
const Notes = styled_components_1.default.div `
  font-size: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
const ClearButton = styled_components_1.default.a `
  display: block;
  position: absolute;
  top: 0;
  right: 10px;
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
`;


/***/ }),

/***/ "./src/components/Grid.tsx":
/*!*********************************!*\
  !*** ./src/components/Grid.tsx ***!
  \*********************************/
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
function itemNameToSearchRequest(name) {
    return name
        .replace(/\(.+?\)/, '')
        .replace(/до\s\d.+/, '')
        .replace(/(фас|вес|без|змж)\.?/, '')
        .replace(/,\s.+/, '');
}
function getSearchLinks(name) {
    const chunks = name.split(' ');
    return react_1.default.createElement(react_1.default.Fragment, null, chunks.map((chunk, i) => react_1.default.createElement(Link, { href: `/search/${encodeURI(chunks.slice(0, i + 1).join(" "))}/`, target: "_blank" },
        chunk,
        "\u00A0")));
}
function default_1({ items, rejectedRows }) {
    const getBackgroundColor = (0, react_1.useCallback)((item) => {
        if (item.error)
            return '#ffb0b0';
        else if (item.warning)
            return 'lightgrey';
        else if (item.mapped)
            return 'lightblue';
        else
            return 'white';
    }, []);
    return react_1.default.createElement(Grid, null,
        rejectedRows && (react_1.default.createElement("table", null, rejectedRows)),
        items.map(item => (react_1.default.createElement(Product, { key: item.id, style: { background: getBackgroundColor(item) } },
            react_1.default.createElement(ProductRow, null,
                react_1.default.createElement(ProductDetails, { style: {
                        flex: '1 1 100%'
                    } }, getSearchLinks(item.name)),
                react_1.default.createElement(ProductDetails, null,
                    item.quantity,
                    "\u00A0\u0448\u0442"),
                react_1.default.createElement(ProductDetails, null,
                    react_1.default.createElement(Link, { href: `/search/${encodeURI(itemNameToSearchRequest(item.name))}`, target: "_blank" }, "\uD83D\uDD0E"))),
            item.error && (react_1.default.createElement(Error, null, item.error)),
            item.warning && (react_1.default.createElement(Warning, null, "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u0442\u044C \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E"))))));
}
exports["default"] = default_1;
const Grid = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  background: #444;
  overflow: auto;
  overscroll-behavior: contain;
  gap: 1px;
  width: 100%;
`;
const Product = styled_components_1.default.div `
  flex: 0 0 3em;
  padding: 8px;
  background: white;
  
  display: flex;
  flex-direction:column;
  gap: 9px;
`;
const Link = styled_components_1.default.a `
  text-decoration: none;
  color: black;
`;
const ProductRow = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;
const ProductDetails = styled_components_1.default.div `
  display: flex
`;
const Error = styled_components_1.default.div `
  font-weight: 500;
  color: black;
`;
const Warning = styled_components_1.default.div `
  font-size: 1.2em;
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
const params = new URLSearchParams(document.currentScript.src.split('?')[1]);
const promocode = params.get('promocode') || '';
console.log(`[utkonos-ext] initializing (with promocode: "${promocode}")`);
const root = document.createElement('div');
document.body.appendChild(root);
react_dom_1.default.render(react_1.default.createElement(App_1.default, { promocode: promocode }), root);


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
    var _a;
    const [tableData, rowElements] = parseTable(element);
    if (tableData.length == 0)
        return { cartItems: [], rejectedRows: [] };
    console.log("table data");
    console.table(tableData);
    const quantitiesColumn = findQuantitiesColumn(tableData);
    if (quantitiesColumn === undefined) {
        console.log("can't find quantities column");
        return { cartItems: [], rejectedRows: [] };
    }
    const cartItems = [];
    const rejectedRows = [];
    for (let i = 0; i < tableData.length; i++) {
        const row = tableData[i];
        if (row.filter(cell => !isNaN(parseFloat(cell === null || cell === void 0 ? void 0 : cell.trim()))).length == 0) {
            console.log('filter out possible header of footer row: ', row);
            continue;
        }
        let warning = false;
        let quantity = parseInt(row[quantitiesColumn]);
        if (!quantity) {
            console.log(`can't parse quantity from column ${quantitiesColumn}. Using default value. Row: `, row);
            quantity = 1;
            warning = true;
        }
        const link = row.find(item => item.indexOf('utkonos.ru') != -1);
        if (!link) {
            console.log("can't find link for this row", row);
            rejectedRows.push(rowElements[i]);
            continue;
        }
        const id = parseInt(((_a = link.match(/utkonos\.ru\/item\/(\d+)/)) === null || _a === void 0 ? void 0 : _a[1]) || '');
        if (!id) {
            console.log(`can't find ID for this link: ${link}, row: `, row);
            rejectedRows.push(rowElements[i]);
            continue;
        }
        const textRe = new RegExp(/[а-яА-Я]{5,}/);
        const title = row.find(item => item.replace(/\s+/, '').search(textRe) !== -1);
        cartItems.push({
            id: id,
            quantity: quantity,
            name: title || link,
            tableRow: rowElements[i],
            warning: warning,
        });
    }
    return { cartItems: cartItems, rejectedRows: rejectedRows };
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
            if (link !== null && link instanceof HTMLElement) {
                rowData.push(link.getAttribute('href') || '');
            }
            rowData.push(cell.textContent || '');
        }
        tableData.push(rowData);
    }
    return [tableData, rowElements];
}
function findQuantitiesColumn(tableData) {
    var _a;
    let filteredRows = tableData.map(row => row.map(cell => cell.replace(/\s*(штук|шт)\.?\s*/ig, '')));
    // filter out possible headers/footers
    filteredRows = filteredRows.filter(row => row.filter(cell => !isNaN(parseFloat(cell === null || cell === void 0 ? void 0 : cell.trim()))).length > 0 // there are at least some numeric values
    );
    const avgFilledCellsNumber = Math.round(filteredRows
        .map(row => row.filter(x => !!(x === null || x === void 0 ? void 0 : x.trim())).length)
        .reduce((prev, len) => prev + len, 0)
        / filteredRows.length);
    filteredRows = filteredRows.filter(row => row.filter(cell => !!(cell === null || cell === void 0 ? void 0 : cell.trim())).length == avgFilledCellsNumber // cells count = avg count
    );
    console.log("Detecting quantities column. This is the filtered data");
    console.table(filteredRows);
    for (let i = 0; i < ((_a = filteredRows[0]) === null || _a === void 0 ? void 0 : _a.length); i++) {
        const columnData = filteredRows.map(row => row[i]);
        // if (filteredRows[0][i].indexOf('utkonos.ru') != -1) {
        //   console.log(`column ${i} seems to contain links`)
        //   links = columnData
        //   continue
        // }
        const numericValues = columnData.map(x => parseFloat(x === null || x === void 0 ? void 0 : x.trim()));
        if (numericValues.find(isNaN) !== undefined) {
            console.log(`column ${i} is not all numbers`);
            continue;
        }
        if (numericValues.every((x, i) => {
            return i === 0 || x > numericValues[i - 1];
        })) {
            console.log(`column ${i} looks like a row numbers`);
            continue;
        }
        const avgValue = numericValues.reduce((result, item) => result + item, 0) / columnData.length;
        const rateOfRoundValues = numericValues.filter(x => Math.round(x) == x).length / columnData.length;
        if (avgValue < 15 && rateOfRoundValues > 0.5) {
            console.log(`column ${i} seems to have a quantities`);
            return i;
        }
        console.log(`column ${i} ignored. Average value: ${avgValue}, rate of rounded values: ${rateOfRoundValues})`);
    }
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
    for (const m of text.matchAll(/utkonos\.ru\/item\/(\d+)/g)) {
        const id = m[1];
        if (seenItems.has(id)) {
            continue;
        }
        seenItems.add(id);
        items.push({
            id: parseInt(id),
            quantity: 1,
            name: `https://utkonos.ru/item/${id}/`,
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
        const { cartItems, rejectedRows } = (0, extract_from_table_1.extractFromTable)(el);
        if (cartItems.length > 0)
            return { withCounts: true, cartItems, rejectedRows };
    }
    return {
        cartItems: (0, extract_unstructured_1.extractFromUnstructuredText)(el),
        rejectedRows: [],
        withCounts: false,
    };
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

/***/ "./src/utkonos/api_legacy.ts":
/*!***********************************!*\
  !*** ./src/utkonos/api_legacy.ts ***!
  \***********************************/
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
exports.utkonosLegacyAPI = void 0;
const Cookies = __importStar(__webpack_require__(/*! es-cookie */ "./node_modules/es-cookie/src/es-cookie.js"));
const helpers_1 = __webpack_require__(/*! ../sdk/helpers */ "./src/sdk/helpers.ts");
const exceptions_1 = __webpack_require__(/*! ./exceptions */ "./src/utkonos/exceptions.ts");
class UtkonosLegacyAPI {
    saveCartBulk(items) {
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
    modifyCartItem(item) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.makeRequest("cartItemModify", {
                "GoodsItemId": item.id.toString(),
                "Quantity": item.quantity,
                "Return": { "Cart": 1, "CartItemList": 0, "TotalCost": 0 },
                "Source": null,
                "SourceId": null,
            });
            const cartNotice = (_c = (_b = (_a = (response.Body.CartList || [])[0]) === null || _a === void 0 ? void 0 : _a.CartNotices) === null || _b === void 0 ? void 0 : _b.CartNoticeList[0]) === null || _c === void 0 ? void 0 : _c.Description;
            if (cartNotice) {
                throw new exceptions_1.UtkonosAPIException(cartNotice);
            }
            return response;
        });
    }
    goodsItemSearchByid(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestBody = {
                "Id": id.toString(),
                "Return": {
                    "BrandInfo": 1
                }
            };
            return this.makeRequest("goodsItemSearchByid", requestBody);
        });
    }
    cartPromocodeAdd(code) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.makeRequest('cartPromocodeAdd', {
                Code: code,
            });
        });
    }
    // searchById
    //   fetch("https://www.utkonos.ru/api/v1/goodsItemSearchByid", {
    //   "headers": {
    //     "accept": "application/json, text/plain, */*",
    //     "accept-language": "en-US,en;q=0.9,ru;q=0.8",
    //     "cache-control": "no-cache",
    //     "content-type": "multipart/form-data; boundary=----WebKitFormBoundary7crB16oreZ2ti08S",
    //     "pragma": "no-cache",
    //     "sec-ch-ua": "\"Chromium\";v=\"106\", \"Google Chrome\";v=\"106\", \"Not;A=Brand\";v=\"99\"",
    //     "sec-ch-ua-mobile": "?0",
    //     "sec-ch-ua-platform": "\"macOS\"",
    //     "sec-fetch-dest": "empty",
    //     "sec-fetch-mode": "cors",
    //     "sec-fetch-site": "same-origin"
    //   },
    //   "referrer": "https://www.utkonos.ru/item/3456177/korm-vlazhnyj-whiskas-polnoracionnyj-pashtet-s-govjadinoj-i-pechenju-dlja-vzroslykh-koshek-24-shtuk-po-75-g",
    //   "referrerPolicy": "no-referrer-when-downgrade",
    //   "body": "------WebKitFormBoundary7crB16oreZ2ti08S\r\nContent-Disposition: form-data; name=\"request\"\r\n\r\n{\"Head\":{\"DeviceId\":\"60415571-f163-4aae-c215-b34a91364f00\",\"Domain\":\"www.utkonos.ru\",\"RequestId\":\"fd947996c73548e3f5fe1cb65ec88da8\",\"MarketingPartnerKey\":\"mp-cc3c743ffd17487a9021d11129548218\",\"Version\":\"angular_web_0.0.2\",\"Client\":\"angular_web_0.0.2\",\"Method\":\"goodsItemSearchByid\",\"Store\":\"utk\",\"SessionToken\":\"6F9EF1A46C71F4861ECD7C225D3371E0\"},\"Body\":{\"Id\":\"3456177\",\"Return\":{\"BrandInfo\":1,\"Recipes\":1}}}\r\n------WebKitFormBoundary7crB16oreZ2ti08S--\r\n",
    //   "method": "POST",
    //   "mode": "cors",
    //   "credentials": "include"
    // });
    makeRequest(method, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceData = JSON.parse(localStorage.getItem('device_data') || '{}');
            const sessionToken = yield Cookies.get('Utk_SessionToken');
            const host = window.location.host;
            const request = {
                "Head": {
                    "DeviceId": deviceData['device_id'],
                    "Domain": host,
                    "RequestId": (0, helpers_1.uuidv4)().replaceAll(/-/g, ''),
                    "MarketingPartnerKey": "mp-cc3c743ffd17487a9021d11129548218",
                    "Version": "utkonos-ext",
                    "Client": "utkonos-ext",
                    "Method": method,
                    "Store": "utk",
                    "SessionToken": sessionToken,
                },
                "Body": requestBody,
            };
            console.log("[legacy API] sending request to method", method, request);
            const formData = new FormData();
            formData.append("request", JSON.stringify(request));
            const response = yield fetch(`https://${host}/api/rest/${method}`, {
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
                "referrer": `https://${host}/`,
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": formData,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });
            const data = yield response.json();
            console.log('response: ', data);
            if (data.Body.ErrorList) {
                throw new exceptions_1.UtkonosAPIException(data.Body.ErrorList[0].Description);
            }
            return data;
        });
    }
}
exports.utkonosLegacyAPI = new UtkonosLegacyAPI();


/***/ }),

/***/ "./src/utkonos/api_new.ts":
/*!********************************!*\
  !*** ./src/utkonos/api_new.ts ***!
  \********************************/
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
exports.utkonosNewAPI = void 0;
const Cookies = __importStar(__webpack_require__(/*! es-cookie */ "./node_modules/es-cookie/src/es-cookie.js"));
const helpers_1 = __webpack_require__(/*! ../sdk/helpers */ "./src/sdk/helpers.ts");
const exceptions_1 = __webpack_require__(/*! ./exceptions */ "./src/utkonos/exceptions.ts");
class UtkonosNewAPI {
    modifyCartItem(item) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.makeRequest("cartItemModify", {
                "GoodsItemId": item.id,
                "Quantity": item.quantity,
                "Return": {
                    "Cart": 0,
                    "Goods": 0,
                }
            });
            const cartNotice = (_c = (_b = (_a = data.Body.CartList[0]) === null || _a === void 0 ? void 0 : _a.CartNotices) === null || _b === void 0 ? void 0 : _b.CartNoticeList[0]) === null || _c === void 0 ? void 0 : _c.Description;
            if (cartNotice) {
                throw new exceptions_1.UtkonosAPIException(cartNotice);
            }
            return data;
        });
    }
    cartPromocodeAdd(code) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.makeRequest('cartPromocodeAdd', {
                Code: code,
            });
        });
    }
    //   fetch("https://www.utkonos.ru/api/rest/cartItemModify", {
    //   "headers": {
    //     "accept": "application/json, text/plain, */*",
    //     "accept-language": "en-US,en;q=0.9,ru;q=0.8",
    //     "content-type": "application/x-www-form-urlencoded",
    //     "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
    //     "sec-ch-ua-mobile": "?0",
    //     "sec-ch-ua-platform": "\"macOS\"",
    //     "sec-fetch-dest": "empty",
    //     "sec-fetch-mode": "cors",
    //     "sec-fetch-site": "same-origin",
    //     "x-retail-brand": "utk"
    //   },
    //   "referrer": "https://www.utkonos.ru/action/detail/39815",
    //   "referrerPolicy": "strict-origin-when-cross-origin",
    //   "body:"
    //         request:{ "Head": {
    //           "RequestId": "fd947996c73548e3f5fe1cb65ec88da8",
    //             "MarketingPartnerKey": "mp80-661295c9cbf9d6b2f6428414504a8deed3020641",
    //             "Version": "angular_web_0.0.2",
    //             "Client": "angular_web_0.0.2",
    //             "Method": "cartItemModify",
    //             "DeviceId": "98830fe6-f566-7609-903c-7c643e46ffa2",
    //             "Domain": "moscow",
    //             "Store": "utk",
    //             "SessionToken": "FC0FED52A9A1E28364406274E2A32B07"
    //         }, "Body": { "GoodsItemId": "567405", "Quantity": 1, "Return": { "Cart": 1, "Goods": 1 } }
    //         }
    //   "method": "POST",
    //   "mode": "cors",
    //   "credentials": "include"
    // });
    //
    makeRequest(method, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionToken = yield Cookies.get('Utk_SessionToken');
            const deviceId = yield Cookies.get('Utk_DvcGuid');
            const request = {
                "Head": {
                    "DeviceId": deviceId,
                    "SessionToken": sessionToken,
                    "RequestId": (0, helpers_1.uuidv4)().replaceAll(/-/g, ''),
                    "MarketingPartnerKey": "mp80-661295c9cbf9d6b2f6428414504a8deed3020641",
                    "Version": "utkonos-ext",
                    "Client": "utkonos-ext",
                    "Method": method,
                    "Domain": "moscow",
                    "Store": "utk",
                },
                "Body": requestBody,
            };
            console.log("[new API] sending request to method", method, request);
            // const formData = new URLSearchParams()
            // formData.append("request", JSON.stringify(request))
            const formData = `request=${JSON.stringify(request)}`;
            const response = yield fetch(`https://www.utkonos.ru/api/rest/${method}`, {
                "headers": {
                    "Accept": "application/json, text/plain, */*",
                    "Accept-Language": "en-US,en;q=0.9,ru;q=0.8",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-retail-brand": "utk"
                },
                "referrer": "https://www.utkonos.ru/",
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": formData,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });
            if (!response.ok)
                throw new exceptions_1.UtkonosAPIException(response.statusText);
            const data = yield response.json();
            console.log('response: ', data);
            if (data.Body.ErrorList) {
                throw new exceptions_1.UtkonosAPIException(data.Body.ErrorList[0].Message);
            }
            return data;
        });
    }
}
exports.utkonosNewAPI = new UtkonosNewAPI();


/***/ }),

/***/ "./src/utkonos/exceptions.ts":
/*!***********************************!*\
  !*** ./src/utkonos/exceptions.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UtkonosAPIException = void 0;
class UtkonosAPIException extends Error {
    constructor(message) {
        super(message);
        this.name = "UtkonosAPIException";
    }
}
exports.UtkonosAPIException = UtkonosAPIException;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztXQ2hEQTs7Ozs7VUVBQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdXRrb25vcy1leHQvLi9zcmMvQXBwLnRzeCIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC8uL3NyYy9jb21wb25lbnRzL0dyaWQudHN4Iiwid2VicGFjazovL3V0a29ub3MtZXh0Ly4vc3JjL2luamVjdGVkX3NjcmlwdC50c3giLCJ3ZWJwYWNrOi8vdXRrb25vcy1leHQvLi9zcmMvcGFyc2luZy9leHRyYWN0X2Zyb21fdGFibGUudHMiLCJ3ZWJwYWNrOi8vdXRrb25vcy1leHQvLi9zcmMvcGFyc2luZy9leHRyYWN0X3Vuc3RydWN0dXJlZC50cyIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC8uL3NyYy9wYXJzaW5nL2luZGV4LnRzIiwid2VicGFjazovL3V0a29ub3MtZXh0Ly4vc3JjL3Nkay9oZWxwZXJzLnRzIiwid2VicGFjazovL3V0a29ub3MtZXh0Ly4vc3JjL3Nkay94cGF0aC50cyIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC8uL3NyYy91dGtvbm9zL2FwaV9sZWdhY3kudHMiLCJ3ZWJwYWNrOi8vdXRrb25vcy1leHQvLi9zcmMvdXRrb25vcy9hcGlfbmV3LnRzIiwid2VicGFjazovL3V0a29ub3MtZXh0Ly4vc3JjL3V0a29ub3MvZXhjZXB0aW9ucy50cyIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL3V0a29ub3MtZXh0L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3V0a29ub3MtZXh0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL3V0a29ub3MtZXh0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdXRrb25vcy1leHQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC93ZWJwYWNrL3J1bnRpbWUvbm9kZSBtb2R1bGUgZGVjb3JhdG9yIiwid2VicGFjazovL3V0a29ub3MtZXh0L3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL3V0a29ub3MtZXh0L3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3V0a29ub3MtZXh0L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly91dGtvbm9zLWV4dC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgcmVhY3RfMSA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwicmVhY3RcIikpO1xuY29uc3Qgc3R5bGVkX2NvbXBvbmVudHNfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwic3R5bGVkLWNvbXBvbmVudHNcIikpO1xuY29uc3QgQ29va2llcyA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiZXMtY29va2llXCIpKTtcbmNvbnN0IHBhcnNpbmdfMSA9IHJlcXVpcmUoXCIuL3BhcnNpbmdcIik7XG5jb25zdCBhcGlfbGVnYWN5XzEgPSByZXF1aXJlKFwiLi91dGtvbm9zL2FwaV9sZWdhY3lcIik7XG5jb25zdCBhcGlfbmV3XzEgPSByZXF1aXJlKFwiLi91dGtvbm9zL2FwaV9uZXdcIik7XG5jb25zdCBHcmlkXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vY29tcG9uZW50cy9HcmlkXCIpKTtcbmNvbnN0IGV4Y2VwdGlvbnNfMSA9IHJlcXVpcmUoXCIuL3V0a29ub3MvZXhjZXB0aW9uc1wiKTtcbmNvbnN0IGdldE1hcHBpbmcgPSAoKCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBNYXAoKTtcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2Ygd2luZG93LnNrdU1hcHBpbmcpIHtcbiAgICAgICAgcmVzdWx0LnNldChpdGVtLm5ld191dGtfaWQsIGl0ZW0ub2xkX3V0a19pZCk7XG4gICAgfVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbn0pKCk7XG5mdW5jdGlvbiBBcHAocHJvcHMpIHtcbiAgICBjb25zdCBbdmlzaWJsZSwgc2V0VmlzaWJsZV0gPSAoMCwgcmVhY3RfMS51c2VTdGF0ZSkoZmFsc2UpO1xuICAgIGNvbnN0IGVkaXRvclJlZiA9ICgwLCByZWFjdF8xLnVzZVJlZikobnVsbCk7XG4gICAgY29uc3QgW3Byb2dyZXNzU3RhdGUsIHNldFByb2dyZXNzU3RhdGVdID0gKDAsIHJlYWN0XzEudXNlU3RhdGUpKG51bGwpO1xuICAgIGNvbnN0IFtub3Rlcywgc2V0Tm90ZXNdID0gKDAsIHJlYWN0XzEudXNlU3RhdGUpKFtdKTtcbiAgICBjb25zdCBbaXRlbXMsIHNldEl0ZW1zXSA9ICgwLCByZWFjdF8xLnVzZVN0YXRlKShbXSk7XG4gICAgY29uc3QgW3JlamVjdGVkUm93cywgc2V0UmVqZWN0ZWRSb3dzXSA9ICgwLCByZWFjdF8xLnVzZVN0YXRlKShbXSk7XG4gICAgY29uc3QgbWFwcGluZyA9IGdldE1hcHBpbmcoKTtcbiAgICBjb25zdCBvbkxlZ2FjeURvbWFpbiA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0Lm1hdGNoKC9hZG1cXC51dGtvbm9zXFwucnUvKTtcbiAgICBjb25zdCBvbk5ld0NhbmFyeVJlbGVhc2UgPSBDb29raWVzLmdldCgnQ2FuYXJ5UmVsZWFzZVJvdXRlVjQnKSA9PT0gJ2xvJztcbiAgICBjb25zdCBvbk5ld1ZlcnNpb24gPSAhb25MZWdhY3lEb21haW4gJiYgb25OZXdDYW5hcnlSZWxlYXNlO1xuICAgIGNvbnN0IHByb21vY29kZSA9IHByb3BzLnByb21vY29kZTtcbiAgICB1c2VLZXlib2FyZEhhbmRsZXIoZXYgPT4gZXYua2V5ID09ICdFc2NhcGUnLCAoKSA9PiBzZXRWaXNpYmxlKCF2aXNpYmxlKSwgW3Zpc2libGVdKTtcbiAgICBjb25zdCBvblBhc3RlID0gKDAsIHJlYWN0XzEudXNlQ2FsbGJhY2spKCgpID0+IHtcbiAgICAgICAgc2V0Tm90ZXMoW10pO1xuICAgICAgICBjb25zdCBub3RlcyA9IFtdO1xuICAgICAgICBpZiAoIWVkaXRvclJlZi5jdXJyZW50KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGlmICghZWRpdG9yUmVmLmN1cnJlbnQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgZWRpdG9yUmVmLmN1cnJlbnQgJiYgcHJlcGFyZVRleHRhcmVhQ29udGVudChlZGl0b3JSZWYuY3VycmVudCk7XG4gICAgICAgICAgICBjb25zdCB7IGNhcnRJdGVtcywgcmVqZWN0ZWRSb3dzLCB3aXRoQ291bnRzIH0gPSAoMCwgcGFyc2luZ18xLmV4dHJhY3REYXRhKShlZGl0b3JSZWYuY3VycmVudCk7XG4gICAgICAgICAgICBpZiAoIXdpdGhDb3VudHMpIHtcbiAgICAgICAgICAgICAgICBzZXROb3RlcyhbXCLQndC1INGD0LTQsNC70L7RgdGMINGA0LDRgdC/0L7Qt9C90LDRgtGMINC60L7Qu9C+0L3QutGDINGC0LDQsdC70LjRhtGLINGBINC60L7Qu9C40YfQtdGB0YLQstCw0LzQuCDigJMg0LLQtdC30LTQtSDQsdGD0LTRg9GCICcxJ1wiLCAuLi5ub3Rlc10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFvbk5ld1ZlcnNpb24pIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgY2FydEl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXBwaW5nLmhhcyhpdGVtLmlkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5vcmlnaW5hbElkID0gaXRlbS5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uaWQgPSBtYXBwaW5nLmdldChpdGVtLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ubWFwcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBtYXBwZWQgJHtpdGVtLm5hbWV9OiAke2l0ZW0ub3JpZ2luYWxJZH0gdG8gJHtpdGVtLmlkfWApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0UmVqZWN0ZWRSb3dzKHJlamVjdGVkUm93cyk7XG4gICAgICAgICAgICBzZXRJdGVtcyhjYXJ0SXRlbXMpO1xuICAgICAgICB9LCAxMDApO1xuICAgIH0sIFtlZGl0b3JSZWYsIG5vdGVzXSk7XG4gICAgY29uc3QgYXBwbHlQcm9tb2NvZGUgPSAoMCwgcmVhY3RfMS51c2VDYWxsYmFjaykoKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBpZiAocHJvbW9jb2RlKSB7XG4gICAgICAgICAgICBjb25zdCBhcGkgPSBvbk5ld1ZlcnNpb24gPyBhcGlfbmV3XzEudXRrb25vc05ld0FQSSA6IGFwaV9sZWdhY3lfMS51dGtvbm9zTGVnYWN5QVBJO1xuICAgICAgICAgICAgc2V0UHJvZ3Jlc3NTdGF0ZShcItC/0YDQuNC80LXQvdGP0LXQvCDQv9GA0L7QvNC+0LrQvtC0XCIpO1xuICAgICAgICAgICAgeWllbGQgYXBpX2xlZ2FjeV8xLnV0a29ub3NMZWdhY3lBUEkuY2FydFByb21vY29kZUFkZChwcm9tb2NvZGUpO1xuICAgICAgICAgICAgc2V0UHJvZ3Jlc3NTdGF0ZShcIlwiKTtcbiAgICAgICAgICAgIHNldE5vdGVzKFtcItCf0YDQvtC80L7QutC+0LQg0L/QvtC/0YDQvtCx0L7QstCw0LvQuCDQv9GA0LjQvNC10L3QuNGC0YwhINCg0LXQt9GD0LvRjNGC0LDRgiDQvdGD0LbQvdC+INC/0YDQvtCy0LXRgNC40YLRjCFcIiwgLi4ubm90ZXNdKTtcbiAgICAgICAgfVxuICAgIH0pLCBbcHJvbW9jb2RlLCBvbk5ld1ZlcnNpb24sIG5vdGVzXSk7XG4gICAgY29uc3Qgc2F2ZSA9ICgwLCByZWFjdF8xLnVzZUNhbGxiYWNrKSgoKSA9PiB7XG4gICAgICAgIHNldE5vdGVzKFtdKTtcbiAgICAgICAgY29uc3Qgbm90ZXMgPSBbXTtcbiAgICAgICAgY29uc3Qgc2F2ZUNhcnQgPSAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYWRkaW5nIGl0ZW1zJywgaXRlbXMpO1xuICAgICAgICAgICAgY29uc3QgYXBpID0gb25OZXdWZXJzaW9uID8gYXBpX25ld18xLnV0a29ub3NOZXdBUEkgOiBhcGlfbGVnYWN5XzEudXRrb25vc0xlZ2FjeUFQSTtcbiAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgIGxldCBzYXZlZENvdW50ID0gMDtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICBzZXRQcm9ncmVzc1N0YXRlKGAke2l9INC40LcgJHtpdGVtcy5sZW5ndGh9YCk7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgYXBpLm1vZGlmeUNhcnRJdGVtKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICBzYXZlZENvdW50Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpdGVtIGlzIGZhaWxlZCB0byBzYXZlOiBcIiwgaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3Igd2FzOiBcIiwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIGV4Y2VwdGlvbnNfMS5VdGtvbm9zQVBJRXhjZXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmVycm9yID0gZXJyLm1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRJdGVtcyhbLi4uaXRlbXNdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldFByb2dyZXNzU3RhdGUoXCLQv9GA0LjQvNC10L3Rj9C10Lwg0L/RgNC+0LzQvtC60L7QtFwiKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgeWllbGQgYXBwbHlQcm9tb2NvZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZhaWxlZCB0byBhcHBseSBwcm9tb2NvZGUnLCBlKTtcbiAgICAgICAgICAgICAgICBhbGVydChcItCd0LUg0YPQtNCw0LvQvtGB0Ywg0L/RgNC40LzQtdC90LjRgtGMINC/0YDQvtC80L7QutC+0LQ6IFwiICsgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2F2ZWRDb3VudDtcbiAgICAgICAgfSk7XG4gICAgICAgIHNhdmVDYXJ0KCkudGhlbigoc3VjY2Vzc0NvdW50KSA9PiB7XG4gICAgICAgICAgICBzZXROb3RlcyhbXG4gICAgICAgICAgICAgICAgYNCh0L7RhdGA0LDQvdC40LvQuCDRg9GB0L/QtdGI0L3QviAke3N1Y2Nlc3NDb3VudH0g0YLQvtCy0LDRgNC+0LIg0LjQtyAke2l0ZW1zLmxlbmd0aH0uYCxcbiAgICAgICAgICAgICAgICBg0KLQvtCy0LDRgNGLLCDQutC+0YLQvtGA0YvQtSDQvdC1INGD0LTQsNC70L7RgdGMINGB0L7RhdGA0LDQvdC40YLRjCDQvtGC0LzQtdGH0LXQvdGLINC60YDQsNGB0L3Ri9C8INGG0LLQtdGC0L7QvGAsXG4gICAgICAgICAgICAgICAgYNCY0LfQvNC10L3QtdC90LjRjyDQsiDQutC+0YDQt9C40L3QtSDQsdGD0LTRg9GCINCy0LjQtNC90Ysg0L/QvtGB0LvQtSDQv9C10YDQtdC30LDQs9GA0YPQt9C60Lgg0YHRgtGA0LDQvdC40YbRi2AsXG4gICAgICAgICAgICAgICAgLi4ubm90ZXMsXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIHNldFByb2dyZXNzU3RhdGUobnVsbCk7XG4gICAgICAgICAgICAvLyB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgc2V0UHJvZ3Jlc3NTdGF0ZShudWxsKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmYWlsZWQgdG8gc2F2ZScsIGVycik7XG4gICAgICAgICAgICBhbGVydChg0J3QtSDRg9C00LDQu9C+0YHRjCDRgdC+0YXRgNCw0L3QuNGC0Yw6ICR7ZXJyfWApO1xuICAgICAgICB9KTtcbiAgICB9LCBbYXBwbHlQcm9tb2NvZGUsIGl0ZW1zXSk7XG4gICAgcmV0dXJuIChyZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChyZWFjdF8xLmRlZmF1bHQuU3RyaWN0TW9kZSwgbnVsbCxcbiAgICAgICAgdmlzaWJsZSAmJiAocmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoUm9vdCwgeyBjbGFzc05hbWU6IFwidXRrb25vcy1leHQtcm9vdFwiIH0sXG4gICAgICAgICAgICBpdGVtcy5sZW5ndGggPiAwICYmIHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KEdyaWRfMS5kZWZhdWx0LCB7IGl0ZW1zOiBpdGVtcywgcmVqZWN0ZWRSb3dzOiByZWplY3RlZFJvd3MgfSksXG4gICAgICAgICAgICBpdGVtcy5sZW5ndGggPT0gMCAmJiAocmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoVGV4dEFyZWEsIHsgY29udGVudEVkaXRhYmxlOiB0cnVlLCByZWY6IGVkaXRvclJlZiwgb25QYXN0ZTogb25QYXN0ZSB9KSksXG4gICAgICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChOb3RlcywgbnVsbCxcbiAgICAgICAgICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBvbk5ld1ZlcnNpb24gPyBcItCS0LXRgNGB0LjRjyDRgdCw0LnRgtCwINC90L7QstCw0Y9cIiA6IFwi0JLQtdGA0YHQuNGPINGB0LDQudGC0LAg0YHRgtCw0YDQsNGPXCIpLFxuICAgICAgICAgICAgICAgIHByb21vY29kZSAmJiByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcIlxcdTA0MThcXHUwNDQxXFx1MDQzRlxcdTA0M0VcXHUwNDNCXFx1MDQ0Q1xcdTA0MzdcXHUwNDQzXFx1MDQzNVxcdTA0NDJcXHUwNDQxXFx1MDQ0RiBcXHUwNDNGXFx1MDQ0MFxcdTA0M0VcXHUwNDNDXFx1MDQzRVxcdTA0M0FcXHUwNDNFXFx1MDQzNCBcIixcbiAgICAgICAgICAgICAgICAgICAgcHJvbW9jb2RlKSxcbiAgICAgICAgICAgICAgICBub3Rlcy5tYXAoeCA9PiByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGtleTogeCB9LCB4KSkpLFxuICAgICAgICAgICAgcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IG9uQ2xpY2s6IHNhdmUsIGRpc2FibGVkOiAhIXByb2dyZXNzU3RhdGUgfHwgIWl0ZW1zLmxlbmd0aCB9LCBwcm9ncmVzc1N0YXRlICE9PSBudWxsICYmIHByb2dyZXNzU3RhdGUgIT09IHZvaWQgMCA/IHByb2dyZXNzU3RhdGUgOiBcItCU0L7QsdCw0LLQuNGC0YxcIiksXG4gICAgICAgICAgICBpdGVtcy5sZW5ndGggPiAwICYmIChyZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChDbGVhckJ1dHRvbiwgeyBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNldEl0ZW1zKFtdKTtcbiAgICAgICAgICAgICAgICAgICAgc2V0UmVqZWN0ZWRSb3dzKFtdKTtcbiAgICAgICAgICAgICAgICB9IH0sIFwiXFx1Mjc0Q1wiKSkpKSxcbiAgICAgICAgcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoQmFkZ2UsIHsgb25DbGljazogKCkgPT4gc2V0VmlzaWJsZSghdmlzaWJsZSkgfSkpKTtcbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEFwcDtcbmZ1bmN0aW9uIHVzZUtleWJvYXJkSGFuZGxlcihmaWx0ZXIsIGNiLCBkZXBzKSB7XG4gICAgKDAsIHJlYWN0XzEudXNlRWZmZWN0KSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSAoZXYpID0+IHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXIoZXYpKVxuICAgICAgICAgICAgICAgIGNiKCk7XG4gICAgICAgIH07XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgaGFuZGxlcik7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIGhhbmRsZXIpO1xuICAgICAgICB9O1xuICAgIH0sIGRlcHMpO1xufVxuZnVuY3Rpb24gcHJlcGFyZVRleHRhcmVhQ29udGVudChzdGFydE5vZGUpIHtcbiAgICBjbGVhckN1c3RvbVN0eWxpbmcoc3RhcnROb2RlKTtcbiAgICBzZXRMaW5rc1RhcmdldChzdGFydE5vZGUpO1xufVxuZnVuY3Rpb24gY2xlYXJDdXN0b21TdHlsaW5nKHN0YXJ0Tm9kZSkge1xuICAgIGxldCBub2RlO1xuICAgIGNvbnN0IGl0ZXJhdG9yID0gZG9jdW1lbnQuY3JlYXRlTm9kZUl0ZXJhdG9yKHN0YXJ0Tm9kZSwgTm9kZUZpbHRlci5TSE9XX0FMTCk7XG4gICAgd2hpbGUgKG5vZGUgPSBpdGVyYXRvci5uZXh0Tm9kZSgpKSB7XG4gICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlICYmIG5vZGUucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNldExpbmtzVGFyZ2V0KHN0YXJ0Tm9kZSkge1xuICAgIGxldCBub2RlO1xuICAgIGNvbnN0IGl0ZXJhdG9yID0gZG9jdW1lbnQuY3JlYXRlTm9kZUl0ZXJhdG9yKHN0YXJ0Tm9kZSwgTm9kZUZpbHRlci5TSE9XX0FMTCk7XG4gICAgd2hpbGUgKG5vZGUgPSBpdGVyYXRvci5uZXh0Tm9kZSgpKSB7XG4gICAgICAgIGlmIChub2RlLnRhZ05hbWUgPT0gJ0EnKSB7XG4gICAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZSgndGFyZ2V0JywgJ19ibGFuaycpO1xuICAgICAgICB9XG4gICAgfVxufVxuY29uc3QgUm9vdCA9IHN0eWxlZF9jb21wb25lbnRzXzEuZGVmYXVsdC5kaXYgYFxuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHdpZHRoOiA2MDBweDtcbiAgaGVpZ2h0OiA4MHZoO1xuICB0b3A6IGNhbGMoNTAlIC0gNDB2aCk7XG4gIHJpZ2h0OiA1cHg7XG4gIGJhY2tncm91bmQ6ICNmZmQ5ZDk7XG4gIHotaW5kZXg6IDEwMDA7XG4gIGJvcmRlcjogMXB4IHNvbGlkICM1NTU7XG4gIGJvcmRlci1yYWRpdXM6IDdweDtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIG92ZXJmbG93OiBoaWRkZW47XG5gO1xuY29uc3QgVGV4dEFyZWEgPSBzdHlsZWRfY29tcG9uZW50c18xLmRlZmF1bHQuZGl2IGBcbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogMTAwJTtcbiAgYm9yZGVyLXJhZGl1czogN3B4O1xuICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgb3ZlcmZsb3c6IHNjcm9sbDtcbiAgXG4gIGZvbnQtc2l6ZTogMC44ZW07XG4gIFxuICBwYWRkaW5nOiA1cHggMTBweDtcbmA7XG5jb25zdCBOb3RlcyA9IHN0eWxlZF9jb21wb25lbnRzXzEuZGVmYXVsdC5kaXYgYFxuICBmb250LXNpemU6IDEwcHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5gO1xuY29uc3QgQnV0dG9uID0gc3R5bGVkX2NvbXBvbmVudHNfMS5kZWZhdWx0LmJ1dHRvbiBgXG4gIG1hcmdpbjogNXB4O1xuICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcbiAgYm9yZGVyLXJhZGl1czogM3B4O1xuYDtcbmNvbnN0IEJhZGdlID0gc3R5bGVkX2NvbXBvbmVudHNfMS5kZWZhdWx0LmRpdiBgXG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgaGVpZ2h0OiA3M3B4O1xuICB3aWR0aDogMzZweDtcbiAgdG9wOiAwO1xuICByaWdodDogMDtcbiAgei1pbmRleDogMTAwMDtcbiAgYmFja2dyb3VuZDogdXJsKGh0dHBzOi8vbWF5YWsuaGVscC93cC1jb250ZW50L3RoZW1lcy9tYXlhay9pbWcvbG9nby5wbmcpO1xuICB0cmFuc2Zvcm06IHNjYWxlKDAuOCk7XG4gIC13ZWJraXQtdHJhbnNmb3JtLW9yaWdpbi14OiByaWdodDtcbiAgLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luLXk6IHRvcDtcbmA7XG5jb25zdCBDbGVhckJ1dHRvbiA9IHN0eWxlZF9jb21wb25lbnRzXzEuZGVmYXVsdC5hIGBcbiAgZGlzcGxheTogYmxvY2s7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICByaWdodDogMTBweDtcbiAgd2lkdGg6IDFlbTtcbiAgaGVpZ2h0OiAxZW07XG4gIHBhZGRpbmc6IDVweDtcbiAgYmFja2dyb3VuZDogd2hpdGU7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgbGluZS1oZWlnaHQ6IDE3cHg7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgXG4gIG9wYWNpdHk6IDAuNjtcbiAgdHJhbnNpdGlvbjogYWxsIC4ycyBlYXNlLWluLW91dDtcbiAgXG4gICY6aG92ZXIge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxLjEpO1xuICB9XG5gO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHJlYWN0XzEgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcInJlYWN0XCIpKTtcbmNvbnN0IHN0eWxlZF9jb21wb25lbnRzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcInN0eWxlZC1jb21wb25lbnRzXCIpKTtcbmZ1bmN0aW9uIGl0ZW1OYW1lVG9TZWFyY2hSZXF1ZXN0KG5hbWUpIHtcbiAgICByZXR1cm4gbmFtZVxuICAgICAgICAucmVwbGFjZSgvXFwoLis/XFwpLywgJycpXG4gICAgICAgIC5yZXBsYWNlKC/QtNC+XFxzXFxkLisvLCAnJylcbiAgICAgICAgLnJlcGxhY2UoLyjRhNCw0YF80LLQtdGBfNCx0LXQt3zQt9C80LYpXFwuPy8sICcnKVxuICAgICAgICAucmVwbGFjZSgvLFxccy4rLywgJycpO1xufVxuZnVuY3Rpb24gZ2V0U2VhcmNoTGlua3MobmFtZSkge1xuICAgIGNvbnN0IGNodW5rcyA9IG5hbWUuc3BsaXQoJyAnKTtcbiAgICByZXR1cm4gcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQocmVhY3RfMS5kZWZhdWx0LkZyYWdtZW50LCBudWxsLCBjaHVua3MubWFwKChjaHVuaywgaSkgPT4gcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoTGluaywgeyBocmVmOiBgL3NlYXJjaC8ke2VuY29kZVVSSShjaHVua3Muc2xpY2UoMCwgaSArIDEpLmpvaW4oXCIgXCIpKX0vYCwgdGFyZ2V0OiBcIl9ibGFua1wiIH0sXG4gICAgICAgIGNodW5rLFxuICAgICAgICBcIlxcdTAwQTBcIikpKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRfMSh7IGl0ZW1zLCByZWplY3RlZFJvd3MgfSkge1xuICAgIGNvbnN0IGdldEJhY2tncm91bmRDb2xvciA9ICgwLCByZWFjdF8xLnVzZUNhbGxiYWNrKSgoaXRlbSkgPT4ge1xuICAgICAgICBpZiAoaXRlbS5lcnJvcilcbiAgICAgICAgICAgIHJldHVybiAnI2ZmYjBiMCc7XG4gICAgICAgIGVsc2UgaWYgKGl0ZW0ud2FybmluZylcbiAgICAgICAgICAgIHJldHVybiAnbGlnaHRncmV5JztcbiAgICAgICAgZWxzZSBpZiAoaXRlbS5tYXBwZWQpXG4gICAgICAgICAgICByZXR1cm4gJ2xpZ2h0Ymx1ZSc7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiAnd2hpdGUnO1xuICAgIH0sIFtdKTtcbiAgICByZXR1cm4gcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoR3JpZCwgbnVsbCxcbiAgICAgICAgcmVqZWN0ZWRSb3dzICYmIChyZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcInRhYmxlXCIsIG51bGwsIHJlamVjdGVkUm93cykpLFxuICAgICAgICBpdGVtcy5tYXAoaXRlbSA9PiAocmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoUHJvZHVjdCwgeyBrZXk6IGl0ZW0uaWQsIHN0eWxlOiB7IGJhY2tncm91bmQ6IGdldEJhY2tncm91bmRDb2xvcihpdGVtKSB9IH0sXG4gICAgICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChQcm9kdWN0Um93LCBudWxsLFxuICAgICAgICAgICAgICAgIHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFByb2R1Y3REZXRhaWxzLCB7IHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmbGV4OiAnMSAxIDEwMCUnXG4gICAgICAgICAgICAgICAgICAgIH0gfSwgZ2V0U2VhcmNoTGlua3MoaXRlbS5uYW1lKSksXG4gICAgICAgICAgICAgICAgcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoUHJvZHVjdERldGFpbHMsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ucXVhbnRpdHksXG4gICAgICAgICAgICAgICAgICAgIFwiXFx1MDBBMFxcdTA0NDhcXHUwNDQyXCIpLFxuICAgICAgICAgICAgICAgIHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFByb2R1Y3REZXRhaWxzLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChMaW5rLCB7IGhyZWY6IGAvc2VhcmNoLyR7ZW5jb2RlVVJJKGl0ZW1OYW1lVG9TZWFyY2hSZXF1ZXN0KGl0ZW0ubmFtZSkpfWAsIHRhcmdldDogXCJfYmxhbmtcIiB9LCBcIlxcdUQ4M0RcXHVERDBFXCIpKSksXG4gICAgICAgICAgICBpdGVtLmVycm9yICYmIChyZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChFcnJvciwgbnVsbCwgaXRlbS5lcnJvcikpLFxuICAgICAgICAgICAgaXRlbS53YXJuaW5nICYmIChyZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChXYXJuaW5nLCBudWxsLCBcIlxcdTA0MURcXHUwNDM1IFxcdTA0NDNcXHUwNDM0XFx1MDQzMFxcdTA0M0JcXHUwNDNFXFx1MDQ0MVxcdTA0NEMgXFx1MDQzRVxcdTA0M0ZcXHUwNDQwXFx1MDQzNVxcdTA0MzRcXHUwNDM1XFx1MDQzQlxcdTA0MzhcXHUwNDQyXFx1MDQ0QyBcXHUwNDNBXFx1MDQzRVxcdTA0M0JcXHUwNDM4XFx1MDQ0N1xcdTA0MzVcXHUwNDQxXFx1MDQ0MlxcdTA0MzJcXHUwNDNFXCIpKSkpKSk7XG59XG5leHBvcnRzLmRlZmF1bHQgPSBkZWZhdWx0XzE7XG5jb25zdCBHcmlkID0gc3R5bGVkX2NvbXBvbmVudHNfMS5kZWZhdWx0LmRpdiBgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGJhY2tncm91bmQ6ICM0NDQ7XG4gIG92ZXJmbG93OiBhdXRvO1xuICBvdmVyc2Nyb2xsLWJlaGF2aW9yOiBjb250YWluO1xuICBnYXA6IDFweDtcbiAgd2lkdGg6IDEwMCU7XG5gO1xuY29uc3QgUHJvZHVjdCA9IHN0eWxlZF9jb21wb25lbnRzXzEuZGVmYXVsdC5kaXYgYFxuICBmbGV4OiAwIDAgM2VtO1xuICBwYWRkaW5nOiA4cHg7XG4gIGJhY2tncm91bmQ6IHdoaXRlO1xuICBcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246Y29sdW1uO1xuICBnYXA6IDlweDtcbmA7XG5jb25zdCBMaW5rID0gc3R5bGVkX2NvbXBvbmVudHNfMS5kZWZhdWx0LmEgYFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIGNvbG9yOiBibGFjaztcbmA7XG5jb25zdCBQcm9kdWN0Um93ID0gc3R5bGVkX2NvbXBvbmVudHNfMS5kZWZhdWx0LmRpdiBgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgZ2FwOiAxMHB4O1xuYDtcbmNvbnN0IFByb2R1Y3REZXRhaWxzID0gc3R5bGVkX2NvbXBvbmVudHNfMS5kZWZhdWx0LmRpdiBgXG4gIGRpc3BsYXk6IGZsZXhcbmA7XG5jb25zdCBFcnJvciA9IHN0eWxlZF9jb21wb25lbnRzXzEuZGVmYXVsdC5kaXYgYFxuICBmb250LXdlaWdodDogNTAwO1xuICBjb2xvcjogYmxhY2s7XG5gO1xuY29uc3QgV2FybmluZyA9IHN0eWxlZF9jb21wb25lbnRzXzEuZGVmYXVsdC5kaXYgYFxuICBmb250LXNpemU6IDEuMmVtO1xuYDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgcmVhY3RfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwicmVhY3RcIikpO1xuY29uc3QgcmVhY3RfZG9tXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcInJlYWN0LWRvbVwiKSk7XG5jb25zdCBBcHBfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9BcHBcIikpO1xuY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyYy5zcGxpdCgnPycpWzFdKTtcbmNvbnN0IHByb21vY29kZSA9IHBhcmFtcy5nZXQoJ3Byb21vY29kZScpIHx8ICcnO1xuY29uc29sZS5sb2coYFt1dGtvbm9zLWV4dF0gaW5pdGlhbGl6aW5nICh3aXRoIHByb21vY29kZTogXCIke3Byb21vY29kZX1cIilgKTtcbmNvbnN0IHJvb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocm9vdCk7XG5yZWFjdF9kb21fMS5kZWZhdWx0LnJlbmRlcihyZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChBcHBfMS5kZWZhdWx0LCB7IHByb21vY29kZTogcHJvbW9jb2RlIH0pLCByb290KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5leHRyYWN0RnJvbVRhYmxlID0gdm9pZCAwO1xuY29uc3QgeHBhdGhfMSA9IHJlcXVpcmUoXCIuLi9zZGsveHBhdGhcIik7XG5jb25zdCBpc0VxdWFsID0gcmVxdWlyZShcImxvZGFzaC9pc0VxdWFsXCIpO1xuY29uc3QgemlwID0gcmVxdWlyZShcImxvZGFzaC96aXBcIik7XG5jb25zdCByYW5nZSA9IHJlcXVpcmUoXCJsb2Rhc2gvcmFuZ2VcIik7XG5mdW5jdGlvbiBleHRyYWN0RnJvbVRhYmxlKGVsZW1lbnQpIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgW3RhYmxlRGF0YSwgcm93RWxlbWVudHNdID0gcGFyc2VUYWJsZShlbGVtZW50KTtcbiAgICBpZiAodGFibGVEYXRhLmxlbmd0aCA9PSAwKVxuICAgICAgICByZXR1cm4geyBjYXJ0SXRlbXM6IFtdLCByZWplY3RlZFJvd3M6IFtdIH07XG4gICAgY29uc29sZS5sb2coXCJ0YWJsZSBkYXRhXCIpO1xuICAgIGNvbnNvbGUudGFibGUodGFibGVEYXRhKTtcbiAgICBjb25zdCBxdWFudGl0aWVzQ29sdW1uID0gZmluZFF1YW50aXRpZXNDb2x1bW4odGFibGVEYXRhKTtcbiAgICBpZiAocXVhbnRpdGllc0NvbHVtbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2FuJ3QgZmluZCBxdWFudGl0aWVzIGNvbHVtblwiKTtcbiAgICAgICAgcmV0dXJuIHsgY2FydEl0ZW1zOiBbXSwgcmVqZWN0ZWRSb3dzOiBbXSB9O1xuICAgIH1cbiAgICBjb25zdCBjYXJ0SXRlbXMgPSBbXTtcbiAgICBjb25zdCByZWplY3RlZFJvd3MgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhYmxlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCByb3cgPSB0YWJsZURhdGFbaV07XG4gICAgICAgIGlmIChyb3cuZmlsdGVyKGNlbGwgPT4gIWlzTmFOKHBhcnNlRmxvYXQoY2VsbCA9PT0gbnVsbCB8fCBjZWxsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjZWxsLnRyaW0oKSkpKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbHRlciBvdXQgcG9zc2libGUgaGVhZGVyIG9mIGZvb3RlciByb3c6ICcsIHJvdyk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgd2FybmluZyA9IGZhbHNlO1xuICAgICAgICBsZXQgcXVhbnRpdHkgPSBwYXJzZUludChyb3dbcXVhbnRpdGllc0NvbHVtbl0pO1xuICAgICAgICBpZiAoIXF1YW50aXR5KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgY2FuJ3QgcGFyc2UgcXVhbnRpdHkgZnJvbSBjb2x1bW4gJHtxdWFudGl0aWVzQ29sdW1ufS4gVXNpbmcgZGVmYXVsdCB2YWx1ZS4gUm93OiBgLCByb3cpO1xuICAgICAgICAgICAgcXVhbnRpdHkgPSAxO1xuICAgICAgICAgICAgd2FybmluZyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbGluayA9IHJvdy5maW5kKGl0ZW0gPT4gaXRlbS5pbmRleE9mKCd1dGtvbm9zLnJ1JykgIT0gLTEpO1xuICAgICAgICBpZiAoIWxpbmspIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2FuJ3QgZmluZCBsaW5rIGZvciB0aGlzIHJvd1wiLCByb3cpO1xuICAgICAgICAgICAgcmVqZWN0ZWRSb3dzLnB1c2gocm93RWxlbWVudHNbaV0pO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaWQgPSBwYXJzZUludCgoKF9hID0gbGluay5tYXRjaCgvdXRrb25vc1xcLnJ1XFwvaXRlbVxcLyhcXGQrKS8pKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2FbMV0pIHx8ICcnKTtcbiAgICAgICAgaWYgKCFpZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYGNhbid0IGZpbmQgSUQgZm9yIHRoaXMgbGluazogJHtsaW5rfSwgcm93OiBgLCByb3cpO1xuICAgICAgICAgICAgcmVqZWN0ZWRSb3dzLnB1c2gocm93RWxlbWVudHNbaV0pO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGV4dFJlID0gbmV3IFJlZ0V4cCgvW9CwLdGP0JAt0K9dezUsfS8pO1xuICAgICAgICBjb25zdCB0aXRsZSA9IHJvdy5maW5kKGl0ZW0gPT4gaXRlbS5yZXBsYWNlKC9cXHMrLywgJycpLnNlYXJjaCh0ZXh0UmUpICE9PSAtMSk7XG4gICAgICAgIGNhcnRJdGVtcy5wdXNoKHtcbiAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgIHF1YW50aXR5OiBxdWFudGl0eSxcbiAgICAgICAgICAgIG5hbWU6IHRpdGxlIHx8IGxpbmssXG4gICAgICAgICAgICB0YWJsZVJvdzogcm93RWxlbWVudHNbaV0sXG4gICAgICAgICAgICB3YXJuaW5nOiB3YXJuaW5nLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHsgY2FydEl0ZW1zOiBjYXJ0SXRlbXMsIHJlamVjdGVkUm93czogcmVqZWN0ZWRSb3dzIH07XG59XG5leHBvcnRzLmV4dHJhY3RGcm9tVGFibGUgPSBleHRyYWN0RnJvbVRhYmxlO1xuLy8gUmV0dXJucyBhIHRleHQgY29udGVudCBvZiBhIHRhYmxlIChhbmQgbGluayB0YXJnZXRzKVxuZnVuY3Rpb24gcGFyc2VUYWJsZShlbGVtZW50KSB7XG4gICAgY29uc3Qgcm93RWxlbWVudHMgPSAoMCwgeHBhdGhfMS5kb1hwYXRoKSgnLi8vdHInLCBlbGVtZW50KTtcbiAgICBjb25zdCB0YWJsZURhdGEgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHJvd0VsZW1lbnQgb2Ygcm93RWxlbWVudHMpIHtcbiAgICAgICAgY29uc3Qgcm93RGF0YSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGNlbGwgb2Ygcm93RWxlbWVudC5jaGlsZE5vZGVzKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuZXZhbHVhdGUoJy4vL2EnLCBjZWxsLCBudWxsLCBYUGF0aFJlc3VsdC5BTllfVFlQRSkuaXRlcmF0ZU5leHQoKTtcbiAgICAgICAgICAgIGlmIChsaW5rICE9PSBudWxsICYmIGxpbmsgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHJvd0RhdGEucHVzaChsaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpIHx8ICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvd0RhdGEucHVzaChjZWxsLnRleHRDb250ZW50IHx8ICcnKTtcbiAgICAgICAgfVxuICAgICAgICB0YWJsZURhdGEucHVzaChyb3dEYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIFt0YWJsZURhdGEsIHJvd0VsZW1lbnRzXTtcbn1cbmZ1bmN0aW9uIGZpbmRRdWFudGl0aWVzQ29sdW1uKHRhYmxlRGF0YSkge1xuICAgIHZhciBfYTtcbiAgICBsZXQgZmlsdGVyZWRSb3dzID0gdGFibGVEYXRhLm1hcChyb3cgPT4gcm93Lm1hcChjZWxsID0+IGNlbGwucmVwbGFjZSgvXFxzKijRiNGC0YPQunzRiNGCKVxcLj9cXHMqL2lnLCAnJykpKTtcbiAgICAvLyBmaWx0ZXIgb3V0IHBvc3NpYmxlIGhlYWRlcnMvZm9vdGVyc1xuICAgIGZpbHRlcmVkUm93cyA9IGZpbHRlcmVkUm93cy5maWx0ZXIocm93ID0+IHJvdy5maWx0ZXIoY2VsbCA9PiAhaXNOYU4ocGFyc2VGbG9hdChjZWxsID09PSBudWxsIHx8IGNlbGwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNlbGwudHJpbSgpKSkpLmxlbmd0aCA+IDAgLy8gdGhlcmUgYXJlIGF0IGxlYXN0IHNvbWUgbnVtZXJpYyB2YWx1ZXNcbiAgICApO1xuICAgIGNvbnN0IGF2Z0ZpbGxlZENlbGxzTnVtYmVyID0gTWF0aC5yb3VuZChmaWx0ZXJlZFJvd3NcbiAgICAgICAgLm1hcChyb3cgPT4gcm93LmZpbHRlcih4ID0+ICEhKHggPT09IG51bGwgfHwgeCA9PT0gdm9pZCAwID8gdm9pZCAwIDogeC50cmltKCkpKS5sZW5ndGgpXG4gICAgICAgIC5yZWR1Y2UoKHByZXYsIGxlbikgPT4gcHJldiArIGxlbiwgMClcbiAgICAgICAgLyBmaWx0ZXJlZFJvd3MubGVuZ3RoKTtcbiAgICBmaWx0ZXJlZFJvd3MgPSBmaWx0ZXJlZFJvd3MuZmlsdGVyKHJvdyA9PiByb3cuZmlsdGVyKGNlbGwgPT4gISEoY2VsbCA9PT0gbnVsbCB8fCBjZWxsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjZWxsLnRyaW0oKSkpLmxlbmd0aCA9PSBhdmdGaWxsZWRDZWxsc051bWJlciAvLyBjZWxscyBjb3VudCA9IGF2ZyBjb3VudFxuICAgICk7XG4gICAgY29uc29sZS5sb2coXCJEZXRlY3RpbmcgcXVhbnRpdGllcyBjb2x1bW4uIFRoaXMgaXMgdGhlIGZpbHRlcmVkIGRhdGFcIik7XG4gICAgY29uc29sZS50YWJsZShmaWx0ZXJlZFJvd3MpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgKChfYSA9IGZpbHRlcmVkUm93c1swXSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxlbmd0aCk7IGkrKykge1xuICAgICAgICBjb25zdCBjb2x1bW5EYXRhID0gZmlsdGVyZWRSb3dzLm1hcChyb3cgPT4gcm93W2ldKTtcbiAgICAgICAgLy8gaWYgKGZpbHRlcmVkUm93c1swXVtpXS5pbmRleE9mKCd1dGtvbm9zLnJ1JykgIT0gLTEpIHtcbiAgICAgICAgLy8gICBjb25zb2xlLmxvZyhgY29sdW1uICR7aX0gc2VlbXMgdG8gY29udGFpbiBsaW5rc2ApXG4gICAgICAgIC8vICAgbGlua3MgPSBjb2x1bW5EYXRhXG4gICAgICAgIC8vICAgY29udGludWVcbiAgICAgICAgLy8gfVxuICAgICAgICBjb25zdCBudW1lcmljVmFsdWVzID0gY29sdW1uRGF0YS5tYXAoeCA9PiBwYXJzZUZsb2F0KHggPT09IG51bGwgfHwgeCA9PT0gdm9pZCAwID8gdm9pZCAwIDogeC50cmltKCkpKTtcbiAgICAgICAgaWYgKG51bWVyaWNWYWx1ZXMuZmluZChpc05hTikgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYGNvbHVtbiAke2l9IGlzIG5vdCBhbGwgbnVtYmVyc2ApO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG51bWVyaWNWYWx1ZXMuZXZlcnkoKHgsIGkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBpID09PSAwIHx8IHggPiBudW1lcmljVmFsdWVzW2kgLSAxXTtcbiAgICAgICAgfSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBjb2x1bW4gJHtpfSBsb29rcyBsaWtlIGEgcm93IG51bWJlcnNgKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGF2Z1ZhbHVlID0gbnVtZXJpY1ZhbHVlcy5yZWR1Y2UoKHJlc3VsdCwgaXRlbSkgPT4gcmVzdWx0ICsgaXRlbSwgMCkgLyBjb2x1bW5EYXRhLmxlbmd0aDtcbiAgICAgICAgY29uc3QgcmF0ZU9mUm91bmRWYWx1ZXMgPSBudW1lcmljVmFsdWVzLmZpbHRlcih4ID0+IE1hdGgucm91bmQoeCkgPT0geCkubGVuZ3RoIC8gY29sdW1uRGF0YS5sZW5ndGg7XG4gICAgICAgIGlmIChhdmdWYWx1ZSA8IDE1ICYmIHJhdGVPZlJvdW5kVmFsdWVzID4gMC41KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgY29sdW1uICR7aX0gc2VlbXMgdG8gaGF2ZSBhIHF1YW50aXRpZXNgKTtcbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKGBjb2x1bW4gJHtpfSBpZ25vcmVkLiBBdmVyYWdlIHZhbHVlOiAke2F2Z1ZhbHVlfSwgcmF0ZSBvZiByb3VuZGVkIHZhbHVlczogJHtyYXRlT2ZSb3VuZFZhbHVlc30pYCk7XG4gICAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmV4dHJhY3RGcm9tVW5zdHJ1Y3R1cmVkVGV4dCA9IHZvaWQgMDtcbmNvbnN0IHhwYXRoXzEgPSByZXF1aXJlKFwiLi4vc2RrL3hwYXRoXCIpO1xuZnVuY3Rpb24gZXh0cmFjdEZyb21VbnN0cnVjdHVyZWRUZXh0KGVsZW1lbnQpIHtcbiAgICBjb25zdCBsaW5rcyA9IFtdO1xuICAgIGNvbnN0IGxpbmtFbGVtZW50cyA9ICgwLCB4cGF0aF8xLmRvWHBhdGgpKCcuLy9hJywgZWxlbWVudCk7XG4gICAgZm9yIChjb25zdCBlbCBvZiBsaW5rRWxlbWVudHMpIHtcbiAgICAgICAgaWYgKGVsIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGhyZWYgPSBlbC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgICAgICAgICAgIGlmIChocmVmKSB7XG4gICAgICAgICAgICAgICAgbGlua3MucHVzaChocmVmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCB0ZXh0ID0gbGlua3Muam9pbihcIlxcblwiKSArIGVsZW1lbnQudGV4dENvbnRlbnQ7XG4gICAgY29uc3QgaXRlbXMgPSBbXTtcbiAgICBjb25zdCBzZWVuSXRlbXMgPSBuZXcgU2V0KCk7XG4gICAgZm9yIChjb25zdCBtIG9mIHRleHQubWF0Y2hBbGwoL3V0a29ub3NcXC5ydVxcL2l0ZW1cXC8oXFxkKykvZykpIHtcbiAgICAgICAgY29uc3QgaWQgPSBtWzFdO1xuICAgICAgICBpZiAoc2Vlbkl0ZW1zLmhhcyhpZCkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHNlZW5JdGVtcy5hZGQoaWQpO1xuICAgICAgICBpdGVtcy5wdXNoKHtcbiAgICAgICAgICAgIGlkOiBwYXJzZUludChpZCksXG4gICAgICAgICAgICBxdWFudGl0eTogMSxcbiAgICAgICAgICAgIG5hbWU6IGBodHRwczovL3V0a29ub3MucnUvaXRlbS8ke2lkfS9gLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGl0ZW1zO1xufVxuZXhwb3J0cy5leHRyYWN0RnJvbVVuc3RydWN0dXJlZFRleHQgPSBleHRyYWN0RnJvbVVuc3RydWN0dXJlZFRleHQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZXh0cmFjdERhdGEgPSB2b2lkIDA7XG5jb25zdCBleHRyYWN0X2Zyb21fdGFibGVfMSA9IHJlcXVpcmUoXCIuL2V4dHJhY3RfZnJvbV90YWJsZVwiKTtcbmNvbnN0IGV4dHJhY3RfdW5zdHJ1Y3R1cmVkXzEgPSByZXF1aXJlKFwiLi9leHRyYWN0X3Vuc3RydWN0dXJlZFwiKTtcbmZ1bmN0aW9uIGV4dHJhY3REYXRhKGVsKSB7XG4gICAgaWYgKGRvY3VtZW50LmV2YWx1YXRlKCdjb3VudCguLy90YWJsZSknLCBlbCwgbnVsbCwgWFBhdGhSZXN1bHQuTlVNQkVSX1RZUEUpLm51bWJlclZhbHVlID09IDEpIHtcbiAgICAgICAgY29uc3QgeyBjYXJ0SXRlbXMsIHJlamVjdGVkUm93cyB9ID0gKDAsIGV4dHJhY3RfZnJvbV90YWJsZV8xLmV4dHJhY3RGcm9tVGFibGUpKGVsKTtcbiAgICAgICAgaWYgKGNhcnRJdGVtcy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgcmV0dXJuIHsgd2l0aENvdW50czogdHJ1ZSwgY2FydEl0ZW1zLCByZWplY3RlZFJvd3MgfTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY2FydEl0ZW1zOiAoMCwgZXh0cmFjdF91bnN0cnVjdHVyZWRfMS5leHRyYWN0RnJvbVVuc3RydWN0dXJlZFRleHQpKGVsKSxcbiAgICAgICAgcmVqZWN0ZWRSb3dzOiBbXSxcbiAgICAgICAgd2l0aENvdW50czogZmFsc2UsXG4gICAgfTtcbn1cbmV4cG9ydHMuZXh0cmFjdERhdGEgPSBleHRyYWN0RGF0YTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy51dWlkdjQgPSB2b2lkIDA7XG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjExNzUyM1xuZnVuY3Rpb24gdXVpZHY0KCkge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICByZXR1cm4gKFsxZTddICsgLTFlMyArIC00ZTMgKyAtOGUzICsgLTFlMTEpLnJlcGxhY2UoL1swMThdL2csIGMgPT4gKGMgXiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KDEpKVswXSAmIDE1ID4+IGMgLyA0KS50b1N0cmluZygxNikpO1xufVxuZXhwb3J0cy51dWlkdjQgPSB1dWlkdjQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZG9YcGF0aCA9IHZvaWQgMDtcbmZ1bmN0aW9uIGRvWHBhdGgocXVlcnksIHJvb3QsIHJlc3VsdFR5cGUgPSBYUGF0aFJlc3VsdC5PUkRFUkVEX05PREVfSVRFUkFUT1JfVFlQRSkge1xuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgIGNvbnN0IHhwID0gZG9jdW1lbnQuZXZhbHVhdGUocXVlcnksIHJvb3QsIG51bGwsIFhQYXRoUmVzdWx0Lk9SREVSRURfTk9ERV9JVEVSQVRPUl9UWVBFKTtcbiAgICBsZXQgaXRlbSA9IHhwLml0ZXJhdGVOZXh0KCk7XG4gICAgd2hpbGUgKGl0ZW0pIHtcbiAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgaXRlbSA9IHhwLml0ZXJhdGVOZXh0KCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnRzLmRvWHBhdGggPSBkb1hwYXRoO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy51dGtvbm9zTGVnYWN5QVBJID0gdm9pZCAwO1xuY29uc3QgQ29va2llcyA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiZXMtY29va2llXCIpKTtcbmNvbnN0IGhlbHBlcnNfMSA9IHJlcXVpcmUoXCIuLi9zZGsvaGVscGVyc1wiKTtcbmNvbnN0IGV4Y2VwdGlvbnNfMSA9IHJlcXVpcmUoXCIuL2V4Y2VwdGlvbnNcIik7XG5jbGFzcyBVdGtvbm9zTGVnYWN5QVBJIHtcbiAgICBzYXZlQ2FydEJ1bGsoaXRlbXMpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkcyA9IFtdO1xuICAgICAgICAgICAgY29uc3QgcXVhbnRpdGllcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgaWRzLnB1c2goaXRlbS5pZC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICBxdWFudGl0aWVzLnB1c2goaXRlbS5xdWFudGl0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0Qm9keSA9IHtcbiAgICAgICAgICAgICAgICBcIkdvb2RzSXRlbUlkXCI6IGlkcyxcbiAgICAgICAgICAgICAgICBcIkNvdW50XCI6IHF1YW50aXRpZXMsXG4gICAgICAgICAgICAgICAgXCJVc2VEZWx0YVwiOiAwLFxuICAgICAgICAgICAgICAgIFwiUmV0dXJuXCI6IHsgXCJDYXJ0XCI6IFwiMFwiLCBcIkNhcnRJdGVtTGlzdFwiOiBcIjBcIiwgXCJUb3RhbENvc3RcIjogXCIwXCIgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1ha2VSZXF1ZXN0KFwiY2FydEl0ZW1NdWx0aUFkZFwiLCByZXF1ZXN0Qm9keSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBtb2RpZnlDYXJ0SXRlbShpdGVtKSB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB5aWVsZCB0aGlzLm1ha2VSZXF1ZXN0KFwiY2FydEl0ZW1Nb2RpZnlcIiwge1xuICAgICAgICAgICAgICAgIFwiR29vZHNJdGVtSWRcIjogaXRlbS5pZC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgIFwiUXVhbnRpdHlcIjogaXRlbS5xdWFudGl0eSxcbiAgICAgICAgICAgICAgICBcIlJldHVyblwiOiB7IFwiQ2FydFwiOiAxLCBcIkNhcnRJdGVtTGlzdFwiOiAwLCBcIlRvdGFsQ29zdFwiOiAwIH0sXG4gICAgICAgICAgICAgICAgXCJTb3VyY2VcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcIlNvdXJjZUlkXCI6IG51bGwsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGNhcnROb3RpY2UgPSAoX2MgPSAoX2IgPSAoX2EgPSAocmVzcG9uc2UuQm9keS5DYXJ0TGlzdCB8fCBbXSlbMF0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5DYXJ0Tm90aWNlcykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLkNhcnROb3RpY2VMaXN0WzBdKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuRGVzY3JpcHRpb247XG4gICAgICAgICAgICBpZiAoY2FydE5vdGljZSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBleGNlcHRpb25zXzEuVXRrb25vc0FQSUV4Y2VwdGlvbihjYXJ0Tm90aWNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGdvb2RzSXRlbVNlYXJjaEJ5aWQoaWQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RCb2R5ID0ge1xuICAgICAgICAgICAgICAgIFwiSWRcIjogaWQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICBcIlJldHVyblwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiQnJhbmRJbmZvXCI6IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFrZVJlcXVlc3QoXCJnb29kc0l0ZW1TZWFyY2hCeWlkXCIsIHJlcXVlc3RCb2R5KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNhcnRQcm9tb2NvZGVBZGQoY29kZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgdGhpcy5tYWtlUmVxdWVzdCgnY2FydFByb21vY29kZUFkZCcsIHtcbiAgICAgICAgICAgICAgICBDb2RlOiBjb2RlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBzZWFyY2hCeUlkXG4gICAgLy8gICBmZXRjaChcImh0dHBzOi8vd3d3LnV0a29ub3MucnUvYXBpL3YxL2dvb2RzSXRlbVNlYXJjaEJ5aWRcIiwge1xuICAgIC8vICAgXCJoZWFkZXJzXCI6IHtcbiAgICAvLyAgICAgXCJhY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLypcIixcbiAgICAvLyAgICAgXCJhY2NlcHQtbGFuZ3VhZ2VcIjogXCJlbi1VUyxlbjtxPTAuOSxydTtxPTAuOFwiLFxuICAgIC8vICAgICBcImNhY2hlLWNvbnRyb2xcIjogXCJuby1jYWNoZVwiLFxuICAgIC8vICAgICBcImNvbnRlbnQtdHlwZVwiOiBcIm11bHRpcGFydC9mb3JtLWRhdGE7IGJvdW5kYXJ5PS0tLS1XZWJLaXRGb3JtQm91bmRhcnk3Y3JCMTZvcmVaMnRpMDhTXCIsXG4gICAgLy8gICAgIFwicHJhZ21hXCI6IFwibm8tY2FjaGVcIixcbiAgICAvLyAgICAgXCJzZWMtY2gtdWFcIjogXCJcXFwiQ2hyb21pdW1cXFwiO3Y9XFxcIjEwNlxcXCIsIFxcXCJHb29nbGUgQ2hyb21lXFxcIjt2PVxcXCIxMDZcXFwiLCBcXFwiTm90O0E9QnJhbmRcXFwiO3Y9XFxcIjk5XFxcIlwiLFxuICAgIC8vICAgICBcInNlYy1jaC11YS1tb2JpbGVcIjogXCI/MFwiLFxuICAgIC8vICAgICBcInNlYy1jaC11YS1wbGF0Zm9ybVwiOiBcIlxcXCJtYWNPU1xcXCJcIixcbiAgICAvLyAgICAgXCJzZWMtZmV0Y2gtZGVzdFwiOiBcImVtcHR5XCIsXG4gICAgLy8gICAgIFwic2VjLWZldGNoLW1vZGVcIjogXCJjb3JzXCIsXG4gICAgLy8gICAgIFwic2VjLWZldGNoLXNpdGVcIjogXCJzYW1lLW9yaWdpblwiXG4gICAgLy8gICB9LFxuICAgIC8vICAgXCJyZWZlcnJlclwiOiBcImh0dHBzOi8vd3d3LnV0a29ub3MucnUvaXRlbS8zNDU2MTc3L2tvcm0tdmxhemhueWotd2hpc2thcy1wb2xub3JhY2lvbm55ai1wYXNodGV0LXMtZ292amFkaW5vai1pLXBlY2hlbmp1LWRsamEtdnpyb3NseWtoLWtvc2hlay0yNC1zaHR1ay1wby03NS1nXCIsXG4gICAgLy8gICBcInJlZmVycmVyUG9saWN5XCI6IFwibm8tcmVmZXJyZXItd2hlbi1kb3duZ3JhZGVcIixcbiAgICAvLyAgIFwiYm9keVwiOiBcIi0tLS0tLVdlYktpdEZvcm1Cb3VuZGFyeTdjckIxNm9yZVoydGkwOFNcXHJcXG5Db250ZW50LURpc3Bvc2l0aW9uOiBmb3JtLWRhdGE7IG5hbWU9XFxcInJlcXVlc3RcXFwiXFxyXFxuXFxyXFxue1xcXCJIZWFkXFxcIjp7XFxcIkRldmljZUlkXFxcIjpcXFwiNjA0MTU1NzEtZjE2My00YWFlLWMyMTUtYjM0YTkxMzY0ZjAwXFxcIixcXFwiRG9tYWluXFxcIjpcXFwid3d3LnV0a29ub3MucnVcXFwiLFxcXCJSZXF1ZXN0SWRcXFwiOlxcXCJmZDk0Nzk5NmM3MzU0OGUzZjVmZTFjYjY1ZWM4OGRhOFxcXCIsXFxcIk1hcmtldGluZ1BhcnRuZXJLZXlcXFwiOlxcXCJtcC1jYzNjNzQzZmZkMTc0ODdhOTAyMWQxMTEyOTU0ODIxOFxcXCIsXFxcIlZlcnNpb25cXFwiOlxcXCJhbmd1bGFyX3dlYl8wLjAuMlxcXCIsXFxcIkNsaWVudFxcXCI6XFxcImFuZ3VsYXJfd2ViXzAuMC4yXFxcIixcXFwiTWV0aG9kXFxcIjpcXFwiZ29vZHNJdGVtU2VhcmNoQnlpZFxcXCIsXFxcIlN0b3JlXFxcIjpcXFwidXRrXFxcIixcXFwiU2Vzc2lvblRva2VuXFxcIjpcXFwiNkY5RUYxQTQ2QzcxRjQ4NjFFQ0Q3QzIyNUQzMzcxRTBcXFwifSxcXFwiQm9keVxcXCI6e1xcXCJJZFxcXCI6XFxcIjM0NTYxNzdcXFwiLFxcXCJSZXR1cm5cXFwiOntcXFwiQnJhbmRJbmZvXFxcIjoxLFxcXCJSZWNpcGVzXFxcIjoxfX19XFxyXFxuLS0tLS0tV2ViS2l0Rm9ybUJvdW5kYXJ5N2NyQjE2b3JlWjJ0aTA4Uy0tXFxyXFxuXCIsXG4gICAgLy8gICBcIm1ldGhvZFwiOiBcIlBPU1RcIixcbiAgICAvLyAgIFwibW9kZVwiOiBcImNvcnNcIixcbiAgICAvLyAgIFwiY3JlZGVudGlhbHNcIjogXCJpbmNsdWRlXCJcbiAgICAvLyB9KTtcbiAgICBtYWtlUmVxdWVzdChtZXRob2QsIHJlcXVlc3RCb2R5KSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBkZXZpY2VEYXRhID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZGV2aWNlX2RhdGEnKSB8fCAne30nKTtcbiAgICAgICAgICAgIGNvbnN0IHNlc3Npb25Ub2tlbiA9IHlpZWxkIENvb2tpZXMuZ2V0KCdVdGtfU2Vzc2lvblRva2VuJyk7XG4gICAgICAgICAgICBjb25zdCBob3N0ID0gd2luZG93LmxvY2F0aW9uLmhvc3Q7XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0ge1xuICAgICAgICAgICAgICAgIFwiSGVhZFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiRGV2aWNlSWRcIjogZGV2aWNlRGF0YVsnZGV2aWNlX2lkJ10sXG4gICAgICAgICAgICAgICAgICAgIFwiRG9tYWluXCI6IGhvc3QsXG4gICAgICAgICAgICAgICAgICAgIFwiUmVxdWVzdElkXCI6ICgwLCBoZWxwZXJzXzEudXVpZHY0KSgpLnJlcGxhY2VBbGwoLy0vZywgJycpLFxuICAgICAgICAgICAgICAgICAgICBcIk1hcmtldGluZ1BhcnRuZXJLZXlcIjogXCJtcC1jYzNjNzQzZmZkMTc0ODdhOTAyMWQxMTEyOTU0ODIxOFwiLFxuICAgICAgICAgICAgICAgICAgICBcIlZlcnNpb25cIjogXCJ1dGtvbm9zLWV4dFwiLFxuICAgICAgICAgICAgICAgICAgICBcIkNsaWVudFwiOiBcInV0a29ub3MtZXh0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiTWV0aG9kXCI6IG1ldGhvZCxcbiAgICAgICAgICAgICAgICAgICAgXCJTdG9yZVwiOiBcInV0a1wiLFxuICAgICAgICAgICAgICAgICAgICBcIlNlc3Npb25Ub2tlblwiOiBzZXNzaW9uVG9rZW4sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIkJvZHlcIjogcmVxdWVzdEJvZHksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJbbGVnYWN5IEFQSV0gc2VuZGluZyByZXF1ZXN0IHRvIG1ldGhvZFwiLCBtZXRob2QsIHJlcXVlc3QpO1xuICAgICAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChcInJlcXVlc3RcIiwgSlNPTi5zdHJpbmdpZnkocmVxdWVzdCkpO1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB5aWVsZCBmZXRjaChgaHR0cHM6Ly8ke2hvc3R9L2FwaS9yZXN0LyR7bWV0aG9kfWAsIHtcbiAgICAgICAgICAgICAgICBcImhlYWRlcnNcIjoge1xuICAgICAgICAgICAgICAgICAgICBcImFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKlwiLFxuICAgICAgICAgICAgICAgICAgICBcImFjY2VwdC1sYW5ndWFnZVwiOiBcImVuLVVTLGVuO3E9MC45LHJ1O3E9MC44XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiY2FjaGUtY29udHJvbFwiOiBcIm5vLWNhY2hlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicHJhZ21hXCI6IFwibm8tY2FjaGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzZWMtY2gtdWFcIjogXCJcXFwiQ2hyb21pdW1cXFwiO3Y9XFxcIjEwNlxcXCIsIFxcXCJHb29nbGUgQ2hyb21lXFxcIjt2PVxcXCIxMDZcXFwiLCBcXFwiTm90O0E9QnJhbmRcXFwiO3Y9XFxcIjk5XFxcIlwiLFxuICAgICAgICAgICAgICAgICAgICBcInNlYy1jaC11YS1tb2JpbGVcIjogXCI/MFwiLFxuICAgICAgICAgICAgICAgICAgICBcInNlYy1jaC11YS1wbGF0Zm9ybVwiOiBcIlxcXCJtYWNPU1xcXCJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzZWMtZmV0Y2gtZGVzdFwiOiBcImVtcHR5XCIsXG4gICAgICAgICAgICAgICAgICAgIFwic2VjLWZldGNoLW1vZGVcIjogXCJjb3JzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic2VjLWZldGNoLXNpdGVcIjogXCJzYW1lLW9yaWdpblwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcInJlZmVycmVyXCI6IGBodHRwczovLyR7aG9zdH0vYCxcbiAgICAgICAgICAgICAgICBcInJlZmVycmVyUG9saWN5XCI6IFwibm8tcmVmZXJyZXItd2hlbi1kb3duZ3JhZGVcIixcbiAgICAgICAgICAgICAgICBcImJvZHlcIjogZm9ybURhdGEsXG4gICAgICAgICAgICAgICAgXCJtZXRob2RcIjogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgXCJtb2RlXCI6IFwiY29yc1wiLFxuICAgICAgICAgICAgICAgIFwiY3JlZGVudGlhbHNcIjogXCJpbmNsdWRlXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZXNwb25zZTogJywgZGF0YSk7XG4gICAgICAgICAgICBpZiAoZGF0YS5Cb2R5LkVycm9yTGlzdCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBleGNlcHRpb25zXzEuVXRrb25vc0FQSUV4Y2VwdGlvbihkYXRhLkJvZHkuRXJyb3JMaXN0WzBdLkRlc2NyaXB0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLnV0a29ub3NMZWdhY3lBUEkgPSBuZXcgVXRrb25vc0xlZ2FjeUFQSSgpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy51dGtvbm9zTmV3QVBJID0gdm9pZCAwO1xuY29uc3QgQ29va2llcyA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiZXMtY29va2llXCIpKTtcbmNvbnN0IGhlbHBlcnNfMSA9IHJlcXVpcmUoXCIuLi9zZGsvaGVscGVyc1wiKTtcbmNvbnN0IGV4Y2VwdGlvbnNfMSA9IHJlcXVpcmUoXCIuL2V4Y2VwdGlvbnNcIik7XG5jbGFzcyBVdGtvbm9zTmV3QVBJIHtcbiAgICBtb2RpZnlDYXJ0SXRlbShpdGVtKSB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jO1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHRoaXMubWFrZVJlcXVlc3QoXCJjYXJ0SXRlbU1vZGlmeVwiLCB7XG4gICAgICAgICAgICAgICAgXCJHb29kc0l0ZW1JZFwiOiBpdGVtLmlkLFxuICAgICAgICAgICAgICAgIFwiUXVhbnRpdHlcIjogaXRlbS5xdWFudGl0eSxcbiAgICAgICAgICAgICAgICBcIlJldHVyblwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiQ2FydFwiOiAwLFxuICAgICAgICAgICAgICAgICAgICBcIkdvb2RzXCI6IDAsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBjYXJ0Tm90aWNlID0gKF9jID0gKF9iID0gKF9hID0gZGF0YS5Cb2R5LkNhcnRMaXN0WzBdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuQ2FydE5vdGljZXMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5DYXJ0Tm90aWNlTGlzdFswXSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLkRlc2NyaXB0aW9uO1xuICAgICAgICAgICAgaWYgKGNhcnROb3RpY2UpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgZXhjZXB0aW9uc18xLlV0a29ub3NBUElFeGNlcHRpb24oY2FydE5vdGljZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNhcnRQcm9tb2NvZGVBZGQoY29kZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgdGhpcy5tYWtlUmVxdWVzdCgnY2FydFByb21vY29kZUFkZCcsIHtcbiAgICAgICAgICAgICAgICBDb2RlOiBjb2RlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyAgIGZldGNoKFwiaHR0cHM6Ly93d3cudXRrb25vcy5ydS9hcGkvcmVzdC9jYXJ0SXRlbU1vZGlmeVwiLCB7XG4gICAgLy8gICBcImhlYWRlcnNcIjoge1xuICAgIC8vICAgICBcImFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKlwiLFxuICAgIC8vICAgICBcImFjY2VwdC1sYW5ndWFnZVwiOiBcImVuLVVTLGVuO3E9MC45LHJ1O3E9MC44XCIsXG4gICAgLy8gICAgIFwiY29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIsXG4gICAgLy8gICAgIFwic2VjLWNoLXVhXCI6IFwiXFxcIkdvb2dsZSBDaHJvbWVcXFwiO3Y9XFxcIjEwN1xcXCIsIFxcXCJDaHJvbWl1bVxcXCI7dj1cXFwiMTA3XFxcIiwgXFxcIk5vdD1BP0JyYW5kXFxcIjt2PVxcXCIyNFxcXCJcIixcbiAgICAvLyAgICAgXCJzZWMtY2gtdWEtbW9iaWxlXCI6IFwiPzBcIixcbiAgICAvLyAgICAgXCJzZWMtY2gtdWEtcGxhdGZvcm1cIjogXCJcXFwibWFjT1NcXFwiXCIsXG4gICAgLy8gICAgIFwic2VjLWZldGNoLWRlc3RcIjogXCJlbXB0eVwiLFxuICAgIC8vICAgICBcInNlYy1mZXRjaC1tb2RlXCI6IFwiY29yc1wiLFxuICAgIC8vICAgICBcInNlYy1mZXRjaC1zaXRlXCI6IFwic2FtZS1vcmlnaW5cIixcbiAgICAvLyAgICAgXCJ4LXJldGFpbC1icmFuZFwiOiBcInV0a1wiXG4gICAgLy8gICB9LFxuICAgIC8vICAgXCJyZWZlcnJlclwiOiBcImh0dHBzOi8vd3d3LnV0a29ub3MucnUvYWN0aW9uL2RldGFpbC8zOTgxNVwiLFxuICAgIC8vICAgXCJyZWZlcnJlclBvbGljeVwiOiBcInN0cmljdC1vcmlnaW4td2hlbi1jcm9zcy1vcmlnaW5cIixcbiAgICAvLyAgIFwiYm9keTpcIlxuICAgIC8vICAgICAgICAgcmVxdWVzdDp7IFwiSGVhZFwiOiB7XG4gICAgLy8gICAgICAgICAgIFwiUmVxdWVzdElkXCI6IFwiZmQ5NDc5OTZjNzM1NDhlM2Y1ZmUxY2I2NWVjODhkYThcIixcbiAgICAvLyAgICAgICAgICAgICBcIk1hcmtldGluZ1BhcnRuZXJLZXlcIjogXCJtcDgwLTY2MTI5NWM5Y2JmOWQ2YjJmNjQyODQxNDUwNGE4ZGVlZDMwMjA2NDFcIixcbiAgICAvLyAgICAgICAgICAgICBcIlZlcnNpb25cIjogXCJhbmd1bGFyX3dlYl8wLjAuMlwiLFxuICAgIC8vICAgICAgICAgICAgIFwiQ2xpZW50XCI6IFwiYW5ndWxhcl93ZWJfMC4wLjJcIixcbiAgICAvLyAgICAgICAgICAgICBcIk1ldGhvZFwiOiBcImNhcnRJdGVtTW9kaWZ5XCIsXG4gICAgLy8gICAgICAgICAgICAgXCJEZXZpY2VJZFwiOiBcIjk4ODMwZmU2LWY1NjYtNzYwOS05MDNjLTdjNjQzZTQ2ZmZhMlwiLFxuICAgIC8vICAgICAgICAgICAgIFwiRG9tYWluXCI6IFwibW9zY293XCIsXG4gICAgLy8gICAgICAgICAgICAgXCJTdG9yZVwiOiBcInV0a1wiLFxuICAgIC8vICAgICAgICAgICAgIFwiU2Vzc2lvblRva2VuXCI6IFwiRkMwRkVENTJBOUExRTI4MzY0NDA2Mjc0RTJBMzJCMDdcIlxuICAgIC8vICAgICAgICAgfSwgXCJCb2R5XCI6IHsgXCJHb29kc0l0ZW1JZFwiOiBcIjU2NzQwNVwiLCBcIlF1YW50aXR5XCI6IDEsIFwiUmV0dXJuXCI6IHsgXCJDYXJ0XCI6IDEsIFwiR29vZHNcIjogMSB9IH1cbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgIFwibWV0aG9kXCI6IFwiUE9TVFwiLFxuICAgIC8vICAgXCJtb2RlXCI6IFwiY29yc1wiLFxuICAgIC8vICAgXCJjcmVkZW50aWFsc1wiOiBcImluY2x1ZGVcIlxuICAgIC8vIH0pO1xuICAgIC8vXG4gICAgbWFrZVJlcXVlc3QobWV0aG9kLCByZXF1ZXN0Qm9keSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3Qgc2Vzc2lvblRva2VuID0geWllbGQgQ29va2llcy5nZXQoJ1V0a19TZXNzaW9uVG9rZW4nKTtcbiAgICAgICAgICAgIGNvbnN0IGRldmljZUlkID0geWllbGQgQ29va2llcy5nZXQoJ1V0a19EdmNHdWlkJyk7XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0ge1xuICAgICAgICAgICAgICAgIFwiSGVhZFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiRGV2aWNlSWRcIjogZGV2aWNlSWQsXG4gICAgICAgICAgICAgICAgICAgIFwiU2Vzc2lvblRva2VuXCI6IHNlc3Npb25Ub2tlbixcbiAgICAgICAgICAgICAgICAgICAgXCJSZXF1ZXN0SWRcIjogKDAsIGhlbHBlcnNfMS51dWlkdjQpKCkucmVwbGFjZUFsbCgvLS9nLCAnJyksXG4gICAgICAgICAgICAgICAgICAgIFwiTWFya2V0aW5nUGFydG5lcktleVwiOiBcIm1wODAtNjYxMjk1YzljYmY5ZDZiMmY2NDI4NDE0NTA0YThkZWVkMzAyMDY0MVwiLFxuICAgICAgICAgICAgICAgICAgICBcIlZlcnNpb25cIjogXCJ1dGtvbm9zLWV4dFwiLFxuICAgICAgICAgICAgICAgICAgICBcIkNsaWVudFwiOiBcInV0a29ub3MtZXh0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiTWV0aG9kXCI6IG1ldGhvZCxcbiAgICAgICAgICAgICAgICAgICAgXCJEb21haW5cIjogXCJtb3Njb3dcIixcbiAgICAgICAgICAgICAgICAgICAgXCJTdG9yZVwiOiBcInV0a1wiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJCb2R5XCI6IHJlcXVlc3RCb2R5LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW25ldyBBUEldIHNlbmRpbmcgcmVxdWVzdCB0byBtZXRob2RcIiwgbWV0aG9kLCByZXF1ZXN0KTtcbiAgICAgICAgICAgIC8vIGNvbnN0IGZvcm1EYXRhID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpXG4gICAgICAgICAgICAvLyBmb3JtRGF0YS5hcHBlbmQoXCJyZXF1ZXN0XCIsIEpTT04uc3RyaW5naWZ5KHJlcXVlc3QpKVxuICAgICAgICAgICAgY29uc3QgZm9ybURhdGEgPSBgcmVxdWVzdD0ke0pTT04uc3RyaW5naWZ5KHJlcXVlc3QpfWA7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IHlpZWxkIGZldGNoKGBodHRwczovL3d3dy51dGtvbm9zLnJ1L2FwaS9yZXN0LyR7bWV0aG9kfWAsIHtcbiAgICAgICAgICAgICAgICBcImhlYWRlcnNcIjoge1xuICAgICAgICAgICAgICAgICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKlwiLFxuICAgICAgICAgICAgICAgICAgICBcIkFjY2VwdC1MYW5ndWFnZVwiOiBcImVuLVVTLGVuO3E9MC45LHJ1O3E9MC44XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic2VjLWNoLXVhXCI6IFwiXFxcIkdvb2dsZSBDaHJvbWVcXFwiO3Y9XFxcIjEwN1xcXCIsIFxcXCJDaHJvbWl1bVxcXCI7dj1cXFwiMTA3XFxcIiwgXFxcIk5vdD1BP0JyYW5kXFxcIjt2PVxcXCIyNFxcXCJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzZWMtY2gtdWEtbW9iaWxlXCI6IFwiPzBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzZWMtY2gtdWEtcGxhdGZvcm1cIjogXCJcXFwibWFjT1NcXFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic2VjLWZldGNoLWRlc3RcIjogXCJlbXB0eVwiLFxuICAgICAgICAgICAgICAgICAgICBcInNlYy1mZXRjaC1tb2RlXCI6IFwiY29yc1wiLFxuICAgICAgICAgICAgICAgICAgICBcInNlYy1mZXRjaC1zaXRlXCI6IFwic2FtZS1vcmlnaW5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJ4LXJldGFpbC1icmFuZFwiOiBcInV0a1wiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcInJlZmVycmVyXCI6IFwiaHR0cHM6Ly93d3cudXRrb25vcy5ydS9cIixcbiAgICAgICAgICAgICAgICBcInJlZmVycmVyUG9saWN5XCI6IFwibm8tcmVmZXJyZXItd2hlbi1kb3duZ3JhZGVcIixcbiAgICAgICAgICAgICAgICBcImJvZHlcIjogZm9ybURhdGEsXG4gICAgICAgICAgICAgICAgXCJtZXRob2RcIjogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgXCJtb2RlXCI6IFwiY29yc1wiLFxuICAgICAgICAgICAgICAgIFwiY3JlZGVudGlhbHNcIjogXCJpbmNsdWRlXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaylcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgZXhjZXB0aW9uc18xLlV0a29ub3NBUElFeGNlcHRpb24ocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlOiAnLCBkYXRhKTtcbiAgICAgICAgICAgIGlmIChkYXRhLkJvZHkuRXJyb3JMaXN0KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnNfMS5VdGtvbm9zQVBJRXhjZXB0aW9uKGRhdGEuQm9keS5FcnJvckxpc3RbMF0uTWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy51dGtvbm9zTmV3QVBJID0gbmV3IFV0a29ub3NOZXdBUEkoKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5VdGtvbm9zQVBJRXhjZXB0aW9uID0gdm9pZCAwO1xuY2xhc3MgVXRrb25vc0FQSUV4Y2VwdGlvbiBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLm5hbWUgPSBcIlV0a29ub3NBUElFeGNlcHRpb25cIjtcbiAgICB9XG59XG5leHBvcnRzLlV0a29ub3NBUElFeGNlcHRpb24gPSBVdGtvbm9zQVBJRXhjZXB0aW9uO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0bG9hZGVkOiBmYWxzZSxcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG5cdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5ubWQgPSAobW9kdWxlKSA9PiB7XG5cdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdHJldHVybiBtb2R1bGU7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcImluamVjdGVkX3NjcmlwdFwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmt1dGtvbm9zX2V4dFwiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmt1dGtvbm9zX2V4dFwiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5qZWN0ZWRfc2NyaXB0LnRzeFwiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9