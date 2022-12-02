import { serve } from "https://deno.land/std@0.167.0/http/server.ts";
import { Hono } from "https://deno.land/x/hono@v2.5.7/mod.ts";
import { resolveQuery } from "./resolve_query/index.ts";

const app = new Hono();

app.post("/zisakuql", async (c) => {
	const requestBody = await c.req.text();

	const res = resolveQuery(requestBody);

	return c.json(res);
});

serve(app.fetch);
