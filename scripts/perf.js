/* eslint-disable */
import { readdirSync, readFileSync, mkdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { BenchmarkLexer, BenchmarkParser, formatTime } from '../';
import { DATA_SAMPLES_PATH } from './util';
import { performance } from 'node:perf_hooks';

let files;
try {
	files = readdirSync(DATA_SAMPLES_PATH);
} catch {
	files = [];
	mkdirSync(DATA_SAMPLES_PATH);
	console.log(
		'No data samples available. Generate some with pnpm run generate-data-sample <name> [maxPropCount] [maxDepth]',
	);
}

for (const file of files) {
	const contents = readFileSync(join(DATA_SAMPLES_PATH, file), 'utf8');
	console.log(`--- Running ${basename(file)} data sample ---`);
	const lexed = new BenchmarkLexer(contents).lex();
	new BenchmarkParser(lexed).parse();

	const nativeStart = performance.now();
	JSON.parse(contents);
	const nativeEnd = performance.now();

	console.log(`JSON.parse took: ${formatTime(nativeEnd - nativeStart, 3)}`);
}
