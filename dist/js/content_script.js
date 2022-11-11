/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!********************************!*\
  !*** ./src/content_script.tsx ***!
  \********************************/

function init({ promocode }) {
    for (const script of ['sku-mapping.js', 'js/vendor.js', 'js/injected_script.js']) {
        const injectedScript = document.createElement('script');
        injectedScript.src = chrome.runtime.getURL(script) + '?' + new URLSearchParams({ promocode: promocode });
        document.documentElement.appendChild(injectedScript);
    }
    const styles = 'styles.css';
    const styleTag = document.createElement('link');
    styleTag.setAttribute('rel', 'stylesheet');
    styleTag.setAttribute('href', chrome.runtime.getURL(styles));
    document.documentElement.appendChild(styleTag);
}
chrome.storage.sync.get({
    promocode: "",
}, (items) => {
    init(items);
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudF9zY3JpcHQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWE7QUFDYixnQkFBZ0IsV0FBVztBQUMzQjtBQUNBO0FBQ0EseUZBQXlGLHNCQUFzQjtBQUMvRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly91dGtvbm9zLWV4dC8uL3NyYy9jb250ZW50X3NjcmlwdC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5mdW5jdGlvbiBpbml0KHsgcHJvbW9jb2RlIH0pIHtcbiAgICBmb3IgKGNvbnN0IHNjcmlwdCBvZiBbJ3NrdS1tYXBwaW5nLmpzJywgJ2pzL3ZlbmRvci5qcycsICdqcy9pbmplY3RlZF9zY3JpcHQuanMnXSkge1xuICAgICAgICBjb25zdCBpbmplY3RlZFNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICBpbmplY3RlZFNjcmlwdC5zcmMgPSBjaHJvbWUucnVudGltZS5nZXRVUkwoc2NyaXB0KSArICc/JyArIG5ldyBVUkxTZWFyY2hQYXJhbXMoeyBwcm9tb2NvZGU6IHByb21vY29kZSB9KTtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKGluamVjdGVkU2NyaXB0KTtcbiAgICB9XG4gICAgY29uc3Qgc3R5bGVzID0gJ3N0eWxlcy5jc3MnO1xuICAgIGNvbnN0IHN0eWxlVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICAgIHN0eWxlVGFnLnNldEF0dHJpYnV0ZSgncmVsJywgJ3N0eWxlc2hlZXQnKTtcbiAgICBzdHlsZVRhZy5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBjaHJvbWUucnVudGltZS5nZXRVUkwoc3R5bGVzKSk7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKHN0eWxlVGFnKTtcbn1cbmNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KHtcbiAgICBwcm9tb2NvZGU6IFwiXCIsXG59LCAoaXRlbXMpID0+IHtcbiAgICBpbml0KGl0ZW1zKTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9