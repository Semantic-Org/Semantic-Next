import { asyncMap } from '@semantic-ui/utils';

// Simulate async operations
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const fetchUser = async (id) => {
  await delay(100);
  return { id, name: `User ${id}`, email: `user${id}@example.com` };
};

// Async array mapping
console.log('Async array mapping:');
const userIds = [1, 2, 3, 4];

const users = await asyncMap(userIds, async (id, index) => {
  console.log(`  Fetching user ${id}...`);
  const user = await fetchUser(id);
  console.log(`  Got user: ${user.name}`);
  return user;
});

console.log('All users fetched:', users);

// Async object mapping
console.log('\nAsync object mapping:');
const endpoints = {
  users: '/api/users',
  posts: '/api/posts',
  comments: '/api/comments',
};

const responses = await asyncMap(endpoints, async (url, key) => {
  console.log(`  Calling ${key} at ${url}...`);
  await delay(120);
  const mockResponse = {
    data: `Mock data from ${url}`,
    status: 200,
    timestamp: new Date().toISOString(),
  };
  console.log(`  ${key} response received`);
  return mockResponse;
});

console.log('All API responses:', responses);

// Transform data asynchronously
console.log('\nAsync data transformation:');
const rawData = [10, 20, 30];

const processedData = await asyncMap(rawData, async (value, index) => {
  console.log(`  Processing value ${value}...`);
  await delay(80);
  const result = {
    original: value,
    doubled: value * 2,
    processed: true,
    processedAt: Date.now(),
  };
  console.log(`  Processed ${value} -> ${result.doubled}`);
  return result;
});

console.log('Processed data:', processedData);
