for (const script of ['js/vendor.js', 'js/injected_script.js']) {
  const injectedScript = document.createElement('script');
  injectedScript.src = chrome.runtime.getURL(script)
  document.documentElement.appendChild(injectedScript);
}

const styles = 'styles.css'
const styleTag = document.createElement('link')
styleTag.setAttribute('rel', 'stylesheet')
styleTag.setAttribute('href', chrome.runtime.getURL(styles))
document.documentElement.appendChild(styleTag);
