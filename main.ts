import { homedir } from "node:os";
import * as path from "node:path";
import { uuidv7 } from "npm:uuidv7";

const watcher = Deno.watchFs(`${homedir().replaceAll("\\", "/")}/Downloads/`, { recursive: false });

console.log("Watching for downloads...");

for await (const event of watcher) {
	if (event.kind !== "create") continue;
	const [filePath] = event.paths;
	setTimeout(() => {
		try {
			const info = Deno.lstatSync(filePath);
			if (!info.isFile) return;
			Deno.renameSync(filePath, `${path.dirname(filePath)}/${uuidv7()}${path.extname(filePath)}`);
			console.log(`Renamed ${path.basename(filePath)}!`);
		} catch {}
	}, 500);
}
