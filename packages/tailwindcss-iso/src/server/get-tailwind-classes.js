/**
 * Generates Tailwind CSS for Node Environments
 * using WASM Oxide Engine
 */

import { Scanner } from '@tailwindcss/oxide';

export async function getTailwindClasses({
  content = '', // html and js content to scan
  returnPositions = false, // whether to return classes with positions
  extension = 'html' // file extension hint for parser ('html', 'js', 'jsx', 'tsx', 'vue', etc.)
}) {

  // Scanner will let us extract content classes
  const scanner = new Scanner({ sources: [] });

  // Scanner gives us classes and positions using the server API
  const changedContent = {
    content,
    extension,
  };
  const candidatesWithPositions = scanner.getCandidatesWithPositions(changedContent);

  // allow either returning with positions or just array of classes
  return (returnPositions)
    ? candidatesWithPositions
    : candidatesWithPositions.map(item => item.candidate);
}
