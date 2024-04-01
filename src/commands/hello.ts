// import figlet from 'figlet';

// import path from 'path';

import { Command } from "commander";
import fs from "fs";
import path from "path";

export const helloCommand = new Command()
  .name("hello")
  .description("Prints a greeting message")
  .action(() => {
    renderTitle();
  });
async function loadScaffoldDependencies(): Promise<string[]> {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  return Object.keys(packageJson.dependencies);
}

export const renderTitle = () => {
  // const text = figlet.textSync('HEllO !', {
  // 	font: 'Small',
  // });
  console.log(loadScaffoldDependencies());
};
