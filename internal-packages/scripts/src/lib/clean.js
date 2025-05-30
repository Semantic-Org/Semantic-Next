/**
 * Recursively cleans a directory by removing all files and subdirectories
 * @param {string} directoryPath - Path to the directory to clean
 */
export async function cleanDirectory(directoryPath) {
  try {
    // Check if directory exists
    try {
      await fs.access(directoryPath);
    } catch (error) {
      console.log(`Directory ${directoryPath} does not exist, skipping clean operation.`);
      return;
    }

    // Read directory contents
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    
    // Process each entry (file or directory)
    for (const entry of entries) {
      const entryPath = path.join(directoryPath, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively remove subdirectory
        await fs.rm(entryPath, { recursive: true, force: true });
      } else {
        // Remove file
        await fs.unlink(entryPath);
      }
    }
    
    console.log(`Successfully cleaned ${directoryPath}`);
  } catch (error) {
    console.error(`Error cleaning directory ${directoryPath}:`, error);
    process.exit(1);
  }
}
