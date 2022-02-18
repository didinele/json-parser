import { Token, TokenType } from './token';

export class Lexer {
	private index = 0;
	private currentLexemeStart = 0;
	private line = 1;

	public constructor(private readonly input: string) {}

	public get length(): number {
		return this.input.length;
	}

	private get isAtEnd(): boolean {
		return this.index + 1 > this.length;
	}

	private makeToken(type: TokenType): Token {
		const lexeme = type === TokenType.EOF ? 'EOF' : this.input.slice(this.currentLexemeStart, this.index);
		return new Token(type, lexeme, this.line);
	}

	private advance(): string {
		/* istanbul ignore next */
		if (this.isAtEnd) {
			throw new Error('Tried to Lexer#advance but is at end of input');
		}

		return this.input[this.index++]!;
	}

	private peek(): string | undefined {
		return this.input[this.index];
	}

	private peekBack() {
		return this.input[this.index - 1];
	}

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

	private isDigit(character?: string) {
		if (!character) {
			return true;
		}

		return !isNaN(parseInt(character, 10));
	}

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
