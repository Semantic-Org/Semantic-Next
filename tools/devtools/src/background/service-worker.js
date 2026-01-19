import { MessageSources, MessageTypes } from '../shared/constants.js';

// Track connections from DevTools panels
const panelConnections = new Map(); // tabId -> port

// Handle connections from DevTools panels
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== MessageSources.PANEL) { return; }

  let tabId = null;

  port.onMessage.addListener((message) => {
    // First message should identify the tab
    if (message.type === MessageTypes.PANEL_INIT) {
      tabId = message.tabId;
      panelConnections.set(tabId, port);
      console.log(`Panel connected for tab ${tabId}`);
      return;
    }

    // Forward to content script
    if (tabId) {
      chrome.tabs.sendMessage(tabId, message).catch(err => {
        console.warn(`Failed to send message to tab ${tabId}:`, err);
      });
    }
  });

  port.onDisconnect.addListener(() => {
    if (tabId) {
      panelConnections.delete(tabId);
      console.log(`Panel disconnected for tab ${tabId}`);

      // Notify content script to cleanup
      chrome.tabs.sendMessage(tabId, { type: MessageTypes.PANEL_CLOSED }).catch(() => {
        // Tab may have been closed
      });
    }
  });
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabId = sender.tab?.id;
  if (!tabId) { return; }

  // Forward to panel if connected
  const port = panelConnections.get(tabId);
  if (port) {
    try {
      port.postMessage(message);
    }
    catch (err) {
      console.warn(`Failed to send message to panel for tab ${tabId}:`, err);
      panelConnections.delete(tabId);
    }
  }
});

// Handle tab updates (page navigation)
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    const port = panelConnections.get(tabId);
    if (port) {
      // Page has reloaded - bridge will need to reinitialize
      // The content script will re-inject the bridge
      console.log(`Tab ${tabId} reloaded, waiting for bridge`);
    }
  }
});

// Handle tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  panelConnections.delete(tabId);
});

console.log('SUI DevTools service worker initialized');
