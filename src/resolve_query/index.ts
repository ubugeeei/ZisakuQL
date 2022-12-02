export type ZisakuQLReturn = {
	data: unknown;
	errors: { message: string }[];
};

export const resolveQuery = (
	reqBodyString: string
): ZisakuQLReturn => {
	let data: ZisakuQLReturn["data"] = null;
	const errors: ZisakuQLReturn["errors"] = [];

	if (reqBodyString === "japanese") {
		data = "こんにちは、世界！";
	} else if (reqBodyString === "english") {
		data = "Hello, world!";
	} else {
		errors.push({ message: "Invalid request body" });
	}

	return { data, errors };
};
