for (const script of ['js/vendor.js', 'js/injected_script.js']) {
  const injectedScript = document.createElement('script');
  injectedScript.src = chrome.runtime.getURL(script)
  document.documentElement.appendChild(injectedScript);
}
