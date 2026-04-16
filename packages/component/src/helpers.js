import { Signal } from '@semantic-ui/reactivity';
import { setRecovery as setRendererRecovery, setTracing as setRendererTracing } from '@semantic-ui/renderer';

// Cheap path — context naming + structured block error log. Default on
// in dev for reactivity (renderer tracing stays off; the always-on
// breadcrumb covers visibility there).
export const setTracing = (enabled) => {
  Signal.tracing = enabled;
  setRendererTracing(enabled);
};

// Expensive path — Error.captureStackTrace per Signal.notify. Opt-in.
export const setStackCapture = (enabled) => {
  Signal.stackCapture = enabled;
};

export const setRecovery = setRendererRecovery;
