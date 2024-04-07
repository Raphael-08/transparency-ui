#! /usr/bin/env node
import { Command } from 'commander';
import { packageJSON } from './utils/packageJson.js';
import { init } from "./commands/init.js"
import { helloCommand } from "./commands/hello.js"

(async () => {

	const program = new Command();

	program
		.name('>')
		.description('⚡️ Your ultimate CLI app.')
		.version(
			packageJSON.version,
			'-v, --version',
			'display the version number',
		);
		
	program.addCommand(init).addCommand(helloCommand)
	program.parse()
})();
