import { resolvers } from "../example/resolver.ts";
import { Evaluator } from "./evaluator.ts";
import { Lexer } from "./lexer.ts";
import { Parser } from "./parser.ts";

export type ZisakuQLReturn = {
	data: unknown;
	errors: { message: string }[];
};

export type ZisakuQLResolvers = {
	Query?: {
		// deno-lint-ignore no-explicit-any
		[key: string]: (...args: any[]) => any;
	};
};

export const resolveQuery = (
	reqBodyString: string
): ZisakuQLReturn => {
	const lexer = new Lexer(reqBodyString);
	const parser = new Parser(lexer);

	const ast = parser.parse();
	if (ast instanceof Error) {
		return { data: null, errors: [{ message: "ParseError" }] };
	} else {
		const evaluator = new Evaluator(ast, resolvers);
		return evaluator.eval();
	}
};
