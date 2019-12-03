const os = require("os");
const platform = os.platform();
const child_process = require('child_process');

if (platform === "win32") {
    var childProcess = child_process.exec(".\\node_modules\\.bin\\mocha .\\out\\test\\*./js");
    childProcess.stdout.pipe(process.stdout);
} else {
    var childProcess = child_process.exec("./node_modules/.bin/mocha ./out/test/*.js");
    childProcess.stdout.pipe(process.stdout);
}
