export type Token = {
	type: TokenType;
	literal: string;
};

export enum TokenType {
	Query,
	Identifier,
	Number,
	LeftParen,
	RightParen,
	LeftBrace,
	RightBrace,
	Colon,
	EOF,
}
