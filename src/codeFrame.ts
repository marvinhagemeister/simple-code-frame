export interface Options {
	startLine?: number;
	startColumn?: number;
	endLine?: number;
	endColumn?: number;
	linesBefore?: number;
	linesAfter?: number;
	onFrameUi?: (str: string) => string;
}

export function createCodeFrame(text: string, options: Options) {
	const {
		linesBefore = Number.MAX_SAFE_INTEGER,
		linesAfter = Number.MAX_SAFE_INTEGER,
		onFrameUi,
		startColumn
	} = options;
	const lines = text.split('\n');

	// The original range that's marked by the user
	const markedStart = Math.max(0, (options.startLine || 0) - 1);
	const markedEnd = Math.min(
		lines.length,
		options.endLine ? options.endLine - 1 : markedStart
	);

	// The actual preview range
	const startLine = Math.max(0, markedStart - linesBefore);
	const endLine = Math.min(lines.length, markedEnd + linesAfter + 1);

	const digits = ('' + endLine).length;

	const slice = lines.slice(startLine, endLine).map((line, i) => {
		const num = startLine + i;
		const currentDigits = ('' + num).length;
		const prefix = num >= markedStart && num <= markedEnd ? '> ' : '  ';

		const lineNumber = ' '.repeat(digits - currentDigits) + (startLine + i + 1);
		let ui = prefix + lineNumber + ' | ';
		return (onFrameUi ? onFrameUi(ui) : ui) + line;
	});

	// Insert cursor lines if column ranges were specified
	if (startColumn !== undefined) {
		const depth = startColumn - 1;
		const indent = depth > 0 ? ' '.repeat(depth) : '';
		let message = `   ${' '.repeat(digits)}| ${indent}^`;
		message = onFrameUi ? onFrameUi(message) : message;
		slice.splice(Math.max(0, markedStart + 1 - startLine), 0, message);
	}

	return slice.join('\n');
}
