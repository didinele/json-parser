import { benchmark, benchmarkable } from '../util/benchmark';
import type { ILexer } from './ILexer';
import { Lexer } from './SimpleLexerImpl';

@benchmarkable({ root: 'lex' })
export class BenchmarkLexer extends Lexer implements ILexer {
	@benchmark()
	public override lex() {
		return super.lex();
	}
}
