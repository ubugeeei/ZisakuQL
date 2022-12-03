import {
	Field,
	OperationDefinition,
	OperationType,
	SelectionSet,
	Variable,
} from "./ast.ts";
import { Lexer } from "./lexer.ts";
import { Token, TokenType } from "./token.ts";

export class Parser {
	private currentToken: Token;

	public constructor(private lexer: Lexer) {
		this.currentToken = lexer.next();
	}

	public parse(): OperationDefinition | Error {
		const operationType = this.parseOperationType();
		if (operationType instanceof Error) return operationType;

		const name = this.parseName();
		if (name instanceof Error) return name;

		const variables = this.parseVariables();
		if (variables instanceof Error) return variables;

		const selectionSet = this.parseSelectionSet();
		if (selectionSet instanceof Error) return selectionSet;

		return {
			operationType,
			name,
			variables,
			selectionSet,
		};
	}

	private parseOperationType():
		| OperationDefinition["operationType"]
		| Error {
		// validation
		if (this.currentToken.type !== TokenType.Query) {
			return new Error(
				`ParseError: expect Query but got ${this.currentToken.type}`
			);
		}

		switch (this.currentToken.type) {
			case TokenType.Query: {
				this.next();
				return OperationType.Query;
			}
			default: {
				// validation
				return Error(
					`OperationType NotDefined of ${this.currentToken.literal}`
				);
			}
		}
	}

	private parseName(): OperationDefinition["name"] | Error {
		if (this.currentToken.type !== TokenType.Identifier) {
			// validation
			return new Error(
				`ParseError: expect Identifier but got ${this.currentToken.type}`
			);
		}

		const name = this.currentToken.literal;
		this.next();
		return name;
	}

	private parseVariables(): OperationDefinition["variables"] | Error {
		if (this.currentToken.type !== TokenType.LeftParen) {
			return undefined;
		}

		this.next();
		const variables: Variable[] = [];
		// deno-lint-ignore ban-ts-comment
		// @ts-ignore
		while (this.currentToken.type !== TokenType.RightParen) {
			const v = this.parseVariable();
			if (v instanceof Error) return v;
			variables.push(v);
		}

		this.next();
		return variables;
	}

	private parseVariable(): Variable | Error {
		if (this.currentToken.type !== TokenType.Identifier) {
			// validation
			return new Error(
				`ParseError: expect Identifier but got ${this.currentToken.type}`
			);
		}

		const key = this.currentToken.literal;

		this.next();
		// deno-lint-ignore ban-ts-comment
		// @ts-ignore
		if (this.currentToken.type !== TokenType.Colon) {
			// validation
			return new Error(
				`ParseError: expect Colon but got ${this.currentToken.type}`
			);
		}

		this.next();
		if (this.currentToken.type !== TokenType.Number) {
			// validation
			return new Error(
				`ParseError: expect Number but got ${this.currentToken.type}`
			);
		}

		const value = parseInt(this.currentToken.literal);

		this.next();
		return { key, value };
	}

	private parseSelectionSet():
		| OperationDefinition["selectionSet"]
		| Error {
		if (this.currentToken.type !== TokenType.LeftBrace) {
			return [];
		}

		this.next(); // skip LeftBrace

		const selectionSet: OperationDefinition["selectionSet"] = [];
		// deno-lint-ignore ban-ts-comment
		// @ts-ignore
		while (this.currentToken.type === TokenType.Identifier) {
			const field = this.parseField();
			if (field instanceof Error) return field;
			selectionSet.push(field);
		}

		return selectionSet;
	}

	private parseField(): Field | Error {
		if (this.currentToken.type !== TokenType.Identifier) {
			// validation
			return new Error(
				`ParseError: expect Identifier but got ${this.currentToken.type}`
			);
		}
		const name = this.currentToken.literal;
		this.next();

		let selectionSet: SelectionSet | undefined = undefined;
		// deno-lint-ignore ban-ts-comment
		// @ts-ignore
		if (this.currentToken.type === TokenType.LeftBrace) {
			this.next(); // slip LeftBrace
			selectionSet = [];
			while (this.currentToken.type !== TokenType.RightBrace) {
				const r = this.parseField();
				if (r instanceof Error) return r;
				selectionSet.push(r);
			}
		}
		return { name, selectionSet };
	}

	private next() {
		this.currentToken = this.lexer.next();
	}
}

Deno.test("test Parser", async () => {
	const { assertEquals } = await import(
		"https://deno.land/std@0.167.0/testing/asserts.ts"
	);

	const query = `
    query getTodo(id: 1) {
      name
      description
      dueDate
      owner {
        id
        username
      }
    }
  `;

	const lx = new Lexer(query);
	const p = new Parser(lx);

	assertEquals(p.parse(), {
		operationType: OperationType.Query,
		name: "getTodo",
		variables: [{ key: "id", value: 1 }],
		selectionSet: [
			{ name: "name", selectionSet: undefined },
			{ name: "description", selectionSet: undefined },
			{ name: "dueDate", selectionSet: undefined },
			{
				name: "owner",
				selectionSet: [
					{ name: "id", selectionSet: undefined },
					{ name: "username", selectionSet: undefined },
				],
			},
		],
	});
});
