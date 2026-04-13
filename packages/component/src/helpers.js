import { setTracing as setReactivityTracing } from '@semantic-ui/reactivity';
import { setRecovery as setRendererRecovery, setTracing as setRendererTracing } from '@semantic-ui/renderer';

export const setTracing = (enabled) => {
  setReactivityTracing(enabled);
  setRendererTracing(enabled);
};

export const setRecovery = setRendererRecovery;
