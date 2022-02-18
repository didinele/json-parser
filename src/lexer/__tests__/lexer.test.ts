// note: unsure if I wanna handle this via files yet

// import { readFileSync } from 'node:fs';
// import { join } from 'node:path';

// const validJson = readFileSync(join(process.cwd(), 'test_resources', 'lexer', 'valid.json'), 'utf8');

import { Lexer } from '../lexer';
import { TokenType } from '../token';

describe('random single tokens', () => {
	test('comma', () => {
		const lexer = new Lexer(',');
		expect(lexer.lex()[0]?.type).toEqual(TokenType.Comma);
	});

	test('single left brace', () => {
		const lexer = new Lexer('{');
		expect(lexer.lex()[0]?.type).toEqual(TokenType.LeftBrace);
	});

	test('single right brace', () => {
		const lexer = new Lexer('}');
		expect(lexer.lex()[0]?.type).toEqual(TokenType.RightBrace);
	});

	test('single left square bracket', () => {
		const lexer = new Lexer('[');
		expect(lexer.lex()[0]?.type).toEqual(TokenType.LeftSquareBracket);
	});

	test('single right square bracket', () => {
		const lexer = new Lexer(']');
		expect(lexer.lex()[0]?.type).toEqual(TokenType.RightSquareBracket);
	});
});

describe('simple values', () => {
	describe('strings', () => {
		test('unterminated string', () => {
			const lexer = new Lexer('"abc');
			expect(() => lexer.lex()).toThrowError('Unterminated string');
		});

		test('valid string', () => {
			const lexer = new Lexer('"abc"');

			const [lexed] = lexer.lex();
			expect(lexed.type).toBe(TokenType.String);
			expect(lexed.lexeme).toBe('"abc"');
		});

		test('valid string with escapes', () => {
			const lexer = new Lexer('"ab\\"c"');

			const [lexed] = lexer.lex();
			expect(lexed.type).toBe(TokenType.String);
			expect(lexed.lexeme).toBe('"ab\\"c"');
		});
	});

	describe('numbers', () => {
		test('undetermined decimal number', () => {
			const lexer = new Lexer('1.');
			expect(() => lexer.lex()).toThrowError('Unterminated decimal number');
		});

		test('valid number', () => {
			const lexer = new Lexer('1');

			const [lexed] = lexer.lex();
			expect(lexed.type).toBe(TokenType.Number);
			expect(lexed.lexeme).toBe('1');
		});

		test('valid decimal number', () => {
			const lexer = new Lexer('1.23');

			const [lexed] = lexer.lex();
			expect(lexed.type).toBe(TokenType.Number);
			expect(lexed.lexeme).toBe('1.23');
		});
	});

	describe('other literals', () => {
		test('true', () => {
			const lexer = new Lexer('true');

			const [lexed] = lexer.lex();
			expect(lexed.type).toBe(TokenType.True);
			expect(lexed.lexeme).toBe('true');
		});

		test('false', () => {
			const lexer = new Lexer('false');

			const [lexed] = lexer.lex();
			expect(lexed.type).toBe(TokenType.False);
			expect(lexed.lexeme).toBe('false');
		});

		test('null', () => {
			const lexer = new Lexer('null');

			const [lexed] = lexer.lex();
			expect(lexed.type).toBe(TokenType.Null);
			expect(lexed.lexeme).toBe('null');
		});
	});
});

describe('various errors', () => {
	test('unexpected character', () => {
		const lexer = new Lexer('owo');
		expect(() => lexer.lex()).toThrowError('Unexpected character');
	});

	test('failed consume', () => {
		const lexer = new Lexer('tr');
		expect(() => lexer.lex()).toThrowError('Expected to find');
	});
});

test('complex structure', () => {
	const data = {
		a: 1.23,
		b: {
			c: [2, 3],
		},
	};

	const lexer = new Lexer(JSON.stringify(data, null, 2));
	const tokens = lexer.lex();

	expect(tokens.length).toBe(18);
	expect(tokens[0]?.type).toBe(TokenType.LeftBrace);
	expect(tokens[1]?.type).toBe(TokenType.String);
	expect(tokens[1]?.lexeme).toBe('"a"');
	expect(tokens[2]?.type).toBe(TokenType.Colon);
	expect(tokens[3]?.type).toBe(TokenType.Number);
	expect(tokens[3]?.lexeme).toBe('1.23');
	expect(tokens[4]?.type).toBe(TokenType.Comma);
	expect(tokens[5]?.type).toBe(TokenType.String);
	expect(tokens[6]?.type).toBe(TokenType.Colon);
	expect(tokens[7]?.type).toBe(TokenType.LeftBrace);
	expect(tokens[8]?.type).toBe(TokenType.String);
	expect(tokens[9]?.type).toBe(TokenType.Colon);
	expect(tokens[10]?.type).toBe(TokenType.LeftSquareBracket);
	expect(tokens[11]?.type).toBe(TokenType.Number);
	expect(tokens[12]?.type).toBe(TokenType.Comma);
	expect(tokens[13]?.type).toBe(TokenType.Number);
	expect(tokens[14]?.type).toBe(TokenType.RightSquareBracket);
	expect(tokens[15]?.type).toBe(TokenType.RightBrace);
	expect(tokens[16]?.type).toBe(TokenType.RightBrace);
	expect(tokens[17]?.type).toBe(TokenType.EOF);
});
