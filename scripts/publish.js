import { exec } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import inquirer from 'inquirer';
import { join } from 'path';
import semver from 'semver';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Helper function to load JSON
const loadJsonFile = (filePath) => {
  return JSON.parse(readFileSync(filePath, { encoding: 'utf8' }));
};

// Load the main package.json to determine the version to set
const versionArg = process.argv[2];
const dryRun = process.argv.includes('--dry-run');
const ciOverride = process.argv.includes('--ci');

const mainPackageJsonPath = join(process.cwd(), 'package.json');
const mainPackageJson = loadJsonFile(mainPackageJsonPath);
let newVersion = mainPackageJson.version;

// Async function to publish a package
async function publishPackage(dir) {
  // second failsafe check for internal packages
  if(dryRun || dir.includes('internal-packages')) {
    return;
  }
  try {
    console.log(`Publishing package in ${dir}...`);
    await execAsync('npm publish', { cwd: dir });
    console.log(`Successfully published package from ${dir}.`);
  }
  catch (error) {
    console.error(`Failed to publish package from ${dir}: ${error.message}`);
  }
}

// Read workspaces to publish from main package
// ignoring internal packages
const workspaceGlobs = mainPackageJson.workspaces.filter(val => !val.includes('internal-packages'));
(async () => {

  // publishing packages
  const publishPromises = [];
  workspaceGlobs.forEach(workspaceGlob => {
    const workspaceDirs = globSync(workspaceGlob, { realpath: true });
    workspaceDirs.forEach(dir => {
      publishPromises.push(publishPackage(dir));
    });
  });
  await Promise.all(publishPromises);
  console.log('All packages have been processed.');

  console.log(`Updated versions of all packages to ${newVersion}`);
  // Update the root package-lock.json to reflect updated sub-package versions.
  if (!dryRun) {
    console.log('Updating root package-lock.json...');
    await execAsync('npm install', { cwd: process.cwd() });
  }

  // committing package-lock changes and tagging
  if (!dryRun) {
    try {
      // Stage changes
      console.log('Staging changes...');
      await execAsync('git add ./');

      // Check if there are changes to commit
      const statusOutput = await execAsync('git status --porcelain');
      if (statusOutput.stdout.trim()) {
        // Commit changes
        console.log('Committing changes...');
        await execAsync(`git commit -m "chore: bump versions to ${newVersion}"`);

        // Push changes
        console.log('Pushing changes...');
        await execAsync('git push');

        // Tag the new version
        console.log('Tagging new version...');
        await execAsync(`git tag -a v${newVersion} -m "Release version ${newVersion}"`);
        await execAsync('git push --tags');

        console.log('Committed and pushed version updates and created a new tag.');
      }
      else {
        console.log('No changes to commit.');
      }
    }
    catch (error) {
      console.error(`Failed to commit and push changes: ${error.message}`);
    }
  }

})();
