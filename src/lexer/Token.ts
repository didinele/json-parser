export enum TokenType {
	// Single character tokens
	Comma,
	Colon,
	LeftBrace,
	RightBrace,
	LeftSquareBracket,
	RightSquareBracket,

	// Simple values
	String,
	Number,
	True,
	False,
	Null,

	// Misc
	EOF,
}

export interface Token {
	readonly type: TokenType;
	readonly lexeme: string;
	readonly line: number;
}

export function getTokenValue(token: Token): string | number | boolean | null {
	switch (token.type) {
		case TokenType.String: {
			return token.lexeme.slice(1, token.lexeme.length - 1);
		}

		case TokenType.Number: {
			return Number(token.lexeme);
		}

		case TokenType.True: {
			return true;
		}

		case TokenType.False: {
			return false;
		}

		case TokenType.Null: {
			return null;
		}

		default: {
			throw new Error(`Cannot get value from token type ${token.type}`);
		}
	}
}
