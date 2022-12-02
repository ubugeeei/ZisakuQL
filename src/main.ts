import { serve } from "https://deno.land/std@0.167.0/http/server.ts";
import { Hono } from "https://deno.land/x/hono@v2.5.7/mod.ts";
import { resolve } from "./query_manager/index.ts";

const app = new Hono();
app.get("/zisakuql", (c) => {
	const resObject = resolve(c.body);
	return c.json(resObject);
});
serve(app.fetch);
