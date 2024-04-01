// import figlet from 'figlet';

// import path from 'path'; 

import { Command } from 'commander';

export const helloCommand = new Command()
  .name('hello')
  .description('Prints a greeting message')
  .action(() => {
    renderTitle();
  });
 async function loadScaffoldDependencies(): Promise<string[]> {
    const packageJsonPath = '/coding/scaffold_2024/package.json'; 
    const packageJson = await import(packageJsonPath);
    return Object.keys(packageJson.dependencies);
  }

export const renderTitle = () => {
	// const text = figlet.textSync('HEllO !', {
	// 	font: 'Small',
	// });
	console.log(loadScaffoldDependencies());
};
