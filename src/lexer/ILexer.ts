import type { Token } from './Token';

export interface ILexer {
	/**
	 * Input length
	 */
	readonly length: number;
	/**
	 * Lexes all tokens in the input into parseable tokens
	 */
	lex: () => Token[];
}

export type LexerConstructor = new (input: string) => ILexer;
