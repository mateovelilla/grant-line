const fs = require("node:fs");
const path = require("node:path");

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
