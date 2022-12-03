import { ZisakuQLResolvers } from "../resolve_query/index.ts";
import { InMemoryDB } from "./db.ts";

export const resolvers: ZisakuQLResolvers = {
	Query: {
		listTodos: () => {
			return InMemoryDB.todos;
		},
		getTodo: (id: number) => {
			return InMemoryDB.todos.find((it) => it.id === id);
		},
	},
};
