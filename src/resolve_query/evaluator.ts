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

	private execResolver(): Record<string, unknown> | null {
		const data = this.resolver!(
			...(this.ast.variables ?? []).map((it) => it.value)
		);
		return this.selectFields(data, this.ast.selectionSet);
	}

	private selectFields(
		data: Record<string, unknown>,
		selectionSet: OperationDefinition["selectionSet"]
	): Record<string, unknown> {
		if (selectionSet.length === 0) return {};

		const result: Record<string, unknown> = {};

		selectionSet.forEach((it) => {
			const value = data[it.name];
			if (
				it.selectionSet?.length &&
				typeof value === "object" &&
				value !== null
			) {
				result[it.name] = this.selectFields(
					value as Record<string, unknown>,
					it.selectionSet
				);
			} else {
				result[it.name] = value;
			}
		});

		return result;
	}
}
