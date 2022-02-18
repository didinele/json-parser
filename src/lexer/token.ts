export const enum TokenType {
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

export class Token {
	public constructor(public readonly type: TokenType, public readonly lexeme: string, public readonly line: number) {}
}
