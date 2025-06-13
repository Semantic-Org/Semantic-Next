// Test data for consistent testing across server and browser
export const testCases = {
  basic: {
    content: '<div class="p-4 bg-blue-500 text-white font-bold">Hello World</div>',
    expectedClasses: ['p-4', 'bg-blue-500', 'text-white', 'font-bold'],
  },
  
  responsive: {
    content: '<div class="p-2 md:p-4 lg:p-6 bg-red-500 md:bg-green-500 lg:bg-blue-500">Responsive</div>',
    expectedClasses: ['p-2', 'md:p-4', 'lg:p-6', 'bg-red-500', 'md:bg-green-500', 'lg:bg-blue-500'],
  },
  
  pseudoClasses: {
    content: '<button class="bg-blue-500 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300">Button</button>',
    expectedClasses: ['bg-blue-500', 'hover:bg-blue-700', 'focus:ring-2', 'focus:ring-blue-300'],
  },
  
  complexLayout: {
    content: `
      <div class="flex flex-col md:flex-row gap-4 p-6">
        <div class="flex-1 bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-2">Card Title</h2>
          <p class="text-gray-600">Card content</p>
        </div>
      </div>
    `,
    expectedClasses: [
      'flex', 'flex-col', 'md:flex-row', 'gap-4', 'p-6',
      'flex-1', 'bg-gray-100', 'p-4', 'rounded-lg', 'shadow-md',
      'text-xl', 'font-semibold', 'mb-2', 'text-gray-600'
    ],
  },
  
  arbitraryValues: {
    content: '<div class="w-[32rem] h-[200px] bg-[#ff6b6b] text-[1.125rem]">Arbitrary values</div>',
    expectedClasses: ['w-[32rem]', 'h-[200px]', 'bg-[#ff6b6b]', 'text-[1.125rem]'],
  },
  
  jsContent: {
    content: `
      <script>
        const classes = ['bg-purple-500', 'text-white', 'p-3'];
        element.className = classes.join(' ');
      </script>
      <div class="bg-purple-500 text-white p-3">JS Content</div>
    `,
    expectedClasses: ['bg-purple-500', 'text-white', 'p-3'],
  },
  
  empty: {
    content: '<div>No classes here</div>',
    expectedClasses: [],
  },
  
  customCSS: {
    content: '<div class="custom-class p-4">Custom CSS Test</div>',
    css: '.custom-class { border: 1px solid red; }',
    expectedClasses: ['p-4'], // custom-class won't be extracted by Tailwind scanner
  },
};

export const mockCandidates = ['p-4', 'bg-red-500', 'text-white', 'font-bold'];

// Helper to normalize CSS for comparison
export function normalizeCSS(css) {
  return css
    .replace(/\s+/g, ' ')
    .replace(/;\s*}/g, '}')
    .replace(/{\s*/g, '{')
    .trim();
}

// Helper to check if array contains expected classes
export function containsClasses(actualClasses, expectedClasses) {
  return expectedClasses.every(expectedClass => 
    actualClasses.includes(expectedClass)
  );
}