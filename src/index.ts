import * as k from 'kolorist';

export interface Options {
	startLine: number;
	startColumn: number;
	endLine?: number;
	endColumn?: number;
	linesBefore?: number;
	linesAfter?: number;
}

export function createCodeFrame(text: string, options: Options) {
	const { linesBefore = 0, linesAfter = 0 } = options;
	const lines = text.split('\n');

	const startLine = options.linesBefore
		? Math.max(0, options.startLine - linesBefore)
		: 0;
	const endLine = options.linesAfter
		? Math.min(
				lines.length,
				(options.endLine || options.startLine) + linesAfter
		  )
		: lines.length;

	console.log(endLine, options.startLine);
	const activeLines = lines.slice(
		options.startLine,
		options.endLine || options.startLine + 1
	);

	const digits = ('' + endLine).length;
	let slice = lines.slice(startLine, endLine + 1).map((line, i) => {
		const currentDigits = ('' + (startLine + i)).length;
		const prefix = startLine + i === options.startLine ? k.red('> ') : '  ';
		const lineNumber = ' '.repeat(digits - currentDigits) + (startLine + i);
		return prefix + k.dim(lineNumber + ' | ') + line;
	});

	if (options.startColumn) {
		const match = activeLines[0].match(/^(\s+)/);
		let indentation = match
			? match[0]
			: ' '.repeat(options.startColumn - 1 || 1);

		const message = '     ' + ' '.repeat(+digits) + indentation + k.red('^');
		slice.splice(Math.max(0, options.startLine - startLine + 1), 0, message);
	}

	return slice.join('\n');
}
