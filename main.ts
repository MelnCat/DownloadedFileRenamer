import { homedir } from "node:os";
import * as path from "node:path";
import { uuidv7 } from "npm:uuidv7";

const watcher = Deno.watchFs(`${homedir()}/Downloads/`, { recursive: false });

for await (const event of watcher) {
	if (event.kind !== "create") continue;
	const [file] = event.paths;
	const info = Deno.lstatSync(file);
	if (!info.isFile) continue;
	const opened = await Deno.open
	Deno.flockSync(file);
	Deno.renameSync(file, `${path.dirname(file)}/${uuidv7()}${path.extname(file)}`);
	Deno.funlockSync(file);
}