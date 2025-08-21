import { isClient } from './environment.js';

/*-------------------
       Browser
--------------------*/

export const copyText = (text) => {
  return navigator.clipboard.writeText(text);
};

export const openLink = (url, { newWindow = false, settings, target, event } = {}) => {
  if (newWindow) {
    window.open(url, target, settings);
  }
  else {
    window.location.href = url;
  }
  if (event) {
    event.preventDefault();
  }
};

export const getKeyFromEvent = (event) => {
  let pressedKey = event?.key;
  if (!pressedKey) {
    return '';
  }
  let key = '';
  if (event.ctrlKey && pressedKey !== 'Control') {
    key += 'ctrl+';
  }
  if (event.altKey && pressedKey !== 'Alt') {
    key += 'alt+';
  }
  if (event.shiftKey && pressedKey !== 'Shift') {
    key += 'shift+';
  }
  if (event.metaKey && pressedKey !== 'Meta') {
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

/* Wrapper for requestIdleCallback which does not have safari support */
export const idleCallback = (callback) => {
  if (isClient && window.requestIdleCallback !== undefined) {
    requestIdleCallback(callback);
  }
  else {
    setTimeout(callback, 1);
  }
};

const DEFAULT_STUN_SERVER = 'stun:stun.l.google.com:19302';
const ICE_SERVERS = [{ urls: DEFAULT_STUN_SERVER }];
const IP_REGEX = /\s([0-9]{1,3}(?:\.[0-9]{1,3}){3}|[A-Fa-f0-9]*:[A-Fa-f0-9:]+)\s/;

export const getIPAddress = async ({
  type = 'public',
  timeout = 5000,
  waitAfterLastIP = 50,
} = {}) =>
  new Promise((resolve, reject) => {
    let settled = false;
    let debounceTimer = null;

    const safeResolve = (v) => {
      if (!settled) {
        settled = true;
        resolve(v);
      }
    };
    const safeReject = (e) => {
      if (!settled) {
        settled = true;
        reject(e);
      }
    };

    if (!isClient) {
      safeReject(new Error('IP address can only be determined on client'));
      return;
    }

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    const isPublic = type === 'public';
    const candidateFilter = type === 'all'
      ? () => true
      : (c) => c.includes(`typ ${isPublic ? 'srflx' : 'host'}`);

    const found = new Set();

    const finalize = () => {
      clearTimeout(timer);
      clearTimeout(debounceTimer);
      pc.onicecandidate = null;
      pc.removeEventListener('icegatheringstatechange', onStateChange);
      try {
        pc.close();
      }
      catch { /* noop */ }

      if (isPublic) {
        safeReject(new Error('No public IP address found'));
      }
      else if (found.size) {
        safeResolve([...found]);
      }
      else {
        safeReject(new Error(`No ${type} IP addresses found`));
      }
    };

    const timer = setTimeout(() => {
      finalize();
    }, timeout);

    const onStateChange = () => {
      if (pc.iceGatheringState === 'complete') {
        finalize();
      }
    };

    pc.addEventListener('icegatheringstatechange', onStateChange);

    pc.onicecandidate = ({ candidate }) => {
      try {
        if (candidate?.candidate) {
          const cand = candidate.candidate;
          if (candidateFilter(cand)) {
            const match = IP_REGEX.exec(cand);
            if (match) {
              if (isPublic) {
                clearTimeout(timer);
                pc.onicecandidate = null;
                pc.removeEventListener('icegatheringstatechange', onStateChange);
                try {
                  pc.close();
                }
                catch { /* noop */ }
                safeResolve(match[1]);
              }
              else {
                found.add(match[1]);
                if (['local', 'all'].includes(type)) {
                  clearTimeout(debounceTimer);
                  debounceTimer = setTimeout(() => {
                    safeResolve([...found]);
                  }, waitAfterLastIP);
                }
              }
            }
          }
        }
        // If candidate is null we *might* already have 'complete',
        // but some engines still fire it – treat as fallback.
        else if (!isPublic) {
          finalize();
        }
      }
      catch (err) {
        clearTimeout(timer);
        try {
          pc.close();
        }
        catch { /* noop */ }
        safeReject(err);
      }
    };

    pc.createDataChannel('');
    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .catch((err) => {
        clearTimeout(timer);
        try {
          pc.close();
        }
        catch { /* noop */ }
        safeReject(err);
      });
  });

/*-------------------
         XHR
--------------------*/

export const getText = async (src, settings) => {
  const response = (settings)
    ? await fetch(src, settings)
    : await fetch(src);
  return await response.text();
};

export const getJSON = async (src, settings) => {
  const response = (settings)
    ? await fetch(src, settings)
    : await fetch(src);
  return await response.json();
};
