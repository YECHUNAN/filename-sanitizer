import * as os from "os";
import * as path from "path";

type SanitizePair = { origin: string, replacement: string };

const darwinReplacements: SanitizePair[] = [
    { origin: "/", replacement: "%2F" },
    { origin: "\0", replacement: "%0" }
];

const windowsReplacements: SanitizePair[] = [
    { origin: "<", replacement: "%3C" },
    { origin: ">", replacement: "%3E" },
    { origin: ":", replacement: "%3A" },
    { origin: "\"", replacement: "%22" },
    { origin: "/", replacement: "%2F" },
    { origin: "\\", replacement: "%5C" },
    { origin: "|", replacement: "%7C" },
    { origin: "?", replacement: "%3F" },
    { origin: "*", replacement: "%2A" }
];

const linuxReplacements: SanitizePair[] = [
    { origin: "/", replacement: "%2F" },
    { origin: "\0", replacement: "%0" }
];

export class Sanitizer {
    public static sanitize(filename: string) {
        var platform = os.platform();
        if (platform === "win32") {
            // Windows
            return this.sanitizeWindows(filename);
        } else if (platform === "darwin") {
            // macOS
            return this.sanitizeDarwin(filename);
        } else {
            // Linux
            return this.sanitizeLinux(filename);
        }
    }

    public static sanitizePath(pathName: string): string {
        if (os.platform() === "win32") {
            // Windows
            return this.sanitizePathWindows(pathName);
        } else if (os.platform() === "darwin") {
            // macOS
            return this.sanitizePathDarwin(pathName);
        } else {
            // Linux
            return this.sanitizePathLinux(pathName);
        }
    }

    public static sanitizeWindows(filename: string): string {
        windowsReplacements.forEach((pair) => {
            filename = filename.split(pair.origin).join(pair.replacement);
        });
        // Encode control codes 0 - 31
        for (var controlCode = 0; controlCode <= 31; controlCode++) {
            filename = filename.split(String.fromCharCode(controlCode)).join(`%${controlCode}`);
        }
        return filename;
    }

    public static sanitizeDarwin(filename: string): string {
        darwinReplacements.forEach((pair) => {
            filename = filename.split(pair.origin).join(pair.replacement);
        });
        return filename;
    }

    public static sanitizeLinux(filename: string): string {
        linuxReplacements.forEach((pair) => {
            filename = filename.split(pair.origin).join(pair.replacement);
        });
        return filename;
    }

    public static sanitizePathWindows(pathName: string) {
        let pathSegments: string[];
        let UNCPrefix = pathName.startsWith("\\\\?\\") ? "\\\\?\\" : "";
        // handle UNC path, which start with \\?\
        if (!!UNCPrefix) {
            pathSegments = pathName.slice(4).split(path.sep);
        } else {
            pathSegments = pathName.split(path.sep);
        }
        // handle the disk part in path (e.g. C:)
        pathSegments = pathSegments.map((segmentName, index) => {
            if (index === 0 && /[a-zA-Z]:/.test(segmentName)) {
                return segmentName;
            }
            return this.sanitize(segmentName);
        });
        return UNCPrefix + pathSegments.join(path.sep);
    }

    public static sanitizePathDarwin(pathName: string) {
        let pathSegments: string[];
        pathSegments = pathName.split(path.sep);
        pathSegments = pathSegments.map((segmentName) => {
            return this.sanitize(segmentName);
        });
        return pathSegments.join(path.sep);
    }

    public static sanitizePathLinux(pathName: string) {
        let pathSegments: string[];
        pathSegments = pathName.split(path.sep);
        pathSegments = pathSegments.map((segmentName) => {
            return this.sanitize(segmentName);
        });
        return pathSegments.join(path.sep);
    }
}

/**
 * Use split/join to replace invalid characters to be valid characters as local filename
 * @param filename 
 * @param options 
 */
export function sanitize(filename: string) {
    return Sanitizer.sanitize(filename);
}
