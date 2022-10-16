/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/

console.log('[utkonos-ext] background script started');
chrome.commands.onCommand.addListener((command) => {
    console.log(`Command "${command}" triggered`);
    if (command === "reload") {
        console.log('Reloading');
        chrome.runtime.reload();
    }
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBYTtBQUNiO0FBQ0E7QUFDQSw0QkFBNEIsUUFBUTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly91dGtvbm9zLWV4dC8uL3NyYy9iYWNrZ3JvdW5kLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuY29uc29sZS5sb2coJ1t1dGtvbm9zLWV4dF0gYmFja2dyb3VuZCBzY3JpcHQgc3RhcnRlZCcpO1xuY2hyb21lLmNvbW1hbmRzLm9uQ29tbWFuZC5hZGRMaXN0ZW5lcigoY29tbWFuZCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKGBDb21tYW5kIFwiJHtjb21tYW5kfVwiIHRyaWdnZXJlZGApO1xuICAgIGlmIChjb21tYW5kID09PSBcInJlbG9hZFwiKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdSZWxvYWRpbmcnKTtcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUucmVsb2FkKCk7XG4gICAgfVxufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=