import { exec } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import inquirer from 'inquirer';
import { join } from 'path';
import semver from 'semver';
import { promisify } from 'util';

// Helper function to load JSON
const loadJsonFile = (filePath) => {
  return JSON.parse(readFileSync(filePath, { encoding: 'utf8' }));
};

const execAsync = promisify(exec);

// Load the main package.json to determine the version to set
const mainPackageJsonPath = join(process.cwd(), 'package.json');
const mainPackageJson = loadJsonFile(mainPackageJsonPath);
const versionArg = process.argv[2];
const dryRun = process.argv.includes('--dry-run');
const ciOverride = process.argv.includes('--ci');

// Get the current version from npm
const getCurrentVersionFromNpm = async (packageName) => {
  try {
    const { stdout } = await execAsync(`npm show ${packageName} version`);
    return stdout.trim();
  }
  catch (error) {
    console.error(`Failed to get current version from npm: ${error.message}`);
    process.exit(1);
  }
};


let npmVersion = await getCurrentVersionFromNpm(mainPackageJson.name);
let newVersion = mainPackageJson.version;

const updatedFiles = [];

// determine if this dependency should have its version number updated
const isUpdateableDep = function(dep) {
  const specialDeps = ['@semantic-ui/astro-lit'];
  if(specialDeps.indexOf(dep) > -1) {
    return false;
  }
  return dep.startsWith('@semantic-ui/');
};

// Function to update dependency versions in package.json
function updateDependencyVersions(packageJson, newVersion) {
  console.log(`Checking deps for ${packageJson.name}`);
  ['dependencies', 'peerDependencies'].forEach(depType => {
    if (packageJson[depType]) {
      Object.keys(packageJson[depType]).forEach(dep => {
        const depVersion = `^${newVersion}`;
        if (isUpdateableDep(dep) && packageJson[depType][dep] !== depVersion) { // Simple scope check
          packageJson[depType][dep] = depVersion;
          console.log(`Updated ${dep} in ${packageJson.name} to ${depVersion}`);
        }
      });
    }
  });
}

// Handle version bump
const handleVersionBump = async () => {
  if (['patch', 'minor', 'major'].includes(versionArg)) {
    if (!ciOverride && (versionArg === 'minor' || versionArg === 'major')) {
      const confirmation = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `You are about to perform a ${versionArg} version bump. Do you want to proceed?`,
          default: false,
          when: (answers) => answers.confirm,
        },
      ]);

      if (!confirmation.confirm) {
        console.log('Version bump canceled.');
        process.exit(1);
      }
    }
    newVersion = semver.inc(mainPackageJson.version, versionArg);
    if (npmVersion == newVersion || semver.gt(npmVersion, newVersion)) {
      console.error(`NPM version of ${npmVersion} is greater or equal to new version ${newVersion}`);
      process.exit(1);
    }
  }
  else if (semver.valid(versionArg)) {
    newVersion = versionArg;
  }
  else if (versionArg) {
    console.error(`Invalid version argument: ${versionArg}`);
    process.exit(1);
  }
};

// Async function to publish a package
async function updatePackageVersion(dir) {
  const packageJsonPath = join(dir, 'package.json');
  // second failsafe check for internal packages
  if(dir.includes('internal-packages')) {
    return;
  }
  if (existsSync(packageJsonPath)) {
    const packageJson = loadJsonFile(packageJsonPath);
    if(packageJson.version == newVersion) {
      console.log(`${packageJson.name} not updated, already ${newVersion}`);
      return;
    }
    packageJson.version = newVersion; // Update the package version
    updateDependencyVersions(packageJson, newVersion); // Update dependency versions
    if (!dryRun) {
      writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    }
    console.log(`Updated ${packageJson.name} and deps in ${dir} to ${newVersion}`);
    updatedFiles.push(packageJsonPath);
  }
}

// Update the version in the main package.json if a new version is set
mainPackageJson.version = newVersion;
updateDependencyVersions(mainPackageJson, newVersion); // Update dependency versions
if (!dryRun) {
  writeFileSync(mainPackageJsonPath, JSON.stringify(mainPackageJson, null, 2) + '\n');
}
console.log(`Updated main package version to ${newVersion}`);
updatedFiles.push(mainPackageJsonPath);



// Read workspaces to publish from main package
// ignoring internal packages
const workspaceGlobs = mainPackageJson.workspaces.filter(val => !val.includes('internal-packages'));
(async () => {
  await handleVersionBump();

  console.log(`Updating all packages to ${newVersion}`);
  const updatePromises = [];
  workspaceGlobs.forEach(workspaceGlob => {
    const workspaceDirs = globSync(workspaceGlob, { realpath: true });
    workspaceDirs.forEach(dir => {
      updatePromises.push(updatePackageVersion(dir));
    });
  });

  await Promise.all(updatePromises);

})();
