import { createCodeFrame } from './codeFrame';
import { dedent } from './dedent';
import { red, dim } from 'kolorist';
import * as t from 'assert';

describe('code frame', () => {
	describe('onFrameUi', () => {
		it('should support callback for modifying ui', () => {
			const str = dedent`
				foo
				bar
				bob
			`;

			const actual = createCodeFrame(str, {
				startLine: 2,
				startColumn: 2,
				onFrameUi: input => {
					return input
						.replace('>', red('>'))
						.replace('^', red('^'))
						.replace(/(\d*\s+\|)/, match => dim(match));
				}
			});

			const expected = dedent`
				  ${dim('1 |')} foo
				${red('>')} ${dim('2 |')} bar
				${dim('    |')}  ${red('^')}
				  ${dim('3 |')} bob
			`;
			t.equal(JSON.stringify(actual), JSON.stringify(expected));
		});
	});

	describe('linesBefore', () => {
		it('should support linesBefore', () => {
			const str = dedent`
				fooooo
				foo
				bar
				bob
			`;

			const actual = createCodeFrame(str, {
				startLine: 4,
				linesBefore: 1
			});

			const expected = dedent`
				  3 | bar
				> 4 | bob
			`;

			t.equal(actual, expected);
		});

		it('should limit linesBefore', () => {
			const str = dedent`
				foo
				bar
				bob
			`;

			const actual = createCodeFrame(str, {
				startLine: 3,
				linesBefore: 200
			});

			const expected = dedent`
				  1 | foo
				  2 | bar
				> 3 | bob
			`;

			t.equal(actual, expected);
		});
	});

	describe('linesAfter', () => {
		it('should support linesAfter', () => {
			const str = dedent`
				foo
				bar
				bob
				baaz
			`;

			const actual = createCodeFrame(str, {
				startLine: 2,
				linesAfter: 1
			});

			const expected = dedent`
			  1 | foo
			> 2 | bar
			  3 | bob
		`;

			t.equal(actual, expected);
		});

		it('should limit linesAfter', () => {
			const str = dedent`
				foo
				bar
				bob
				boof
			`;

			const actual = createCodeFrame(str, {
				startLine: 2,
				linesAfter: 99
			});

			const expected = dedent`
				  1 | foo
				> 2 | bar
				  3 | bob
				  4 | boof
			`;

			t.equal(actual, expected);
		});
	});

	describe('column markers', () => {
		it('should support column markers', () => {
			const str = dedent`
				foo
				bar
				bob
				boof
			`;

			const actual = createCodeFrame(str, {
				startLine: 2,
				startColumn: 0
			});

			const expected = dedent`
				  1 | foo
				> 2 | bar
				    | ^
				  3 | bob
				  4 | boof
			`;

			t.equal(actual, expected);
		});

		it('should support column markers #2', () => {
			const str = dedent`
				foo
				bar
				bob
				boof
			`;

			const actual = createCodeFrame(str, {
				startLine: 2,
				startColumn: 2
			});

			const expected = dedent`
				  1 | foo
				> 2 | bar
				    |  ^
				  3 | bob
				  4 | boof
			`;

			t.equal(actual, expected);
		});

		it('should support column markers with linesAfter', () => {
			const str = dedent`
				foo
				bar
				bob
				boof
			`;

			const actual = createCodeFrame(str, {
				startLine: 2,
				startColumn: 0,
				linesAfter: 3
			});

			const expected = dedent`
				  1 | foo
				> 2 | bar
				    | ^
				  3 | bob
				  4 | boof
			`;

			t.equal(actual, expected);
		});
	});
});
