import { benchmark, benchmarkable } from '../util/benchmark';
import type { IParser } from './IParser';
import { Parser } from './SimpleParserImpl';

@benchmarkable({ root: 'parse' })
export class BenchmarkParser extends Parser implements IParser {
	@benchmark()
	public override parse() {
		return super.parse();
	}
}
