import { setTracing as setReactivityTracing } from '@semantic-ui/reactivity';
import { setTracing as setRendererTracing } from '@semantic-ui/renderer';

// Convenience facade — flips both reactivity and renderer tracing.
// Use the package-specific setTracing exports for finer-grained control.
export const setTracing = (enabled) => {
  setReactivityTracing(enabled);
  setRendererTracing(enabled);
};
