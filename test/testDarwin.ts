import { Sanitizer } from "../src/Sanitizer";
import { expect } from "chai";

describe("Test darwin sanitizing", function() {
    it("Valid filename", function () {
        var filenameList = [
            "test File", // letter + space
            "123512", // number
            "~\`!@#$%^&*()_+-={}|[]\\:\";'<>,.?", // punctuations
            "\u0030ftx" // Control code except Null
        ];
        filenameList.forEach((filename) => {
            var sanitized = Sanitizer.sanitizeDarwin(filename);
            expect(sanitized).to.equals(filename, `Should not change valid filename ${filename} to ${sanitized}`);
        });
    });
    
    it("Encode \\0 in filename", function () {
        var filename = "testfile\0";
        var sanitized = Sanitizer.sanitizeDarwin(filename);
        expect(sanitized).to.equals("testfile%0", "Should encode null as %0 in filename");
    });

    it("Encode / in filename", function() {
        var filename = "testfile/";
        var sanitized = Sanitizer.sanitizeDarwin(filename);
        expect(sanitized).to.equals("testfile%2F", "Should encode / as %2F in filename");
    });

    it("Valid absolute path", function() {
        var filePath = "/User/username/Desktop/folder";
        var sanitized = Sanitizer.sanitizePathDarwin(filePath);
        expect(sanitized).to.equals(filePath, "Should keep valid absolute path as the same");
    });

    it("Valid relative path", function() {
        var filePath = "../folder/file";
        var sanitized = Sanitizer.sanitizePathDarwin(filePath);
        expect(sanitized).to.equals(filePath, "Should keep valid relative path as the same");
    });

    it("Invalid absolute path", function() {
        var filePath = "/User/username/\0/file";
        var sanitized = Sanitizer.sanitizePathDarwin(filePath);
        expect(sanitized).to.equals("/User/username/%0/file", "Should encode \\0 in the absolute path segments");
    });
    
    it("Invalid relative path", function() {
        var filePath = "../folder/\0/file";
        var sanitized = Sanitizer.sanitizePathDarwin(filePath);
        expect(sanitized).to.equals("../folder/%0/file", "Should encode \\0 in the relative path segments");
    });

    it("No name directory", function () {
        var filePath = ".//file";
        var sanitized = Sanitizer.sanitizePathDarwin(filePath);
        expect(sanitized).to.equals("./NO_NAME/file", "Should replace no name directory with 'NO_NAME'");
    });
});
