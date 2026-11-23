/*
  The preview's side of the host <-> preview channel, injected into every
  served document ahead of the app. Reports where the document is and what it
  throws, and takes navigation commands, so a host never reaches into the
  frame's window or depends on what the app exposes as globals.

  Messages carry the session id so a host can tell previews apart.
*/

export const previewMessageType = 'sui-playground-preview';
export const previewCommandType = 'sui-playground-command';

export const bridgeSource = (sessionId) =>
  `(() => {
  if (window.parent === window) return;
  const post = (message) => parent.postMessage({ type: '${previewMessageType}', sessionId: ${
    JSON.stringify(sessionId).replace(/</g, '\\u003c')
  }, ...message }, '*');
  const report = () => post({
    event: 'navigate',
    href: location.href,
    canGoBack: window.navigation?.canGoBack,
    canGoForward: window.navigation?.canGoForward,
  });
  if (window.navigation) {
    navigation.addEventListener('currententrychange', report);
  }
  else {
    addEventListener('popstate', report);
    addEventListener('hashchange', report);
  }
  addEventListener('error', (event) => post({ event: 'error', message: event.message }));
  addEventListener('unhandledrejection', (event) => post({ event: 'error', message: String(event.reason?.message ?? event.reason) }));
  addEventListener('message', (event) => {
    if (event.source !== parent || event.data?.type !== '${previewCommandType}') return;
    const { command, url } = event.data;
    if (command === 'reload') location.reload();
    else if (command === 'navigate') location.assign(url);
    else if (command === 'back') history.back();
    else if (command === 'forward') history.forward();
  });
  report();
})();`;

export const previewBridge = (sessionId) => `<script>${bridgeSource(sessionId)}</script>`;
