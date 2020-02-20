import * as t from 'assert';
import { dedent } from './dedent';

describe('dedent', () => {
	it('should keep single line string as is', () => {
		t.equal(dedent`foo`, 'foo');
	});

	it('should unindent multiline string', () => {
		const actual = dedent`
      foo
    `;
		t.equal(actual, 'foo');

		const actual2 = dedent`
      foo
        bar
      foo
    `;
		t.equal(actual2, 'foo\n  bar\nfoo');
	});

	it('should unindent multiline string from end', () => {
		const actual = dedent`
        foo
        bar
      foo
    `;
		t.equal(actual, '  foo\n  bar\nfoo');
	});
});
