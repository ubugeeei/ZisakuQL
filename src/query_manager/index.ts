import { Context } from "https://deno.land/x/hono@v2.5.7/context.ts";
import { Environment } from "https://deno.land/x/hono@v2.5.7/types.ts";
import { Schema } from "https://deno.land/x/hono@v2.5.7/validator/schema.ts";

export type ZisakuQLReturn = {
	data: unknown;
	errors: unknown[];
};

export const resolve = (
	// deno-lint-ignore no-unused-vars
	c: Context<string, Environment, Schema>["body"]
): ZisakuQLReturn => {
	return { data: "Hello! Hono!", errors: [] };
};
