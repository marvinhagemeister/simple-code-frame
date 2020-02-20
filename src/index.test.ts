import { createCodeFrame } from './index';
import { dedent } from './dedent';
import { stripColors, red, dim } from 'kolorist';
import * as t from 'assert';

describe('code frame', () => {
	describe('colors', () => {
		it('should use colors by default', () => {
			const str = dedent`
			foo
			bar
			bob
		`;

			const actual = createCodeFrame(str, {
				startLine: 3
			});

			const expected = `${red('> ')}${dim('3 | ')}bob`;
			t.equal(JSON.stringify(actual), JSON.stringify(expected));
		});

		it('should support no-color mode', () => {
			const str = dedent`
			foo
			bar
			bob
		`;

			const actual = createCodeFrame(str, {
				startLine: 3,
				colors: false
			});

			const expected = dedent`
			> 3 | bob
		`;

			t.equal(actual, expected);
		});
	});

	describe('linesBefore', () => {
		it('should support linesBefore', () => {
			const str = dedent`
			foo
			bar
			bob
		`;

			const actual = createCodeFrame(str, {
				startLine: 3,
				linesBefore: 1
			});

			const expected = dedent`
			  2 | bar
			> 3 | bob
		`;

			t.equal(stripColors(actual), expected);
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

			t.equal(stripColors(actual), expected);
		});
	});

	describe('linesAfter', () => {
		it('should support linesAfter', () => {
			const str = dedent`
			foo
			bar
			bob
		`;

			const actual = createCodeFrame(str, {
				startLine: 2,
				linesAfter: 1
			});

			const expected = dedent`
			> 2 | bar
			  3 | bob
		`;

			t.equal(stripColors(actual), expected);
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
			> 2 | bar
			  3 | bob
			  4 | boof
		`;

			t.equal(stripColors(actual), expected);
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
			> 2 | bar
			    | ^
		`;

			t.equal(stripColors(actual), expected);
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
			> 2 | bar
			    | ^
			  3 | bob
			  4 | boof
		`;

			t.equal(stripColors(actual), expected);
		});
	});
});
