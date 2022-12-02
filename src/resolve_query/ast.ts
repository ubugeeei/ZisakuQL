export type OperationDefinition =
	| {
			operationType: OperationType;
			name: string;
			variables?: Variable[];
			selectionSet: SelectionSet;
	  }
	| SelectionSet;

export enum OperationType {
	Query,
	Mutation,
	Subscription,
}

export type Variable = {
	key: string;
	value: number;
};

export type SelectionSet = Field[];

export type Field = {
	name: string;
	selectionSet?: SelectionSet;
};
