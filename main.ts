import { homedir } from "node:os";
import * as path from "node:path";
import { uuidv7 } from "npm:uuidv7";

const watcher = Deno.watchFs(`${homedir()}/Downloads/`, { recursive: false });

console.log("Watching for downloads...");

for await (const event of watcher) {
	if (event.kind !== "create") continue;
	const [filePath] = event.paths;
	const info = Deno.lstatSync(filePath);
	if (!info.isFile) continue;
	setTimeout(() => {
		Deno.renameSync(filePath, `${path.dirname(filePath)}/${uuidv7()}${path.extname(filePath)}`);
		console.log(`Renamed ${path.basename(filePath)}!`)
	}, 100);
}