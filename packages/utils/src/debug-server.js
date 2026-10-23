const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const UNDERLINE = '\x1b[4m';

// pre-baked dark-theme oklch tokens from src/css/tokens (muted-blue info badge,
// neutral grey info prose/tokens, --yellow-70 warn and --red-70 error with 50%
// --light-text-color secondary mix) so oklchToRgb never rides the logger
const TIME_COL = '\x1b[38;2;99;99;99m';

const PALETTE = {
  debug: {
    badge: '\x1b[38;2;116;116;116m',
    prose1: '\x1b[38;2;116;116;116m',
    tok1: '\x1b[38;2;164;164;164m',
    prose2: '\x1b[38;2;99;99;99m',
    tok2: '\x1b[38;2;140;140;140m',
    boldTok: false,
  },
  info: {
    badge: '\x1b[38;2;117;158;185m',
    prose1: '\x1b[38;2;152;152;152m',
    tok1: '\x1b[38;2;202;202;202m',
    prose2: '\x1b[38;2;116;116;116m',
    tok2: '\x1b[38;2;164;164;164m',
    boldTok: false,
  },
  warn: {
    badge: '\x1b[38;2;255;232;130m',
    prose1: '\x1b[38;2;255;232;130m',
    tok1: '\x1b[38;2;255;236;164m',
    prose2: '\x1b[38;2;190;164;119m',
    tok2: '\x1b[38;2;211;186;142m',
    boldTok: true,
  },
  error: {
    badge: '\x1b[38;2;255;108;93m',
    prose1: '\x1b[38;2;255;108;93m',
    tok1: '\x1b[38;2;255;156;141m',
    prose2: '\x1b[38;2;187;109;99m',
    tok2: '\x1b[38;2;215;137;127m',
    boldTok: true,
  },
};
PALETTE.log = PALETTE.info;

const NAMED_ANSI = {
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  grey: '\x1b[90m',
};

const toAnsiColor = (value) => {
  if (!value || typeof value !== 'string' || value === 'inherit') {
    return null;
  }
  if (value.startsWith('\x1b[')) {
    return value;
  }
  const lower = value.toLowerCase().trim();
  if (NAMED_ANSI[lower]) {
    return NAMED_ANSI[lower];
  }
  if (lower.startsWith('#')) {
    const hex = lower.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return `\x1b[38;2;${r};${g};${b}m`;
    }
    if (hex.length >= 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `\x1b[38;2;${r};${g};${b}m`;
    }
  }
  const rgbMatch = lower.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    return `\x1b[38;2;${rgbMatch[1]};${rgbMatch[2]};${rgbMatch[3]}m`;
  }
  return null;
};

const TOKEN_RE =
  /(\[\s*\{[^[\]]*\}\s*\]|\{[^{}]+\}|"[^"]+"|'[^']+'|`[^`]+`|(?:\.{1,2}\/|\/)[\w./-]+|\b\d{1,3}(?:\.\d{1,3}){3}:\d+\b|(?<=\s):(\d{2,5})\b|\([A-Z0-9_]{3,}\)|\b\d+(?:\.\d+)?(?:ms|s|m|h|B|KB|MB|GB)?\b)/g;

const defaultFormatNamespace = (ns) => (ns.startsWith('[') ? ns : `[${ns}]`);

const hasAnsiSupport = () => {
  if (typeof process === 'undefined' || !process.env) {
    return false;
  }
  if (process.env.NO_COLOR || process.env.FORCE_COLOR === '0') {
    return false;
  }
  if (process.env.FORCE_COLOR) {
    return true;
  }
  return Boolean(process.stdout?.isTTY || process.stderr?.isTTY);
};

const styleClause = (text, proseColor, tokenColor, highlight, boldToken) => {
  if (!highlight) {
    return `${proseColor}${text}${RESET}`;
  }
  return proseColor + text.replace(TOKEN_RE, (m) => {
    const u = (m.startsWith('.') || m.startsWith('/')) ? UNDERLINE : '';
    const b = boldToken ? BOLD : '';
    return `${RESET}${b}${u}${tokenColor}${m}${RESET}${proseColor}`;
  }) + RESET;
};

export const formatServerLog = (
  message,
  level = 'log',
  {
    namespace = '',
    formatNamespace = defaultFormatNamespace,
    timestamp = true,
    title,
    showTitle = true,
    titleColor = null,
    color = 'inherit',
    noColor,
    highlight = true,
    fadeSecondary = false,
  } = {},
) => {
  const resolvedTitle = title !== undefined
    ? title
    : (namespace && formatNamespace
      ? (typeof formatNamespace === 'function' ? formatNamespace(namespace) : defaultFormatNamespace(namespace))
      : namespace);

  const time = timestamp
    ? new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })
    : '';

  const plain = noColor !== undefined ? Boolean(noColor) : !hasAnsiSupport();
  if (plain) {
    let out = '';
    if (time) {
      out += `${time} `;
    }
    if (resolvedTitle && showTitle) {
      out += `${resolvedTitle} `;
    }
    return out + message;
  }

  const pal = PALETTE[level] || PALETTE.info;
  const badgeCol = toAnsiColor(titleColor) || pal.badge;
  const prose1Col = toAnsiColor(color) || pal.prose1;

  let prefix = '';
  if (time) {
    prefix += `${TIME_COL}${time}${RESET} `;
  }
  if (resolvedTitle && showTitle) {
    prefix += `${BOLD}${badgeCol}${resolvedTitle}${RESET} `;
  }

  const str = String(message);
  const dotIdx = fadeSecondary ? str.indexOf('. ') : -1;
  if (dotIdx !== -1) {
    const first = str.slice(0, dotIdx + 1);
    const rest = str.slice(dotIdx + 2);
    return `${prefix}${styleClause(first, prose1Col, pal.tok1, highlight, pal.boldTok)} ${
      styleClause(rest, pal.prose2, pal.tok2, highlight, false)
    }`;
  }

  return `${prefix}${styleClause(str, prose1Col, pal.tok1, highlight, pal.boldTok)}`;
};
