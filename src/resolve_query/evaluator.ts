import { OperationDefinition, OperationType } from "./ast.ts";
import { ZisakuQLResolvers, ZisakuQLReturn } from "./index.ts";

export class Evaluator {
	// deno-lint-ignore no-explicit-any
	private resolver: ((...args: any[]) => any) | null;

	public constructor(
		private ast: OperationDefinition,
		private resolvers: ZisakuQLResolvers
	) {
		this.resolver = null;
	}

	public eval(): ZisakuQLReturn {
		let data: ZisakuQLReturn["data"] = null;
		const errors: ZisakuQLReturn["errors"] = [];

		this.findResolver();

		if (this.resolver) {
			data = {
				[this.ast.name]: this.execResolver(),
			};
		} else {
			errors.push({ message: `query not found '${this.ast.name}'` });
		}

		return { data, errors };
	}

	private findResolver() {
		switch (this.ast.operationType) {
			case OperationType.Query: {
				if (this.resolvers.Query) {
					this.resolver = this.resolvers.Query[this.ast.name] ?? null;
				}
				break;
			}
			default:
				break;
		}
	}

	private execResolver() {
		const data = this.resolver!(
			...(this.ast.variables ?? []).map((it) => it.value)
		);
		// TODO: select fields
		return data;
	}
}
