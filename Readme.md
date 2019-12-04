# filename-sanitizer

Sanitize filename across Window, macOS and Linux.

Given `filename` as a utf-8 string, `sanitize(filename)` will encode the invalid characters in the filename to make it a valid filename on the current running platform.

On Windows, `<, >, :, ", /, \, |, ?, *` are encoded as their utf-8 value prefixed by a `%`. Control code 0-31 are encoded as their utf-8 value prefixed by a `%` as well.

On macOS and Linux, only `/, \0` are encoded as their utf-8 value prefixed by a `%`.

You can also explictly sanitize the filename targeting a platform different from the current one. For example, to sanitize a filename targeting Windows, invoke `Sanitizer.sanitizeWindows(filename)`