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
});
