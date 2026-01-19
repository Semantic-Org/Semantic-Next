// Content script - runs in isolated world
// Relays messages between bridge (page context) and service worker

const BRIDGE_SOURCE = 'sui-devtools-bridge';
const CONTENT_SOURCE = 'sui-devtools-content';

let bridgeInjected = false;

// Inject bridge script into page context
function injectBridge() {
  if (bridgeInjected) { return; }
  if (document.querySelector('script[data-sui-devtools]')) { return; }

  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('content/bridge.js');
  script.dataset.suiDevtools = 'true';
  script.onload = () => {
    script.remove();
    bridgeInjected = true;
  };
  script.onerror = (err) => {
    console.error('Failed to inject SUI DevTools bridge:', err);
  };

  (document.head || document.documentElement).appendChild(script);
}

// Relay messages from bridge to service worker
window.addEventListener('message', (event) => {
  if (event.source !== window) { return; }
  if (!event.data || event.data.source !== BRIDGE_SOURCE) { return; }

  // Forward to service worker
  chrome.runtime.sendMessage(event.data.payload).catch(err => {
    // Service worker may not be ready yet
    console.warn('Failed to send message to service worker:', err);
  });
});

// Relay messages from service worker to bridge
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Forward to bridge via postMessage
  window.postMessage({
    source: CONTENT_SOURCE,
    payload: message,
  }, '*');
});

// Inject bridge on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectBridge);
}
else {
  injectBridge();
}
