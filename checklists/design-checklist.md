# Design Checklist

Best practices concerning the high-level design of functions that are not specific to React, Typescript, or Javascript.

### DE-01: Can you refactor to reduce duplication?

Are there blocks of code with more than a few lines of code that look similar? Is it possible to refactor to reduce duplication?

### DE-02: Avoid deeply nested conditionals.

Are there multiple, deeply nested if/else blocks?

### DE-03: Eliminate dead code.

Is there unused/unreachable code?

### DE-04: Eliminate large comment blocks.

Is there a large amount of commented out code? If so, move it to the archive/ directory.

### DE-05: Ensure comments are appropriate.

Are there unnecessary comments? Comments that describe the _how_? If so, eliminate them.

Is there complex and/or unintuitive code? Please add a comment to explain the _why_.

If you see improvements that cannot be made immediately, add a comment prefaced by "TODO:".

### DE-06: Ensure code is readable.

Is the code readable? Code should be self-explanatory. Do you get a feeling a reading a story as you go through the code?

### DE-07: Ensure code is DRY.

Does the code conform to the Agile Maxim of "Do not Repeat Yourself"? The same code should not be repeated more than twice.

### DE-08: Ensure reusable code is exported or made available in the appropriate place.

Are there reusable services, functions and components that are not made available for reuse? Are they in a `utilities` directory?

