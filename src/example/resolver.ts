import { ZisakuQLResolver } from "../resolve_query/index.ts";
import { InMemoryDB } from "./db.ts";

export const resolvers: ZisakuQLResolver = {
	Query: {
		listTodos: () => {
			return InMemoryDB.todos;
		},
		getTodo: (id: number) => {
			return InMemoryDB.todos.find((it) => it.id === id);
		},
	},
};
