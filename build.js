const os = require("os");
const platform = os.platform();
const child_process = require("child_process");
const fs = require("fs");
const path = require("path");

// build src files
if (platform === "win32") {
    var childProcess = child_process.exec(".\\node_modules\\.bin\\tsc --build");
    childProcess.stdout.pipe(process.stdout);
} else {
    var childProcess = child_process.exec("./node_modules/.bin/tsc --build");
    childProcess.stdout.pipe(process.stdout);
}

// copy non-test files to dist
fs.copyFileSync(path.resolve("out", "src", "index.js"), path.resolve("dist", "index.js"));
fs.copyFileSync(path.resolve("out", "src", "index.d.ts"), path.resolve("dist", "index.d.ts"));
fs.copyFileSync(path.resolve("out", "src", "Sanitizer.d.ts"), path.resolve("dist", "Sanitizer.d.ts"));
fs.copyFileSync(path.resolve("out", "src", "Sanitizer.js"), path.resolve("dist", "Sanitizer.js"));