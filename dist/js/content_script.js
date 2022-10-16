/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!********************************!*\
  !*** ./src/content_script.tsx ***!
  \********************************/

for (const script of ['js/vendor.js', 'js/injected_script.js']) {
    const injectedScript = document.createElement('script');
    injectedScript.src = chrome.runtime.getURL(script);
    document.documentElement.appendChild(injectedScript);
}

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudF9zY3JpcHQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdXRrb25vcy1leHQvLi9zcmMvY29udGVudF9zY3JpcHQudHN4Il0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuZm9yIChjb25zdCBzY3JpcHQgb2YgWydqcy92ZW5kb3IuanMnLCAnanMvaW5qZWN0ZWRfc2NyaXB0LmpzJ10pIHtcbiAgICBjb25zdCBpbmplY3RlZFNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgIGluamVjdGVkU2NyaXB0LnNyYyA9IGNocm9tZS5ydW50aW1lLmdldFVSTChzY3JpcHQpO1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hcHBlbmRDaGlsZChpbmplY3RlZFNjcmlwdCk7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=