/*-------------------
      Browser
--------------------*/

export const copyText = (text) => {
  navigator.clipboard.writeText(text);
};

export const openLink = (url, { newWindow = false, settings, target, event } = {}) => {
  if(newWindow) {
    window.open(url, target, settings);
  }
  else {
    window.location.href = url;
  }
  if(event) {
    event.preventDefault();
  }
};

export const getKeyFromEvent = (event) => {
  let pressedKey = event?.key;
  if(!pressedKey) {
    return '';
  }
  let key = '';
  if(event.ctrlKey && pressedKey !== 'Control') {
    key += 'ctrl+';
  }
  if(event.altKey && pressedKey !== 'Alt') {
    key += 'alt+';
  }
  if(event.shiftKey && pressedKey !== 'Shift') {
    key += 'shift+';
  }
  if(event.metaKey && pressedKey !== 'Meta') {
    key += 'meta+';
  }
  // standardize key names
  const specialKeys = {
    Control: 'ctrl',
    Escape: 'esc',
    ' ': 'space',
  };
  pressedKey = pressedKey.replace('Arrow', ''); // ArrowUp -> up
  key += specialKeys[pressedKey] || pressedKey.toLowerCase();
  return key;
};

/*-------------------
         XHR
--------------------*/

export const getText = async (src, settings) => {
  const response = (settings)
    ? await fetch(src, settings)
    : await fetch(src)
  ;
  return await response.text();
};

export const getJSON = async (src, settings) => {
  const response = (settings)
    ? await fetch(src, settings)
    : await fetch(src)
  ;
  return await response.json();
};

/*-------------------
      Constants
--------------------*/

export const isServer = (() => {
  return typeof window === 'undefined';
})();

export const isClient = (() => {
  return typeof window !== 'undefined';
})();

