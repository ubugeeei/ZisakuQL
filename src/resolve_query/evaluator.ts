import { OperationDefinition, OperationType } from "./ast.ts";
import { ZisakuQLResolvers, ZisakuQLReturn } from "./index.ts";

export class Evaluator {
	public constructor(
		private ast: OperationDefinition,
		private resolvers: ZisakuQLResolvers
	) {}

	public eval(): ZisakuQLReturn {
		let data: ZisakuQLReturn["data"] = null;
		const errors: ZisakuQLReturn["errors"] = [];

		const resolver = this.findResolver();

		if (resolver) {
			data = {
				[this.ast.name]: this.resolve(resolver),
			};
		} else {
			errors.push({ message: `query not found '${this.ast.name}'` });
		}

		return { data, errors };
	}

	// deno-lint-ignore no-explicit-any
	private findResolver(): ((...args: any[]) => any) | null {
		switch (this.ast.operationType) {
			case OperationType.Query: {
				if (!this.resolvers.Query) return null;
				return this.resolvers.Query[this.ast.name] ?? null;
			}
			default:
				return null;
		}
	}

	private resolve(
		// deno-lint-ignore no-explicit-any
		resolver: (...args: any[]) => any
	): Record<string, unknown> | Record<string, unknown>[] | null {
		const data = resolver(
			...(this.ast.variables ?? []).map((it) => it.value)
		);
		return this.selectFields(data);
	}

	private selectFields(
		data: Record<string, unknown> | Record<string, unknown>[]
	): Record<string, unknown> | Record<string, unknown>[] {
		if (this.ast.selectionSet.length === 0) return {};

		return Array.isArray(data)
			? data.map((it) =>
					this._selectFields(it, this.ast.selectionSet)
			  )
			: this._selectFields(data, this.ast.selectionSet);
	}

	private _selectFields(
		data: Record<string, unknown>,
		selectionSet: OperationDefinition["selectionSet"]
	) {
		const result: Record<string, unknown> = {};
		selectionSet.forEach((it) => {
			const value = data[it.name];
			if (
				it.selectionSet?.length &&
				typeof value === "object" &&
				value !== null
			) {
				result[it.name] = this._selectFields(
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
