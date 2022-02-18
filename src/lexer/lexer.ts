import { Token, TokenType } from './token';

export class Lexer {
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

	/**
	 * Input length of this Lexer instance
	 */
	public get length(): number {
		return this.input.length;
	}

	/**
	 * Whether the current index is at the end of the input string
	 */
	private get isAtEnd(): boolean {
		return this.index + 1 > this.length;
	}

	/**
	 * Creates a new Token instance with the current state
	 */
	private makeToken(type: TokenType): Token {
		const lexeme = type === TokenType.EOF ? 'EOF' : this.input.slice(this.currentLexemeStart, this.index);
		return new Token(type, lexeme, this.line);
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
	 * Returns the previous token in the input
	 */
	private peekBack() {
		return this.input[this.index - 1];
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
				while (this.peek() !== '"' || this.peekBack() === '\\') {
					if (this.isAtEnd) {
						throw new Error('Unterminated string');
					}

					this.advance();
				}

				this.advance();

				return this.makeToken(TokenType.String);
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
			case '\t':
				break;

			case '\n': {
				this.line++;
				break;
			}

			default: {
				if (this.isDigit(character)) {
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

				throw new Error(`Unexpected character ${character}`);
			}
		}
	}

	/**
	 * Lexes all tokens in the input
	 */
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
}
