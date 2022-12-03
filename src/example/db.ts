export type Todo = {
	id: number;
	name: string;
	description?: string;
	dueDate?: string;
	owner: {
		id: number;
		username: string;
	};
};

export const InMemoryDB: { todos: Todo[] } = {
	todos: [
		{
			name: "Todo1",
			id: 1,
			description: "This todo is monthly todo",
			owner: {
				id: 1001,
				username: "Jeff",
			},
		},
		{
			name: "Todo2",
			id: 2,
			owner: {
				id: 1002,
				username: "Jeff",
			},
		},
		{
			name: "Todo3",
			id: 3,
			description: "ZisakuQL is good",
			owner: {
				id: 1003,
				username: "Mike",
			},
		},
		{
			name: "Todo1",
			id: 4,
			description: "Zisaku 315",
			owner: {
				id: 1004,
				username: "Bob",
			},
		},
	],
};
