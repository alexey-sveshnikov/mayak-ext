function init({ promocode }: { promocode: string }) {
  for (const script of ['sku-mapping.js', 'js/vendor.js', 'js/injected_script.js']) {
    const injectedScript = document.createElement('script');
    injectedScript.src = chrome.runtime.getURL(script) + '?' + new URLSearchParams({ promocode: promocode });

    document.documentElement.appendChild(injectedScript);
  }

  const styles = 'styles.css'
  const styleTag = document.createElement('link')
  styleTag.setAttribute('rel', 'stylesheet')
  styleTag.setAttribute('href', chrome.runtime.getURL(styles))
  document.documentElement.appendChild(styleTag);
}


chrome.storage.sync.get(
  {
    promocode: "",
  },
  (items) => {
    init(items as { promocode: string })
  }
)
