import { createCodeFrame } from './index';
import { dedent } from './dedent';
import { stripColors } from 'kolorist';
import * as t from 'assert';

describe('code frame', () => {
	it('should print code frame', () => {
		console.log(dedent`
		fooo bar bob
		ad alisd saljd lsa,
		asd asd
		asd
		asdsadasdasjd laisd 

		asdj asdklaj klds

		adsj klajd lk
	`);
		console.log(
			createCodeFrame(
				dedent`
					fooo bar bob
					ad alisd saljd lsa,
					asd asd
					asd
					asdsadasdasjd laisd 
			
					asdj asdklaj klds
			
					adsj klajd lk
				`,
				{
					startLine: 4,
					startColumn: 5,
					linesBefore: 2,
					linesAfter: 2
				}
			)
		);
	});

	it('should support linesBefore', () => {
		const str = dedent`
			foo
			bar
			bob
		`;

		const actual = createCodeFrame(str, {
			startLine: 3,
			startColumn: 0,
			linesBefore: 1
		});

		const expected = dedent`
			  2 | bar
			> 3 | bob
		`;

		t.equal(stripColors(actual), expected);
	});

	it('should limit linesBefore', () => {
		// TODO
	});

	it('should support linesAfter', () => {
		// TODO
	});

	it('should limit linesAfter', () => {
		// TODO
	});
});
