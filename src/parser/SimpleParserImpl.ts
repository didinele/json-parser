import { getTokenValue, Token, TokenType } from '../lexer/lexer';
import type { IParser } from './IParser';

export class Parser implements IParser {
	/**
	 * Current index in the input array
	 */
	private index = 0;

	public constructor(private readonly input: Token[]) {}

	public get length(): number {
		return this.input.length;
	}

	public parse(): unknown {
		const value = this.parseObject();
		if (!this.isAtEnd) {
			throw new Error(
				'This error message is yet to be implemented - but it means that the input had more than one top-level value in it',
			);
		}

		return value;
	}

	private parseObject(): unknown {
		if (!this.match(TokenType.LeftBrace)) {
			return this.parseArray();
		}

		const obj: Record<string, unknown> = {};
		let expectingComma = false;

		while (!this.isAtEnd && this.peek() !== TokenType.RightBrace) {
			if (expectingComma && !this.match(TokenType.Comma)) {
				throw new Error('Expected comma after key');
			}

			const key = this.parsePrimitive();
			if (typeof key !== 'string') {
				throw new Error('Expected a string as the key');
			}

			if (!this.match(TokenType.Colon)) {
				throw new Error('Expected a colon after the key');
			}

			obj[key] = this.parseObject();
			expectingComma = true;
		}

		this.advance();
		return obj;
	}

	private parseArray(): unknown {
		if (!this.match(TokenType.LeftSquareBracket)) {
			return this.parsePrimitive();
		}

		const elements: unknown[] = [];
		let expectingComma = false;

		while (!this.isAtEnd && this.peek() !== TokenType.RightSquareBracket) {
			if (expectingComma && !this.match(TokenType.Comma)) {
				throw new Error('Expected comma after array element');
			}

			expectingComma = true;
			elements.push(this.parseObject());
		}

		this.advance();
		return elements;
	}

	private parsePrimitive(): string | number | boolean | null {
		if (this.match(TokenType.String, TokenType.Number, TokenType.True, TokenType.False, TokenType.Null)) {
			return getTokenValue(this.previous());
		}

		throw new Error(
			'This error message is yet to be implemented - but it means that the input had an invalid value in it',
		);
	}

	/**
	 * Whether the current index is at the end of the input
	 */
	private get isAtEnd(): boolean {
		return this.index + 1 > this.length || this.peek() === TokenType.EOF;
	}

	/**
	 * Consumes the next token in the input - will throw if there's none left
	 */
	private advance(): Token {
		/* istanbul ignore next */
		if (this.isAtEnd) {
			throw new Error('Tried to Lexer#advance but is at end of input');
		}

		return this.input[this.index++]!;
	}

	private previous(): Token {
		return this.input[this.index - 1]!;
	}

	/**
	 * Returns the next token type in the input without consuming it
	 */
	private peek(): TokenType | undefined {
		return this.input[this.index]?.type;
	}

	private check(type: TokenType): boolean {
		if (this.isAtEnd) {
			return false;
		}

		return this.peek() === type;
	}

	private match(...types: TokenType[]): boolean {
		for (const type of types) {
			if (this.check(type)) {
				this.advance();
				return true;
			}
		}

		return false;
	}
}
