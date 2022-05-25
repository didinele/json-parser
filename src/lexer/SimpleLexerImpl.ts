import type { ILexer } from './ILexer';
import { Token, TokenType } from './Token';

export class Lexer implements ILexer {
	/**
	 * Current index in the input string
	 */
	private index = 0;
	/**
	 * Index of where the current lexeme starts
	 */
	private currentLexemeStart = 0;
	/**
	 * Current line number
	 */
	private line = 1;

	public constructor(private readonly input: string) {}

	public get length(): number {
		return this.input.length;
	}

	public lex(): Token[] {
		const tokens: Token[] = [];

		while (!this.isAtEnd) {
			const token = this.lexToken();
			if (token) {
				tokens.push(token);
			}
		}

		if (tokens.at(-1)?.type !== TokenType.EOF) {
			tokens.push(this.makeToken(TokenType.EOF));
		}

		return tokens;
	}

	/**
	 * Whether the current index is at the end of the input string
	 */
	private get isAtEnd(): boolean {
		return this.index + 1 > this.length;
	}

	/**
	 * Represents the current lexeme
	 */
	private get currentLexeme(): string {
		return this.input.slice(this.currentLexemeStart, this.index);
	}

	/**
	 * Creates a new Token with the current state
	 */
	private makeToken(type: TokenType): Token {
		const lexeme = type === TokenType.EOF ? 'EOF' : this.currentLexeme;
		return {
			type,
			lexeme,
			line: this.line,
		};
	}

	/**
	 * Consumes the next token in the input - will throw if there's none left
	 */
	private advance(): string {
		/* istanbul ignore next */
		if (this.isAtEnd) {
			throw new Error('Tried to Lexer#advance but is at end of input');
		}

		return this.input[this.index++]!;
	}

	/**
	 * Returns the next token in the input without consuming it
	 */
	private peek(): string | undefined {
		return this.input[this.index];
	}

	/**
	 * Returns a previous token in the input
	 */
	private peekBack(by = 1) {
		return this.input[this.index - by];
	}

	/**
	 * Expects the next tokens in the input to be `characters`, consuming them - will throw if they do not match
	 */
	private consume(type: TokenType, characters: string): Token {
		for (const character of characters) {
			if (this.peek() === character) {
				this.advance();
			} else {
				throw new Error(
					`Expected to find ${character} but found ${this.peek() ?? 'NIL'} while lexing for ${characters}`,
				);
			}
		}

		return this.makeToken(type);
	}

	/**
	 * Checks if the given character is a digit - returns true if there is no character
	 */
	private isDigit(character?: string) {
		if (!character) {
			return true;
		}

		return !isNaN(parseInt(character, 10));
	}

	/**
	 * Lex a string literal
	 */
	private lexString(): Token {
		while (this.peek() !== '"' || (this.peekBack() === '\\' && this.peekBack(2) !== '\\')) {
			if (this.isAtEnd) {
				throw new Error('Unterminated string');
			}

			this.advance();
		}

		this.advance();

		return this.makeToken(TokenType.String);
	}

	/**
	 * Lex a number literal
	 */
	private lexNumber(): Token {
		while (this.isDigit(this.peek()) || this.peek() === '.') {
			if (this.isAtEnd) {
				if (this.peekBack() === '.') {
					throw new Error('Unterminated decimal number');
				}

				break;
			}

			this.advance();
		}

		return this.makeToken(TokenType.Number);
	}

	/**
	 * Lexes a single token
	 */
	private lexToken(): Token | undefined {
		this.currentLexemeStart = this.index;

		const character = this.advance();

		switch (character) {
			case ',': {
				return this.makeToken(TokenType.Comma);
			}

			case ':': {
				return this.makeToken(TokenType.Colon);
			}

			case '"': {
				return this.lexString();
			}

			case 't': {
				return this.consume(TokenType.True, 'rue');
			}

			case 'f': {
				return this.consume(TokenType.False, 'alse');
			}

			case 'n': {
				return this.consume(TokenType.Null, 'ull');
			}

			case '{': {
				return this.makeToken(TokenType.LeftBrace);
			}

			case '}': {
				return this.makeToken(TokenType.RightBrace);
			}

			case '[': {
				return this.makeToken(TokenType.LeftSquareBracket);
			}

			case ']': {
				return this.makeToken(TokenType.RightSquareBracket);
			}

			case ' ':
			case '\r':
			case '\t': {
				break;
			}

			case '\n': {
				this.line++;
				break;
			}

			default: {
				if (this.isDigit(character)) {
					return this.lexNumber();
				}

				throw new Error(`Unexpected character ${character}`);
			}
		}
	}
}
