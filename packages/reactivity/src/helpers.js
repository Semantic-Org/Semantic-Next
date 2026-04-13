import { isDevelopment } from '@semantic-ui/utils';

// whether to provide tracing context with signals
let tracing = false;

// Expensive path: Error.captureStackTrace per Signal.notify and per
// Reaction context update. Default off everywhere — opt-in for deep debug.
let stackCapture = false;

export const setTracing = (enabled) => {
  tracing = !!enabled;
};

export const isTracing = () => tracing;

export const setStackCapture = (enabled) => {
  stackCapture = !!enabled;
};

export const isStackCapture = () => stackCapture;
