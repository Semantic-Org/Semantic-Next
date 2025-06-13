/**
 * Generates Tailwind CSS for Node Environments
 * using WASM Oxide Engine
 */

import { Scanner, ChangedContent } from '@tailwindcss/oxide';

export async function getTailwindClasses({
  content = '', // html and js content to scan
  returnPositions = false // whether to return classes with positions
}) {

  // Scanner will let us extract content classes
  const scanner = new Scanner();

  // Create "changed content" with passed in content
  const changedContent = new ChangedContent(content, 'html');

  // Scanner gives us classes and positions
  const candidatesWithPositions = scanner.getCandidatesWithPositions(changedContent);

  // allow either returning with positions or just array of classes
  return (withPositions)
    ? candidatesWithPositions
    : candidatesWithPositions.map(item => item.candidate);
}
