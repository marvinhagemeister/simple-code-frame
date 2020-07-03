import { createCodeFrame } from '../src';
import { promises as fs } from 'fs';
import * as path from 'path';
import { strict as t } from 'assert';

const runTest = async (name: string, fn: (input: string) => string) => {
	const dir = path.join(__dirname, 'fixtures', name);
	const input = await fs.readFile(path.join(dir, 'input.txt'), 'utf-8');
	const expected = await fs.readFile(path.join(dir, 'expected.txt'), 'utf-8');

	const actual = fn(input).slice(0, -1);
	t.equal(actual, expected);
};

it('normalize tab indentation', async () => {
	await runTest('tabs-1', input => createCodeFrame(input, 0, 4));
});

it('should indent column number', async () => {
	await runTest('column-indent', input => createCodeFrame(input, 9, 2));
});

describe('lines before', () => {
	it('support lines before', async () => {
		await runTest('lines-before', input =>
			createCodeFrame(input, 3, 0, {
				before: 1,
			})
		);
	});

	it('limit lines before', async () => {
		await runTest('lines-before-limit', input =>
			createCodeFrame(input, 2, 0, {
				before: 99,
			})
		);
	});
});

describe('lines after', () => {
	it('support lines after', async () => {
		await runTest('lines-after', input =>
			createCodeFrame(input, 1, 0, {
				after: 1,
			})
		);
	});

	it('limit lines after', async () => {
		await runTest('lines-after-limit', input =>
			createCodeFrame(input, 1, 0, {
				after: 99,
			})
		);
	});
});

describe('column markers', () => {
	it('support column markers', async () => {
		await runTest('column-1', input => createCodeFrame(input, 1, 1));
	});

	it('support column markers #2', async () => {
		await runTest('column-2', input =>
			createCodeFrame(input, 3, 2, {
				after: 3,
			})
		);
	});
});
