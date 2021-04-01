import * as kl from 'kolorist';

/**
 * Convert tabs indentation to two spaces.
 */
function tabs2Spaces(str: string) {
	return str.replace(/^\t+/, tabs => '  '.repeat(tabs.length));
}

export interface Options {
	before?: number;
	after?: number;
	colors?: boolean;
}

/**
 * Generate an excerpt of the location in the source around the
 * specified position.
 */
export function createCodeFrame(
	text: string,
	lineNum: number,
	columnNum: number,

	{ before = 3, after = 3, colors = true }: Options = {}
) {
	const lines = text.split('\n');

	const start = Math.max(0, lineNum - before);
	const end = Math.min(lines.length, lineNum + after + 1);

	// Maximum space needed for line numbering in the current range.
	// Necessary when the amount of digits of the line numbering grows:
	//  999 | asdf
	// 1000 | asdjadfjsa
	const maxLineNum = String(end).length;
	const padding = ' '.repeat(maxLineNum);

	const sep = kl.dim('|');
	let out = '';

	for (let i = start; i < end; i++) {
		const line = lines[i];
		const currentLine = kl.dim((padding + (i + 1)).slice(-maxLineNum));

		// Normalize all indentation (=tabs) to use 2 spaces. We need to
		// apply the difference to the marker position to move it back in
		// place.
		const normalized = tabs2Spaces(lines[i]);

		// Line where the error occured
		if (i === lineNum) {
			out += kl.red('>') + ` ${currentLine} ${sep} ${normalized}\n`;

			// Move marker into correct place by taking the amount of
			// normalized tabs into account
			const count = Math.max(0, normalized.length - line.length + columnNum);

			out += `  ${padding} ${sep} ${' '.repeat(count)}${kl.bold(
				kl.red('^')
			)}\n`;
		} else {
			out += `  ${currentLine} ${sep} ${normalized}\n`;
		}
	}

	return colors ? out : kl.stripColors(out);
}
