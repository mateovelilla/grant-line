import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, "../../src");
const DIST_DIR = path.join(__dirname, "../../dist");

function copyGraphqlFiles(srcDir: string, distDir: string) {
	if (!fs.existsSync(distDir)) {
		fs.mkdirSync(distDir, { recursive: true });
	}

	const entries = fs.readdirSync(srcDir, { withFileTypes: true });

	for (const entry of entries) {
		const srcPath = path.join(srcDir, entry.name);
		const distPath = path.join(distDir, entry.name);

		if (entry.isDirectory()) {
			copyGraphqlFiles(srcPath, distPath);
		} else if (entry.isFile() && entry.name.endsWith(".graphql")) {
			fs.copyFileSync(srcPath, distPath);
			console.log(`✅ Copied: ${srcPath} -> ${distPath}`);
		}
	}
}

copyGraphqlFiles(SRC_DIR, DIST_DIR);
