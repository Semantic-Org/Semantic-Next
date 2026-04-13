let tracing = false;

export const setTracing = (enabled) => {
  tracing = !!enabled;
};

export const isTracing = () => tracing;
