import { serve } from "https://deno.land/std@0.167.0/http/server.ts";
import { Hono } from "https://deno.land/x/hono@v2.5.7/mod.ts";

const app = new Hono();

app.get("/zisakuql", (c) => {
	return c.json({ data: "Hello! Hono!", errors: [] });
});

serve(app.fetch);
