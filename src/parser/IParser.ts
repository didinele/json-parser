import type { Token } from '../lexer/lexer';

export interface IParser {
	/**
	 * Amount of tokens in the input
	 */
	readonly length: number;
	/**
	 * Parses all the tokens in the input into actual data
	 */
	parse: () => unknown;
}

export type ParserConstructor = new (input: Token[]) => IParser;
