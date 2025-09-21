import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = (url: string) => {
	const __filename = fileURLToPath(url);
	return path.dirname(__filename);
};
export { __dirname };
