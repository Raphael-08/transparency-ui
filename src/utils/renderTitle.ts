import figlet from 'figlet';

export const renderTitle = () => {
	const text = figlet.textSync('Pkg Installer :', {
		font: 'Small',
	});
	console.log(`\n${text}\n`);
};
