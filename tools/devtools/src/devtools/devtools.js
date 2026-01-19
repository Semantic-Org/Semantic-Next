// Create the Semantic UI panel when DevTools opens
chrome.devtools.panels.create(
  'Semantic UI',
  'icons/icon32.png',
  'panel/panel.html',
  (panel) => {
    panel.onShown.addListener((panelWindow) => {
      // Panel is now visible - request fresh tree scan
      panelWindow.postMessage({ type: 'PANEL_SHOWN' }, '*');
    });

    panel.onHidden.addListener(() => {
      // Panel is now hidden - could pause updates to save resources
    });
  },
);
