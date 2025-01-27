import { exec } from 'child_process';
import { promisify } from 'util';
import { globSync } from 'glob';
import { join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import semver from 'semver';
import inquirer from 'inquirer';

const execAsync = promisify(exec);

// Helper function to load JSON
const loadJsonFile = (filePath) => {
  return JSON.parse(readFileSync(filePath, { encoding: 'utf8' }));
};

// Get the current version from npm
const getCurrentVersionFromNpm = async (packageName) => {
  try {
    const { stdout } = await execAsync(`npm show ${packageName} version`);
    return stdout.trim();
  } catch (error) {
    console.error(`Failed to get current version from npm: ${error.message}`);
    process.exit(1);
  }
};


// Load the main package.json to determine the version to set
const mainPackageJsonPath = join(process.cwd(), 'package.json');
const mainPackageJson = loadJsonFile(mainPackageJsonPath);
const versionArg = process.argv[2];
const dryRun = process.argv.includes('--dry-run');
const ciOverride = process.argv.includes('--ci');

let npmVersion = await getCurrentVersionFromNpm(mainPackageJson.name);
let newVersion = mainPackageJson.version;


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
    if(npmVersion == newVersion || semver.gt(npmVersion, newVersion)) {
      console.error(`NPM version of ${npmVersion} is greater or equal to new version ${newVersion}`);
      process.exit(1);
    }
  } else if (semver.valid(versionArg)) {
    newVersion = versionArg;
  } else if (versionArg) {
    console.error(`Invalid version argument: ${versionArg}`);
    process.exit(1);
  }
};

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
  await handleVersionBump();

  const publishPromises = [];
  workspaceGlobs.forEach(workspaceGlob => {
    const workspaceDirs = globSync(workspaceGlob, { realpath: true });
    workspaceDirs.forEach(dir => {
      publishPromises.push(publishPackage(dir));
    });
  });

  await Promise.all(publishPromises);

  if (!dryRun && updatedFiles.length > 0) {
    try {
      // Stage changes
      console.log('Staging changes...');
      await execAsync('git add ' + updatedFiles.join(' '));

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
      } else {
        console.log('No changes to commit.');
      }
    } catch (error) {
      console.error(`Failed to commit and push changes: ${error.message}`);
    }
  }

  console.log('All packages have been processed.');
})();
