let tracing = false;
let recovery = false;

export const setTracing = (enabled) => {
  tracing = !!enabled;
};

export const isTracing = () => tracing;

export const setRecovery = (enabled) => {
  recovery = !!enabled;
};

export const isRecovery = () => recovery;
