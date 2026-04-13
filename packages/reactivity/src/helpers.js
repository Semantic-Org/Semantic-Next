import { isDevelopment } from '@semantic-ui/utils';

// Cheap path: context naming, firstRun marker, addContext metadata.
// Default on in dev — escape-analysis-friendly object writes, no captures.
let tracing = isDevelopment;

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
