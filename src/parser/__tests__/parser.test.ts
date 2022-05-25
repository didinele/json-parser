import { Lexer } from '../../lexer/lexer';
import { Parser } from '../parser';

describe('simple top-level literals', () => {
	test('strings', () => {
		const lexer = new Lexer('"abc"');
		const tokens = lexer.lex();

		const parser = new Parser(tokens);
		const result = parser.parse();

		expect(result).toEqual('abc');
	});

	test('numbers', () => {
		const lexer = new Lexer('1.23');
		const tokens = lexer.lex();

		const parser = new Parser(tokens);
		const result = parser.parse();

		expect(result).toEqual(1.23);
	});

	test('boolean', () => {
		const lexer = new Lexer('true');
		const tokens = lexer.lex();

		const parser = new Parser(tokens);
		const result = parser.parse();

		expect(result).toEqual(true);
	});

	test('null', () => {
		const lexer = new Lexer('null');
		const tokens = lexer.lex();

		const parser = new Parser(tokens);
		const result = parser.parse();

		expect(result).toEqual(null);
	});
});

describe('objects', () => {
	test('simple objects', () => {
		const lexer = new Lexer('{ "a": 1, "b": false, "c": "foo", "d": null }');
		const tokens = lexer.lex();

		const parser = new Parser(tokens);
		const result = parser.parse();

		expect(result).toEqual({ a: 1, b: false, c: 'foo', d: null });
	});

	test('empty objects', () => {
		const lexer = new Lexer('{ "a": {} }');
		const tokens = lexer.lex();

		const parser = new Parser(tokens);
		const result = parser.parse();

		expect(result).toEqual({ a: {} });
	});

	test('nested object', () => {
		const lexer = new Lexer('{ "a": { "b": 1 } }');
		const tokens = lexer.lex();

		const parser = new Parser(tokens);
		const result = parser.parse();

		expect(result).toEqual({ a: { b: 1 } });
	});
});
