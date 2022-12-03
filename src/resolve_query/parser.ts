import { OperationDefinition, OperationType } from "./ast.ts";
import { Lexer } from "./lexer.ts";
import { Token } from "./token.ts";

export class Parser {
	private currentToken: Token;
	private peekedToken: Token;

	public constructor(private lexer: Lexer) {
		this.currentToken = lexer.next();
		this.peekedToken = lexer.next();
	}

	public parse(): OperationDefinition {
		return {
			operationType: OperationType.Query,
			name: "getTodo",
			variables: [{ key: "id", value: 1 }],
			selectionSet: [
				{ name: "name" },
				{ name: "description" },
				{ name: "dueDate" },
				{
					name: "owner",
					selectionSet: [{ name: "id" }, { name: "username" }],
				},
			],
		};
	}
}