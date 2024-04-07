import readline from 'readline';
import path from "path";
import fs from "fs";
import { Command } from "commander";
import * as semver from 'semver';
import { renderTitle } from '../utils/renderTitle.js';



const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export const init = new Command()
  .name("init")
  .description("Prints a greeting message")
  .action(() => {
    renderTitle("Initializing:");
    checkRequiredPackages()
      .then((result: PackageCheckResult) => {
        if (result.missingPackages.length > 0 || result.outdatedPackages.length > 0) {
          console.log("This project does not meet the requirements:");
          console.log("Prerequisites:")
          if (result.missingPackages.length > 0) {
            console.log("->" + result.missingPackages.join("\n"));
          }
          if (result.outdatedPackages.length > 0) {
            result.outdatedPackages.forEach(pkg => {
              console.log("->" + `${pkg.packageName}: installed ${pkg.installedVersion}, required ${pkg.requiredVersion}`);
            });
          }
          process.exit(1);
        }
        else {
          console.log("This project meets the requirements!")
          rl.question("Do you want to change the components file? (yes/no): ", async (answer) => {
            if (answer.toLowerCase() === 'yes') {
              const componentsJsonPath = path.join(process.cwd(), "components.json");
              const componentsJson = JSON.parse(fs.readFileSync(componentsJsonPath, "utf-8"));
              componentsJson.aliases.transprency = "@/components/ui/transparency";

              rl.question("Write configuration to components.json. Proceed? (yes/no): ", async (confirmation) => {
                if (confirmation.toLowerCase() === 'yes') {
                  fs.writeFileSync(componentsJsonPath, JSON.stringify(componentsJson, null, 2));
                  console.log("Configuration written to components.json.");
                } else {
                  console.log("Operation aborted. Configuration not saved.");
                }
                rl.close();
              });
            } else {
              console.log("Components file will not be changed.");
              rl.close();
            }
          });
        }
      })
      .catch(error => {
        console.error('Error checking required packages:', error);
      });
  });

const normalizeVersion = (version: string) => version.replace(/^\^/, '');

interface PackageCheckResult {
  missingPackages: string[];
  outdatedPackages: { packageName: string; installedVersion: string; requiredVersion: string }[];
}

const requiredPackages = {
  "next": "^13.6.0"
};



async function loadDependencies(): Promise<string[]> {
  console.log("cheking for required packages...")
  const packageJsonPath = path.join(process.cwd(), "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  for (const dependency in packageJson.dependencies) {
    packageJson.dependencies[dependency] = normalizeVersion(packageJson.dependencies[dependency]);
  }
  return packageJson.dependencies;
}

async function checkRequiredPackages(): Promise<PackageCheckResult> {
  const dependencies = await loadDependencies();

  const missingPackages: string[] = [];

  const outdatedPackages: { packageName: string; installedVersion: string; requiredVersion: string }[] = [];


  for (const packageName in requiredPackages) {
    if (!dependencies || !dependencies[packageName]) {
      missingPackages.push(packageName);
    } else {
      const requiredVersion: string = normalizeVersion(requiredPackages[packageName]);
      const installedVersion: string = dependencies[packageName];
      if (!semver.satisfies(installedVersion, requiredVersion) && semver.lt(installedVersion, requiredVersion)) {
        outdatedPackages.push({ packageName, installedVersion, requiredVersion });
      }
    }
  }

  return { missingPackages, outdatedPackages };
}