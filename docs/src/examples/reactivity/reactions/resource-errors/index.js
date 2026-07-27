import { reaction, resource, settled } from '@semantic-ui/reactivity';

let attempt = 0;

// answers once, then the endpoint goes down
const checkHealth = async () => {
  attempt++;
  if (attempt > 1) {
    throw new Error('HTTP 503');
  }
  return 'healthy';
};

const status = resource(checkHealth, {
  initialValue: 'unknown',
  onError: (error) => console.log(`reported: ${error.message}`),
});

reaction(() => {
  const value = status.get();
  if (status.loading) {
    // settled is what tells a first load apart from a refresh
    console.log(status.settled ? `refreshing, showing ${value}` : `first load, showing ${value}`);
  }
  else if (status.error) {
    console.log(`${status.error.message}, still showing ${value}`);
  }
  else {
    console.log(`showing ${value}`);
  }
});

await settled(); // let the first check land
status.refresh();
