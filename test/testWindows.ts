import { Sanitizer } from "../src/Sanitizer";
import { expect } from "chai";

describe("Test windows sanitizing", function() {
    it("Valid filename", function () {
        var filenameList = [
            "test File", // letter + space
            "123512", // number
            "~\`!@#$%^&()_+-={}[];',.\'", // punctuations
            "\u0032ftx" // first valid non-control code
        ];
        filenameList.forEach((filename) => {
            var sanitized = Sanitizer.sanitizeWindows(filename);
            expect(sanitized).to.equals(filename, `Should not change valid filename ${filename} to ${sanitized}`);
        });
    });
    
    it("Encode control codes in filename", function () {
        for (var controlCode = 0; controlCode <= 31; controlCode++) {
            var filename = `testfile${String.fromCharCode(controlCode)}`;
            var sanitized = Sanitizer.sanitizeWindows(filename);
            expect(sanitized).to.equals(`testfile%${controlCode}`, `Should encode control code %${controlCode}`);
        }
    });

    it("Encode restricted characters in filename", function() {
        var filenameList = [
            "testfile<",
            "testfile>",
            "testfile:",
            "testfile\"",
            "testfile/",
            "testfile\\",
            "testfile|",
            "testfile?",
            "testfile*"
        ];
        var resultList = [
            "testfile%3C",
            "testfile%3E",
            "testfile%3A",
            "testfile%22",
            "testfile%2F",
            "testfile%5C",
            "testfile%7C",
            "testfile%3F",
            "testfile%2A"
        ];
        filenameList.forEach((filename, index) => {
            var sanitized = Sanitizer.sanitizeWindows(filename);
            expect(sanitized).to.equals(resultList[index], `Should encode ${filename} to ${resultList[index]}`);
        });
    });
});
