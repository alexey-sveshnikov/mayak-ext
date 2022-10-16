console.log('[utkonos-ext] background script started')

chrome.commands.onCommand.addListener((command) => {
  console.log(`Command "${command}" triggered`);
  if (command === "reload") {
    console.log('Reloading')
    chrome.runtime.reload()
  }
});