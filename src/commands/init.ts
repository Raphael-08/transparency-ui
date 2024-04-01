import ora from "ora";
import { Command } from "commander";
import { execa } from "execa";
import { detect } from "@antfu/ni";
import path from "path";
import fs from "fs";

export async function getPackageManager(
  targetDir: string
): Promise<"yarn" | "pnpm" | "bun" | "npm"> {
  const packageManager = await detect({ programmatic: true, cwd: targetDir });

  if (packageManager === "yarn@berry") return "yarn";
  if (packageManager === "pnpm@6") return "pnpm";
  if (packageManager === "bun") return "bun";
  console.log(`detected ${packageManager ?? "npm"} package manager`);
  return packageManager ?? "npm";
}

export const init = new Command()
  .name("init")
  .description("install dependencies")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(async ({ cwd }: { cwd: string }) => {
    try {
      await runInit(cwd);
    } catch (error) {
      console.error("Initialization failed:", error);
      process.exit(1);
    }
  });

async function loadScaffoldDependencies(): Promise<string[]> {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  return Object.keys(packageJson.dependencies);
}

export async function runInit(cwd: string) {
  const dependenciesSpinner = ora(`Installing dependencies...`)?.start();
  const packageManager = await getPackageManager(cwd);

  const scaffoldDependencies = await loadScaffoldDependencies();

  const deps = [...scaffoldDependencies];

  await execa(
    packageManager,
    [packageManager === "npm" ? "install" : "add", ...deps],
    {
      cwd,
    }
  );
  dependenciesSpinner?.succeed();
}
