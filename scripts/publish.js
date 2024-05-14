import { exec } from 'child_process';
import { promisify } from 'util';
import glob from 'glob';
import { join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import semver from 'semver';

const execAsync = promisify(exec);

// Helper function to load JSON
const loadJsonFile = (filePath) => {
  return JSON.parse(readFileSync(filePath, { encoding: 'utf8' }));
};

// Load the main package.json to determine the version to set
const mainPackageJsonPath = join(process.cwd(), 'package.json');
const mainPackageJson = loadJsonFile(mainPackageJsonPath);
const versionArg = process.argv[2];
const dryRun = process.argv.includes('--dry-run');

let newVersion = mainPackageJson.version;

// Handle version bump
if (['patch', 'minor', 'major'].includes(versionArg)) {
  newVersion = semver.inc(mainPackageJson.version, versionArg);
} else if (semver.valid(versionArg)) {
  newVersion = versionArg;
} else if (versionArg) {
  console.error(`Invalid version argument: ${versionArg}`);
  process.exit(1);
}

const updatedFiles = [];

// Update the version in the main package.json if a new version is set
if (newVersion !== mainPackageJson.version) {
  mainPackageJson.version = newVersion;
  if (!dryRun) {
    writeFileSync(mainPackageJsonPath, JSON.stringify(mainPackageJson, null, 2) + '\n');
  }
  console.log(`Updated main package version to ${newVersion}`);
  updatedFiles.push(mainPackageJsonPath);
}

// Function to update dependency versions in package.json
function updateDependencyVersions(packageJson, newVersion) {
  ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
    if (packageJson[depType]) {
      Object.keys(packageJson[depType]).forEach(dep => {
        if (dep.startsWith('@semantic-ui/')) {  // Simple scope check
          packageJson[depType][dep] = `^${newVersion}`;
        }
      });
    }
  });
}

// Async function to publish a package
async function publishPackage(dir) {
  const packageJsonPath = join(dir, 'package.json');
  if (existsSync(packageJsonPath)) {
    const packageJson = loadJsonFile(packageJsonPath);
    packageJson.version = newVersion;  // Update the package version
    updateDependencyVersions(packageJson, newVersion);  // Update dependency versions
    if (!dryRun) {
      writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    }
    console.log(`Updated package version and dependencies in ${dir} to ${newVersion}`);
    updatedFiles.push(packageJsonPath);

    if (!dryRun) {
      try {
        console.log(`Publishing package in ${dir}...`);
        await execAsync('npm publish', { cwd: dir });
        console.log(`Successfully published package from ${dir}.`);
      } catch (error) {
        console.error(`Failed to publish package from ${dir}: ${error.message}`);
      }
    }
  }
}

// Read workspaces to publish from main package
const workspaceGlobs = mainPackageJson.workspaces;

(async () => {
  const publishPromises = [];
  workspaceGlobs.forEach(workspaceGlob => {
    const workspaceDirs = glob.sync(workspaceGlob, { realpath: true });
    workspaceDirs.forEach(dir => {
      publishPromises.push(publishPackage(dir));
    });
  });

  await Promise.all(publishPromises);

  if (!dryRun && updatedFiles.length > 0) {
    try {
      await execAsync('git add ' + updatedFiles.join(' '));
      await execAsync(`git commit -m "chore: bump versions to ${newVersion}"`);
      await execAsync('git push');
      await execAsync(`git tag -a v${newVersion} -m "Release version ${newVersion}"`);
      await execAsync('git push --tags');
      console.log('Committed and pushed version updates and created a new tag.');
    } catch (error) {
      console.error(`Failed to commit and push changes: ${error.message}`);
    }
  }

  console.log('All packages have been processed.');
})();
