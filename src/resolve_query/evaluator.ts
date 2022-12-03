import { OperationDefinition } from "./ast.ts";
import { ZisakuQLResolvers } from "./index.ts";

export class Evaluator {
	// deno-lint-ignore no-explicit-any
	private resolver: ((...args: any[]) => any) | null;

	public constructor(
		private ast: OperationDefinition,
		private resolvers: ZisakuQLResolvers
	) {
		this.resolver = null;
	}
}
