const WHITESPACE = /^(\s+)/;
const ONLY_WHITESPACE = /^\s+$/;

export function dedent(
	strings: TemplateStringsArray,
	...expressions: string[]
) {
	let out = '';
	for (let i = 0; i < expressions.length; i++) {
		out += strings[i] + expressions[i];
	}
	out += strings[strings.length - 1];

	let lines = out.split('\n');
	if (lines.length > 0 && (lines[0].match(ONLY_WHITESPACE) || !lines[0])) {
		lines = lines.slice(1);
	}

	let match = lines[lines.length - 1].match(WHITESPACE);

	if (
		lines.length > 1 &&
		(lines[lines.length - 1].match(ONLY_WHITESPACE) || !lines[lines.length - 1])
	) {
		lines = lines.slice(0, -1);
	}

	if (lines.length > 0 && match) {
		const min = Math.min(
			...lines.map(x => {
				const match = x.match(WHITESPACE);
				return (match ? match[0] : '').length;
			})
		);
		lines = lines.map(x => x.slice(min));
	}

	return lines.join('\n');
}
