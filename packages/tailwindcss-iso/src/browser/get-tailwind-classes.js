/**
 * Gets candidate classes from content
 */

export async function getTailwindClasses({
  content = '', // html and js content to scan
  returnPositions = false, // whether to return classes with positions
  extension = 'html' // file extension hint for parser ('html', 'js', 'jsx', 'tsx', 'vue', etc.)
}) {

  /*
    This relies on a non-threaded special port of Oxide
    this is currently generated from a forked version of Oxide
    <https://github.com/tailwindlabs/tailwindcss/pull/18292>
  */
  let Scanner, ChangedContent;
  try {
    // Load WASM-based scanner for browser environment
    const wasmModule = await import('./oxide/tailwindcss_oxide.js');
    await wasmModule.default();
    Scanner = wasmModule.WasmScanner;
    ChangedContent = wasmModule.WasmChangedContent;
  }
  catch (error) {
    throw new Error(
      'Failed to load WASM scanner: ' + error.message,
    );
  }

  // Scanner will let us extract content classes
  const scanner = new Scanner();

  // Create "changed content" with passed in content
  const changedContent = new ChangedContent(content, extension);

  // Scanner gives us classes and positions
  const candidatesWithPositions = scanner.getCandidatesWithPositions(changedContent);

  // allow either returning with positions or just array of classes
  return (returnPositions)
    ? candidatesWithPositions
    : candidatesWithPositions.map(item => item.candidate);
}
